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
  const topFive = [];

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
}

function getTopPlayersByScore(currentRosterParsed) {
  // find top 5 players per score in current roster
}

console.log(
  await getWeeklyTopPlayers(previousRosterParsed, currentRosterParsed),
);
