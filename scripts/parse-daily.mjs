import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "src/data");

const parsedDataPath = path.join(dataDir, "parsed-data.json");
const currentRosterPath = path.join(dataDir, "guild-roster-current.json");

const currentRosterParsed = JSON.parse(
  fs.readFileSync(currentRosterPath, "utf8"),
);

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

function readParsedData() {
  if (!fs.existsSync(parsedDataPath)) return {};
  return JSON.parse(fs.readFileSync(parsedDataPath, "utf8"));
}

function main() {
  const parsedData = readParsedData();

  fs.writeFileSync(
    parsedDataPath,
    JSON.stringify({
      ...parsedData,
      top_players_by_role: getTopPlayersByRole(currentRosterParsed),
      top_players_by_score: getTopPlayersByScore(currentRosterParsed),
    }),
  );
}

main();
