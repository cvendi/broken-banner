import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "src/data");

const parsedDataPath = path.join(dataDir, "parsed-data.json");
const currentRosterPath = path.join(dataDir, "guild-roster-current.json");
const previousRosterPath = path.join(dataDir, "guild-roster-previous.json");

const currentRosterData = fs.readFileSync(currentRosterPath, "utf8");
const previousRosterData = fs.readFileSync(previousRosterPath, "utf8");

const currentRosterParsed = JSON.parse(currentRosterData);
const previousRosterParsed = JSON.parse(previousRosterData);

function getWeeklyTopPlayers(previousRosterParsed, currentRosterParsed) {
  // compare both rosters to find rating changes per week
  const ratingChanged = [];

  for (const member of currentRosterParsed.members) {
    const previousPlayer = previousRosterParsed.members.find(
      (player) => player.name === member.name,
    );

    const currentScore =
      member.mythic_plus_scores_by_season[0]?.scores.all ?? 0;
    const previousScore =
      previousPlayer?.mythic_plus_scores_by_season[0]?.scores.all ?? 0;

    if (previousPlayer && currentScore !== 0) {
      const ratingChange = currentScore - previousScore;
      if (ratingChange !== 0) {
        ratingChanged.push({
          player: member.name,
          ratingChange: Math.floor(ratingChange),
        });
      }
    }
  }

  ratingChanged.sort((a, b) => b.ratingChange - a.ratingChange);
  return ratingChanged.slice(0, 5);
}

function getTopPlayersByRole(currentRosterParsed) {
  // find top 3 players per role in current roster
  // sort players by role
  // determine top 3 scores of all sorted players
  // return top 3 players per role

  const membersByRole = {};

  for (const member of currentRosterParsed.members) {
    const role = member.active_spec_role;

    if (!membersByRole[role]) {
      membersByRole[role] = [];
    }

    membersByRole[role].push({
      player: member.name,
      score: member.mythic_plus_scores_by_season[0]?.scores.all ?? 0,
    });
  }

  for (const role in membersByRole) {
    membersByRole[role].sort((a, b) => b.score - a.score);
    membersByRole[role] = membersByRole[role].slice(0, 3);
  }
  return membersByRole;
}

function getTopPlayersByScore(currentRosterParsed) {
  // find top 5 players per score in current roster

  const topPlayers = [];

  for (const member of currentRosterParsed.members) {
    const score = member.mythic_plus_scores_by_season[0]?.scores.all ?? 0;

    topPlayers.push({
      player: member.name,
      score: score,
    });
  }

  topPlayers.sort((a, b) => b.score - a.score);
  return topPlayers.slice(0, 5);
}

function main() {
  const topPlayersByRole = getTopPlayersByRole(currentRosterParsed);
  const topPlayersByScore = getTopPlayersByScore(currentRosterParsed);
  const topWeeklyPlayers = getWeeklyTopPlayers(
    previousRosterParsed,
    currentRosterParsed,
  );

  fs.writeFileSync(
    parsedDataPath,
    JSON.stringify({
      top_players_by_role: topPlayersByRole,
      top_players_by_score: topPlayersByScore,
      top_weekly_players: topWeeklyPlayers,
    }),
  );
}

main();
