import fs from "node:fs/promises";

const teams = JSON.parse(await fs.readFile("data/teams-2025.json", "utf8"));

const europe = teams
  .filter((t) => (t.region ?? "").toLowerCase() === "europe")
  .sort((a, b) => a.name.localeCompare(b.name, "en"));

const lines = europe.map((t) => `${t.name} (${t.country})`);
lines.push("Not listed");

await fs.writeFile("data/dropdown-europe.txt", lines.join("\n") + "\n", "utf8");

console.log(`Europe teams: ${europe.length}`);
console.log("Saved: data/dropdown-europe.txt");
console.log("First 10:");
for (const l of lines.slice(0, 10)) console.log(" - " + l);
console.log("Last 5:");
for (const l of lines.slice(-5)) console.log(" - " + l);
