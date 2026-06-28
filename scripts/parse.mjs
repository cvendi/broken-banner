import { writeFile, readFile } from "fs/promises";

const currentRoster = "src/data/guild-roster-current.json";
const previousRoster = "src/data/guild-roster-previous.json";

async function getWeeklyTopPlayers(previousRoster, currentRoster) {
  // compare both rosters to find highest rating changes per week
  const currentRosterData = await readFile(currentRoster, "utf8");
  const previousRosterData = await readFile(previousRoster, "utf8");

  const currentRosterParsed = JSON.parse(currentRosterData);
  const previousRosterParsed = JSON.parse(previousRosterData);

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
        console.log(
          `Player ${member.name} has a rating change of ${Math.floor(ratingChange)}`,
        );
      }
    }
  }
}

function getTopPlayersByRole(currentRoster) {
  // find top 3 players per role in current roster
}

function getTopPlayersByScore(currentRoster) {
  // find top 5 players per score in current roster
}

getWeeklyTopPlayers(previousRoster, currentRoster);
