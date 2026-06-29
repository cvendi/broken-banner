import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "src/data");

const parsedDataPath = path.join(dataDir, "parsed-data.json");
const currentRosterPath = path.join(dataDir, "guild-roster-current.json");
const weeklySnapshotPath = path.join(
  dataDir,
  "guild-roster-weekly-snapshot.json",
);

const currentRosterParsed = JSON.parse(
  fs.readFileSync(currentRosterPath, "utf8"),
);
const weeklySnapshotParsed = JSON.parse(
  fs.readFileSync(weeklySnapshotPath, "utf8"),
);

function getWeeklyTopPlayers(weeklySnapshotParsed, currentRosterParsed) {
  // compare current roster to last week's snapshot to find rating changes per week
  const ratingChanged = [];

  for (const member of currentRosterParsed.members) {
    const snapshotPlayer = weeklySnapshotParsed.members.find(
      (player) => player.name === member.name,
    );

    const currentScore =
      member.mythic_plus_scores_by_season[0]?.scores.all ?? 0;
    const snapshotScore =
      snapshotPlayer?.mythic_plus_scores_by_season[0]?.scores.all ?? 0;

    if (snapshotPlayer && currentScore !== 0) {
      const ratingChange = currentScore - snapshotScore;
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

function readParsedData() {
  if (!fs.existsSync(parsedDataPath)) return {};
  return JSON.parse(fs.readFileSync(parsedDataPath, "utf8"));
}

function main() {
  const parsedData = readParsedData();
  const topWeeklyPlayers = getWeeklyTopPlayers(
    weeklySnapshotParsed,
    currentRosterParsed,
  );

  fs.writeFileSync(
    parsedDataPath,
    JSON.stringify({
      ...parsedData,
      top_weekly_players: topWeeklyPlayers,
    }),
  );

  // Roll the snapshot forward so next week's run diffs against this week's data
  fs.writeFileSync(
    weeklySnapshotPath,
    JSON.stringify(currentRosterParsed, null, 2),
  );
}

main();
