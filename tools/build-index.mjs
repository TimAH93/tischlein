// Builds recipes/index.json from all recipe files in recipes/.
// Run after adding or renaming a recipe:  node tools/build-index.mjs
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "recipes");
const files = (await readdir(dir)).filter((f) => f.endsWith(".json") && f !== "index.json");

const recipes = [];
for (const file of files) {
  const r = JSON.parse(await readFile(join(dir, file), "utf8"));
  if (`${r.id}.json` !== file) throw new Error(`${file}: id "${r.id}" does not match the file name`);
  recipes.push({
    id: r.id,
    title: r.title,
    base_servings: r.base_servings,
    status: r.status,
    rating: r.rating ?? null,
    tags: r.tags ?? [],
  });
}
recipes.sort((a, b) => a.title.localeCompare(b.title, "de"));

await writeFile(join(dir, "index.json"), JSON.stringify(recipes, null, 2) + "\n");
console.log(`recipes/index.json: ${recipes.length} recipe(s)`);
