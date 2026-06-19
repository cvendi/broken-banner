import { writeFile } from "fs/promises";
import filterConfig from "../data/roster-filter.json" with { type: "json" };

const REGION = "us";
const REALM = "area-52";
const GUILD_NAME = "Broken Banner";

async function fetchGuildRoster() {
  const url = `https://raider.io/api/v1/guilds/profile?region=${REGION}&realm=${REALM}&name=${encodeURIComponent(GUILD_NAME)}&fields=members`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Guild fetch failed: ${res.status}`);
  const data = await res.json();
  return data.members;
}

function filterRoster(members) {
  return members
    .filter((m) => filterConfig.mainRanks.includes(m.rank))
    .filter((m) => !filterConfig.excludedNames.includes(m.character.name));
}

async function fetchCharacterScore(realm, name) {
  const url = `https://raider.io/api/v1/characters/profile?region=${REGION}&realm=${realm}&name=${encodeURIComponent(name)}&fields=mythic_plus_scores_by_season:current`;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`Failed to fetch ${name}: ${res.status}`);
    return null;
  }
  return res.json();
}

async function main() {
  console.log("Fetching guild roster...");
  const roster = await fetchGuildRoster();
  const filtered = filterRoster(roster);
  console.log(`Filtered ${roster.length} members down to ${filtered.length}`);

  const results = [];
  for (const member of filtered) {
    const data = await fetchCharacterScore(
      member.character.realm,
      member.character.name,
    );
    if (data) results.push(data);
    await new Promise((r) => setTimeout(r, 250));
  }

  await writeFile(
    "src/data/guild-roster.json",
    JSON.stringify(
      { updatedAt: new Date().toISOString(), members: results },
      null,
      2,
    ),
  );
  console.log(`Wrote ${results.length} characters to guild-roster.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
