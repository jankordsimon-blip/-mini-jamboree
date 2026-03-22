import fs from "node:fs/promises";

const BASE = "https://api.igem.org/v1/teams";
const year = 2025;
const pageSize = 100;

async function fetchJson(url) {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} for ${url}\n${text.slice(0, 500)}`);
  }
  return res.json();
}

function formatOption(team) {
  const name = team.name ?? team.teamName ?? team.title ?? "Unknown team";
  const institution =
    team.institution ?? team.institutionName ?? team.university ?? team.school ?? team.primaryInstitution;
  const country = team.country ?? team.countryName ?? team.location?.country ?? team.address?.country;

  if (institution && country) return `${name} — ${institution} (${country})`;
  if (institution) return `${name} — ${institution}`;
  if (country) return `${name} (${country})`;
  return `${name}`;
}

async function main() {
  let page = 1;
  const all = [];

  while (true) {
    const url = `${BASE}?page=${page}&pageSize=${pageSize}&order=DESC&year=${year}`;
    const data = await fetchJson(url);

    const items = Array.isArray(data) ? data : (data.data ?? data.items ?? data.teams ?? []);
    console.log(`page ${page}: ${items.length} teams`);

    if (!items.length) break;
    all.push(...items);

    if (items.length < pageSize) break;
    page += 1;
  }

  await fs.writeFile("data/teams-2025.json", JSON.stringify(all, null, 2), "utf8");
  console.log(`saved data/teams-2025.json (${all.length} total)`);

  const options = all.map(formatOption).filter(Boolean);
  await fs.writeFile("data/dropdown-all.txt", options.join("\n") + "\n", "utf8");
  console.log(`saved data/dropdown-all.txt (${options.length} lines)`);

  console.log("\nSample options:");
  for (const line of options.slice(0, 10)) console.log(" - " + line);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
