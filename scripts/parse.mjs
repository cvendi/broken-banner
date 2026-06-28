import { writeFile, readFile } from "fs/promises";

const currentRoster = "src/data/guild-roster-current.json";
const previousRoster = "src/data/guild-roster-previous.json";

const currentRosterData = await readFile(currentRoster, "utf8");
const previousRosterData = await readFile(previousRoster, "utf8");

const currentRosterParsed = JSON.parse(currentRosterData);
const previousRosterParsed = JSON.parse(previousRosterData);

async function getWeeklyTopPlayers(previousRosterParsed, currentRosterParsed) {
  // compare both rosters to find rating changes per week
  const ratingChanged = [];

  for (const member of currentRosterParsed.members) {
    const previousPlayer = previousRosterParsed.members.find(
      (player) => player.name === member.name,
    );

    if (
      previousPlayer &&
      member.mythic_plus_scores_by_season[0].scores.all !== 0
    ) {
      const ratingChange =
        member.mythic_plus_scores_by_season[0].scores.all -
        previousPlayer.mythic_plus_scores_by_season[0].scores.all;
      if (ratingChange !== 0) {
        ratingChanged.push({
          name: member.name,
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
      score: member.mythic_plus_scores_by_season[0].scores.all,
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
}

console.log(
  await getWeeklyTopPlayers(previousRosterParsed, currentRosterParsed),
);

console.log(getTopPlayersByRole(currentRosterParsed));
