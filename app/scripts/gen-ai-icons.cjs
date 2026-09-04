const fs = require("fs");
const si = require("simple-icons");
const pick = { claude: "claude", gemini: "googlegemini", copilot: "githubcopilot", langchain: "langchain" };
const lines = [];
lines.push("/* Brand paths generated from simple-icons (CC0). Trademarks belong to their owners. */");
lines.push("/* Regenerate: node scripts/gen-ai-icons.cjs */");
lines.push("export const BRAND_ICONS = {");
for (const [key, slug] of Object.entries(pick)) {
  const icon = Object.values(si).find((i) => i && i.slug === slug);
  if (!icon) throw new Error("missing " + slug);
  lines.push("  " + key + ": {");
  lines.push("    title: " + JSON.stringify(icon.title) + ",");
  lines.push("    hex: " + JSON.stringify("#" + icon.hex) + ",");
  lines.push("    path: " + JSON.stringify(icon.path) + ",");
  lines.push("  },");
}
lines.push("}");
lines.push("");
fs.writeFileSync("src/components/brandIcons.js", lines.join("\n"));
console.log("wrote src/components/brandIcons.js");
