# Tischlein deck dich – Rezepte, Vorrat & Nährwerte – Handover (18 Oct 2026)

Purpose: commit this file into the new repo `tischlein` as `docs/HANDOVER.md`, plus a short `CLAUDE.md` that says "read docs/HANDOVER.md first" so a fresh chat has the full context from the planning chat of 10–18 Oct 2026. Everything below was worked out or decided in that chat.

---

## 1. The project in one paragraph

A recipe app for the user's tablet (Samsung Galaxy) with all his own recipes: portions can be scaled up and down, with photos of dishes he cooked and of dishes he still wants to cook. Public repo is fine. Second part: a pantry ("Smart Pantry") that knows which ingredients he has at home, so the app can answer "what can I cook with what I have?" and warn about things that were opened long ago. The pantry idea may live inside his workshop helper app **Heinzelmännchen** (it has a relational database), with the cookbook reading from it. This is still an open decision (see section 13).

## 1a. Name and story (decided)

- **Name: "Tischlein deck dich"**, repo name **`tischlein`** (short, no umlauts, GitHub Pages address friendly). Sibling projects have the same spirit: *Heinzelmännchen* (workshop helper app) and *Fummelfürst* (guitar improvisation trainer).
- Subtitle in the app: "Rezepte, Vorrat & Nährwerte".
- GitHub "About" text: *Tischlein deck dich: mein Kochbuch mit Rezepten, Vorrat und Nährwerten. Portionen skalieren, Gerichte bewerten, sehen was ich kochen kann und verstehen, was im Essen steckt.*
- Short variant: *Rezepte, Vorrat und Nährwerte. Das Tischlein, das sich selbst deckt.*
- GitHub topics: `recipes`, `cookbook`, `pwa`, `nutrition`, `meal-prep`, `pantry`.
- First README line: *Tischlein deck dich ist mein persönliches Kochbuch fürs Tablet: Rezepte mit skalierbaren Portionen, ein Vorrat, der Gerichte vorschlägt, und Nährwerte, die man anklicken und verstehen kann.*

**Why it fits (he wanted to understand this before deciding):** Grimm fairy tale "Tischlein deck dich, Goldesel und Knüppel aus dem Sack". A tailor's three sons each learn a trade and get a magic gift: the eldest (carpenter) a little table that serves food and drink on "Tischlein, deck dich"; the second (miller) a donkey that spits gold coins on "Bricklebrit"; the youngest (turner) a sack with a cudgel that beats on command ("Knüppel, aus dem Sack"). An innkeeper swaps the first two gifts for fakes; the youngest gets everything back with the cudgel. The table that sets itself matches the app (the pantry suggests dishes; the recipe brings its nutrition with it), and the table is a carpenter's gift, which suits him as a woodworker.

**Feature names taken from the story and the name brainstorm:**
- **Nährwichtel:** the nutrition explainer (click "niacin", get an explanation). *Wichtel* matches Heinzelmännchen.
- **Goldesel:** cost per portion.
- **Knüppel aus dem Sack:** warnings for things opened too long ago.

Rejected names: Räuber Hotzenplotz (protected book character), Rübezahl (no recipe link), Küchenkobold (too generic), Makrönchen (he does not like it). Also considered: Töpfchen (from "Der süße Brei"), Niesmitlust, Topfgucker, Löffelfürst, Gewürzwichtel.

## 1b. Nutrition feature (new idea, same day)

Goal: understand nutrition through the app. He wants a macro- and micronutrient breakdown:
1. Per **ingredient**: click an ingredient in the list and see its macros and micronutrients (per 100 g, and for the amount in the recipe).
2. Per **portion**: click a portion and see the sum for that portion (scales with the portion slider).
3. **Click a nutrient to learn what it does** (e.g. niacin = vitamin B3, helps turn food into energy and supports nerves and skin). These texts live in a small glossary file.
4. Dishes can be **rated** (his own rating), and the app tracks **cooked** vs **wishlist** recipes ("recipes I want to do").

Data source suggestion: USDA FoodData Central (free, includes micronutrients). Check licenses before using other databases. Nutrients are stored per 100 g on each ingredient category (the same `category` used for pantry matching), and recipe values are sums over the scaled amounts. Cooking losses are ignored in version 1.

## 2. Cooking context

- Good home cook, loves cooking for himself, his girlfriend and his mother. Wants tasty, healthy food with little active time; big batches that freeze well are ideal.
- Kitchen: cast-iron pan, induction hob, microwave, a big pot (fits 9 portions). **No wok**, so stir-fries are made in a heavy pan. **No fume hood** (open window only, 29 Oct 2026): he loves restaurant-style wok cooking but worries about oil fumes, so stir-fry recipes should be written for the pan, in small batches, with oil kept below its smoke point. He has decided (29 Oct) that smoky high-heat cooking is not for his current kitchen; a proper kitchen with a fume hood is a long-term wish. He owns a **gas camping stove** and wants to cook with it outdoors, which is where wok-style dishes could go later (recipe tool tag `gas-outdoor`).
- Gear reality (29 Oct 2026): the cast-iron pan is very big and heavy, so it is not the daily pan; an old Teflon pan still works, plus one more working pan; pots are thin on the ground (one is too small). He threw away small cast-iron pans and a bigger pot in the past and regrets it. **Budget is tight**, no new gear for now; a 28 cm carbon-steel pan (cheap or secondhand) is the first thing to buy when possible. Recipes should assume: one big heavy pan, one non-stick pan, the big pot.
- Habit: smells each new sauce, then tastes it plain on a teaspoon to understand its flavor. The app should have a place for these taste notes.
- Shops: rarely at an Asian supermarket (Tain Kim Heng, Oberhausen), fresh things at Netto.
- First Asian haul, 17 Oct 2026: EUR 44.77 (original idea was EUR 20–30). He sees it as a one-off stock-up for autumn, winter and spring.
- Already knows: satay chicken, red coconut chicken curry (his girlfriend's favorite), teriyaki chicken, Nikujaga, Chicken Adobo (already in his recipe book), miso soup idea.

## 3. App requirements

### From the user
1. Runs on the tablet, all recipes in one place.
2. Scale portions up/down (he scaled the lentil curry from 6 to 9 portions himself).
3. Photos: of dishes he cooked and of recipes he wants to make.
4. Public repo is fine.
5. Pantry: know what he has, suggest what he can cook with it, scan items instead of typing.

### Design lessons from the chat (important)
1. **Plain step-by-step beats a card widget.** He explicitly rejected the interactive recipe card and wanted a simple ingredient list plus numbered steps. A "cooking mode" is fine, but the default view should be plain text.
2. **Quantities inline in the steps** ("Add 3 EL curry powder, 1.5 TL turmeric..."), not only in the ingredient list. He asked for "Mengenangaben mit Zubereitung" more than once.
3. **Prep next to each ingredient** ("3 onions, diced small"; "lentils, rinsed") and a **mise-en-place grouping by when things enter the pot** (bowl 1: onions; bowl 2: garlic + ginger; small dish: spices; bowl 3: everything that goes in together).
4. **A compact "Ablauf" view**: just the sequence from start to finish, no explanations.
5. **Shopping list**: only what he must buy, as checkboxes, screenshot-friendly. He screenshots it at the store.
6. **Units rule:** small amounts (spices, oil, sauces) in EL/TL, everything else in g or ml. Do not convert spoon measures into odd ml values. When scaling, spoons stay spoons (round to ½), g and ml scale linearly.
7. **Per-recipe notes** for lessons learned (e.g. "spicy: use half the spice powder first").
8. **Storage info per recipe**: fridge days, freezer months, "freeze rice separately".
9. Optional: cost per portion (the lentil curry came to about EUR 1 per portion).

## 4. Proposed architecture

- **Static PWA** (plain HTML/JS/CSS) hosted on GitHub Pages. On the tablet: open in the browser, "Add to Home screen", works offline via a service worker.
- **One JSON file per recipe** in `recipes/`, photos in `photos/` (resized to about 1200 px to keep the repo small).
- Build an index file listing all recipes so the app does not need a backend.
- Pantry data is separate (section 5/6).
- Start with the first three recipes from section 7 as test data.

### Recipe JSON (example with real values)

```json
{
  "id": "red-lentil-sweet-potato-curry",
  "title": "Red Lentil & Sweet Potato Curry",
  "base_servings": 9,
  "tags": ["freezer", "vegan", "meal-prep"],
  "status": "cooked",
  "rating": null,
  "cost_per_portion_eur": 1.0,
  "storage": { "fridge_days": 3, "freezer_months": 3, "note": "Add a splash of water when reheating" },
  "ingredients": [
    { "id": "lentils", "category": "red lentils", "amount": 600, "unit": "g", "prep": "rinse in a sieve", "group": "pot" },
    { "id": "sweet_potato", "category": "sweet potato", "amount": 750, "unit": "g", "prep": "peel, cut 2 cm cubes", "group": "pot" },
    { "id": "curry", "category": "curry powder", "amount": 3, "unit": "EL", "group": "spices" }
  ],
  "steps": [
    { "text": "Cook {onion} in {oil} over medium heat for 7 minutes.", "timer_seconds": 420 }
  ],
  "notes": [],
  "photos": []
}
```

(`{id}` placeholders in step text get replaced with the scaled amount, so quantities appear inline.)

## 5. Data model (relational, for the pantry)

```sql
-- what a product IS (identified by barcode once scanned)
CREATE TABLE products (
  barcode TEXT PRIMARY KEY,
  name TEXT NOT NULL,             -- 'Wan Ja Shan Mirin'
  brand TEXT,
  category TEXT NOT NULL,         -- 'mirin'  (recipes point to categories, not brands)
  size_text TEXT,                 -- '450 ml'
  taste_notes TEXT                -- his own tasting notes
);

-- what he HAS
CREATE TABLE stock (
  id INTEGER PRIMARY KEY,
  barcode TEXT REFERENCES products(barcode),
  location TEXT,                  -- 'fridge' | 'cupboard' | 'freezer'
  added_on DATE,
  opened_on DATE,
  status TEXT                     -- 'sealed' | 'open' | 'low' | 'empty'
);

CREATE TABLE recipe_ingredients (
  recipe_id TEXT,
  category TEXT,                  -- matches products.category
  amount REAL, unit TEXT, prep TEXT
);
```

Nutrition tables:

```sql
CREATE TABLE nutrients (
  id TEXT PRIMARY KEY,            -- 'niacin'
  name TEXT NOT NULL,             -- 'Niacin (vitamin B3)'
  type TEXT NOT NULL,             -- 'macro' | 'micro'
  unit TEXT NOT NULL,             -- 'mg'
  explanation TEXT                -- shown when the user clicks the nutrient
);

CREATE TABLE ingredient_nutrition (
  category TEXT,                  -- 'red lentils' (same key as products.category)
  nutrient_id TEXT REFERENCES nutrients(id),
  per_100g REAL,
  source TEXT                     -- 'USDA FoodData Central'
);
```

Portion nutrition = for each recipe ingredient, `amount_in_g / 100 * per_100g`, summed and divided by the number of portions. Spoon units (EL/TL) need a grams-per-spoon value per category.

Key query: recipes where every `recipe_ingredients.category` has a `stock` row that is not empty. Second query: stock opened longer ago than the product's best-within period.

Matching on **category** means any mirin counts for a recipe, whatever the brand.

## 6. Pantry scanner plan

- Phase 1, no hardware: barcode scan with the tablet/phone camera inside the app. Look up in Open Food Facts. Asian imports are often missing, so for an unknown barcode the app asks for a name once and remembers it.
- Phase 2: a cheap Bluetooth barcode scanner (about EUR 20–30), or his Raspberry Pi with a scanner and a button, so it only wakes up when needed.
- Two scan modes: scan = new in pantry; scan with the mode button held = mark "opened" or "empty". A scan alone cannot tell how much is left.
- App outputs: what recipes work with current stock, a shopping list of only missing items, warnings for opened items past their best period.
- Fits as a module in Heinzelmännchen (no new repo needed). He currently has several active repos and said he does not want to start many new projects, so keep this lean.

## 7. Recipes (as cooked or planned)

### 7.1 Red Lentil & Sweet Potato Curry – cooked 10 Oct, 9 portions
He said it was delicious. About EUR 1 per portion.

Ingredients (9 portions):
- 600 g red lentils (rinsed)
- 750 g sweet potatoes, 2 cm cubes
- 3 large onions, diced
- 6 garlic cloves, minced
- 45 g fresh ginger, grated
- 3 EL oil
- 3 EL curry powder, 1.5 TL turmeric, 1.5 TL cumin (Kreuzkümmel)
- 600 g chopped tomatoes
- 400 ml coconut milk (he only had 400 ml) and 1000 ml water (with 600 ml coconut milk use 900 ml water)
- 360 g chickpeas, drained (optional; with 1 can ~240 g use 100 ml less water)
- 300 g spinach
- 1 EL apple vinegar at the end (instead of lemon), adjust to taste
- 2 TL salt

Steps:
1. Heat the oil, cook the onions 7 minutes until soft.
2. Add garlic and ginger, 1 minute.
3. Add curry powder, turmeric, cumin, toast 30 seconds.
4. Add lentils, sweet potato, chickpeas, tomatoes, coconut milk, water, salt. Bring to a boil.
5. Simmer partly covered 25 minutes, stirring often (especially at the end, lentils stick). Add water if too thick.
6. Stir in spinach, 2 minutes. Add vinegar, taste, adjust salt.
7. Cool completely, portion into boxes, freeze.

Storage: fridge 3–4 days, freezer about 3 months. Thaw in the fridge, add a splash of water, heat through. Do not refreeze thawed portions.

### 7.2 Rabokki (his version with fusilli) – cooked 17 Oct
Yopokki "Hot & Spicy" tteokbokki set (240 g, 2 portions, includes sauce and spicy powder), with fusilli instead of instant ramen.

Ingredients (1 hungry portion): 1 Yopokki set, a handful of fusilli, 1 carrot (thin slices), 1 bunch spring onions, 1 onion (optional), ½ a Shimaya dashi bag (about ½ TL), 1 microwave egg custard, kimchi and a cold beer on the side.

Steps:
1. Cook the fusilli in salted water 1–2 minutes short of the pack time. Drain, keep a cup of the pasta water, toss with a few drops of sesame oil.
2. In the pan: sauce, spicy powder, dashi and about 250–300 ml liquid (part pasta water, part fresh water). The pasta water is salted, so taste before adding more seasoning. Bring to a boil and stir until dissolved.
3. Add rice cakes and carrot. Simmer 5–7 minutes, stir often and separate the rice cakes, until they are soft and the sauce is thick and glossy (the starch thickens it, no thickener needed).
4. Add the fusilli, simmer 2 minutes. Loosen with pasta water if too thick.
5. Spring onion whites for the last minute, dark green rings on top.
6. Taste. Too hot: 1 TL mirin. Too thin: 1 TL old gochujang. Finish with 2–3 drops sesame oil.

Verdict: pretty spicy. **Next time use half of the spice powder first** and add more at the end. Mirin plus a few drops of sesame oil stirred in at the table worked great. Do not use the instant noodle seasoning packet.

Notes: rice cakes harden and noodles soak up the sauce, so this is better fresh than meal-prepped and does not freeze well. Cast-iron pan was fine for a short simmer: clean right away, dry, rub with a drop of oil.

### 7.3 Microwave egg custard (Eierstich), side dish
2 eggs, about 100–120 ml dashi or water, a pinch of salt. His first version puffed up like a fluffy omelet (too hot). For a silkier custard: lower power (400–500 W), cover the bowl, 30-second bursts with stirring in between. Top with spring onion and a few drops of sesame oil.

### 7.4 Planned for Sunday 18 Oct: Panang chicken curry with peanut butter (freezer batch, about 8 portions)
- 1.3–1.5 kg chicken thighs **with bone** (bought reduced by 30%), skin off.
- 2 cans coconut milk (800 ml).
- Paste: the 50 g Panang sachet plus 2 EL red curry paste (about 5 EL in total), 3 EL peanut butter.
- 2 bell peppers, fish sauce and sugar to taste, lime or a splash of rice vinegar at the end.
- Method: fry the paste briefly, add coconut milk and peanut butter, add chicken, simmer 30–35 minutes (bone-in) until the meat comes off the bone. Add the peppers for the last 10 minutes. Take the meat off the bone, shred it, return it to the sauce.
- Cool, portion, freeze. Cook rice fresh or freeze it separately in boxes.
- Also serves as a test run before making Panang for his mother.

### 7.5 Satay marinade and peanut sauce (he knows satay, template only)
Marinade for chicken skewers (marinate at least 30 minutes): 4 EL coconut milk, 1 EL soy sauce, 1 EL yellow or red curry paste, 1 TL sugar, 1 EL peanut butter.
Peanut sauce: 3 EL peanut butter, 100 ml coconut milk, 1 EL red curry paste, 1 EL soy sauce, 1 TL sugar, squeeze of lime or 1 TL rice vinegar, loosen with warm water.
Quick peanut noodles: peanut butter, soy sauce, sesame oil, a spoon of Lao Gan Ma.

### 7.6 Nikujaga (Japanese simmered beef/pork and potatoes) – planned
For 2–3 portions: 300 g meat, 500 g potatoes (mostly waxy), 1 carrot, 1 large onion. About 400 ml water, ½ TL dashi granules, 3 EL soy sauce (Kikkoman), 3 EL mirin, 2 EL cooking sake, 1 EL sugar. Simmer about 20 minutes until the potatoes are soft.
Meat options with German supermarket meat: thin Rouladen slices cut into strips (closest to the original), thinly sliced pork neck or belly, or mince (he is skeptical about mince). Partly freeze a piece of rump or hip beef for 30–40 minutes to slice it paper-thin. Avoid ready-cut Geschnetzeltes (gets tough).

### 7.7 Oyster sauce stir-fry template (pan, no wok)
Sauce for 2 portions: 2 EL oyster sauce, 1 EL Kikkoman, 1 EL Shaoxing, 1 TL sugar, 1 TL cornstarch, 100 ml water. 300 g chicken breast or beef strips seared hot, taken out. Broccoli, garlic, ginger fried, steamed 3 minutes with a splash of water. Meat back in, pour over the sauce, simmer 1 minute until glossy. Serve with rice. Oyster sauce is salty: go easy on the soy sauce.

### 7.8 Recipe ideas he has not cooked yet
Oyakodon, miso-marinated salmon or chicken (miso + mirin + sake), Hong Shao Rou (red-braised pork belly with Shaoxing and dark soy), mushroom chicken pot (shiitake, Shaoxing, oyster sauce), Dak-bokkeumtang (Korean chicken-potato stew with gochujang), Kimchi-jjigae, Panang curry with beef, miso ramen with marinated eggs, Karaage, Tamagoyaki, miso soup from dashi + miso + shiitake (+ wakame), kimchi fried rice with egg, teriyaki chicken (pour Yamasa teriyaki over for the last 1–2 minutes so it does not burn).
Good for freezing: Hong Shao Rou, mushroom chicken, Dak-bokkeumtang, curries.

## 8. Pantry inventory as of 17 Oct 2026

Receipt: Tain Kim Heng, 17 Oct 2026, EUR 44.77. Some items came from his mother or were already at home.

| Item | Details | Where to store |
|---|---|---|
| Red curry paste | 1 kg tub (EUR 5.99). **Freeze in 2–3 EL portions**, small amounts in the fridge | freezer + fridge |
| Green, Panang, yellow curry paste | 50 g sachets each, for experiments (also for his mother) | fridge |
| Mirin | Wan Ja Shan, 450 ml, mirin-style "sweet cooking rice seasoning". **Opened 17 Oct 2026** | fridge |
| Cooking sake | Morita Ryorishu, 500 ml, 13% vol., contains salt. Label says refrigerate after opening (below 10 °C). Best before 27 Jul 2027 | fridge |
| Shaoxing wine | Shuang Sui Chen Nian Hua Tiao, 750 ml, 14% vol., contains wheat, no salt (EUR 3.90) | cupboard (cool, dark) |
| Fish sauce | 725 ml (EUR 2.99) | cupboard |
| Oyster sauce | Healthy Boy, thick, 815 g | fridge after opening |
| Dark soy sauce | Healthy Boy "Black soy sauce No. 1", 970 g | cupboard |
| Teriyaki sauce | Yamasa | fridge after opening |
| Miso | shiro (white), 300 g tub, sold as "Miso-Suppenpaste hell". Check ingredients: if it already contains dashi, use less dashi/salt in soups | fridge |
| Dried shiitake | 100 g, vacuum sealed (EUR 2.99). Not opened yet | cupboard |
| Sesame oil | 150 ml | cupboard, use within about 6 months once opened |
| Kimchi | Vim, vegan, 200 g | fridge |
| Lao Gan Ma | chili crisp (fermented soybeans in chili oil). Best on rice with two fried eggs | fridge after opening |
| Dashi | Shimaya Dashi-no-moto, 8 x 5 g bags. Past best-before: check for clumping, odor, moths before use. 1 bag = 750 ml of soup; for tteokbokki use about half a bag | cupboard, reseal |
| Peanut butter | 3 big jars (Dutch) | cupboard |
| Gunpowder tea | 1 kg Chinese green tea | cupboard, airtight, away from spices |
| Gochujang | old tub, years old, still okay if it smells and tastes fresh. Buy a small fresh tub next time | fridge |
| Already at home | Kikkoman soy sauce, rice, rice vinegar (some left), apple vinegar, white wine vinegar, curry powder, turmeric, cumin, onions, lemon pepper | |

## 9. Shelf life cheat sheet (rough, the label has priority)

| Product | Unopened | Opened |
|---|---|---|
| Fish sauce, soy sauce, rice vinegar | years | years, cupboard is fine |
| Dried shiitake (airtight) | 1–2 years | same |
| Shaoxing wine | years | months, cool and dark |
| Mirin, cooking sake | long | **best about 3 months in the fridge**, usable 6–12 months with weaker aroma. Tiny white crystals in mirin are sugar |
| Miso, gochujang | long | fridge, 6–12 months or more; darkening on top is normal, mold or sour smell is not |
| Oyster sauce | long | about 6 months in the fridge |
| Lao Gan Ma | long | months in the fridge, use a clean spoon |
| Sesame oil | long | about 6 months, goes cloudy in the fridge (harmless) |
| Red curry paste (1 kg) | long | fridge only 1–2 months, **freeze portions** for many months |
| Curry paste sachets | long | use within 1–2 weeks |
| Kimchi | weeks to months | weeks to a few months, gets more sour (good for cooking) |
| Vinegar pickles (Gewürzgurken) | 1–2 years | 1–3 months in the fridge; true fermented ones are "milchsauer vergoren" |
| Cooked dishes | – | fridge 3–4 days, freezer about 3 months, never refreeze thawed food |

Signs of spoilage: mold, slimy brine, off smell, fizzing or a bulging lid.

## 10. Flavor map – what each product is for

- **Salty and savory:** soy sauce (Kikkoman), dark soy (mostly color and mild sweetness, 1 tsp to 1 EL per dish), fish sauce (a few drops to 1 TL, rounds out curries, dips, even Bolognese), oyster sauce (stir-fries, noodles, 1–2 EL), miso (umami base, add at the end and do not boil).
- **Sweet and glossy:** mirin (glazes, marinades, simmered dishes), teriyaki sauce (add at the end).
- **Depth and no meaty/fishy smell:** cooking sake (Japanese, mild, 1–2 EL early in marinades/braises), Shaoxing (Chinese, malty-nutty; sherry is a decent substitute).
- **Flavor bombs:** curry pastes (fry 1 minute first, about 2 EL per 400 ml coconut milk), Lao Gan Ma (topping), gochujang (Tteokbokki, marinades, eggs, rice).
- **Finishing touch:** sesame oil (2–3 drops), vinegar (acid at the end: apple vinegar worked instead of lemon).
- Alcohol in mirin, sake and Shaoxing mostly cooks off when simmered a couple of minutes.

## 11. Product notes (labels he showed)

- Mizkan **Hontei**: "mirin-fū chōmiryō", a mirin-style seasoning (under 1% alcohol), cheaper, less depth.
- Kizakura **Hon-Mirin**: real mirin, about 14% alcohol, but EUR 12 in that store, so he skipped it. Real hon-mirin for EUR 6–8 would be worth buying.
- Wan Ja Shan mirin: mirin-style seasoning, about the same quality as Hontei (EUR 5 at the shelf). This is what he bought.
- **Sushi-Su** (seasoned sushi vinegar, 39 g sugar per 100 g): too sweet for adobo or dressings. Use plain rice vinegar instead.
- Morita Ryorishu: a salted Japanese cooking sake, not for drinking. Season dishes with it a bit more carefully. Label notes traces of cereals, fish and soy.
- Shaoxing here is a proper Hua Tiao wine (no salt added) and contains wheat.
- Japanese curry roux: he does not like it much, so skip it.
- Bought and skipped: doubanjiang, panko, chili crisp (he has Lao Gan Ma), shiro/aka miso second tub, pak choi (not at Netto), ramen noodles (forgot them for tonight).
- Whenever he opens a new bottle he smells and tastes it first. A `taste_notes` field in the pantry would store this.

## 12. Cooking facts learned

- Rabokki = ramyeon + tteokbokki. Tteokbokki is Korean street food and comfort snack (bunsik), often eaten after school or late at night, from a shared pot, with fish cake, egg and fried sides.
- Korean spiciness: chili arrived about the 1500s and became the base of kimchi and gochujang. Fermentation (kimchi, doenjang, gochujang) filled the long winters. "Fighting heat with heat" (i-yeol chi-yeol) is a real habit.
- Gherkin = Gewürzgurke (vinegar-pickled, not fermented). Fermented ones are Salzgurken.
- Miso: shiro (white) is milder and more versatile; aka (red) is stronger.
- Udon are the thick white wheat noodles; thick glassy ones may be Dangmyeon (sweet potato starch).
- Food in a cast-iron pan: short simmering of salty/acidic sauces is fine. Do not leave it in the pan, wash while warm, dry, oil lightly.

## 13. Next steps and open questions

Steps to start:
1. Create an empty **public** GitHub repo named `tischlein` (the planning chat could not create it, only attach an existing one).
2. Open a new chat/Claude Code session with the repo attached, give it this file.
3. First commit: the file as `docs/HANDOVER.md` and a short `CLAUDE.md` saying "read docs/HANDOVER.md first".
4. Build the PWA shell with the lentil curry as recipe #1 (plain step-by-step view, scaling, inline quantities), test on the tablet via GitHub Pages.
5. Then add Rabokki and Panang as recipes #2 and #3, then the pantry as `pantry.json` (before a database).

Suggested milestones (keep each small, he has several active repos and wants few new projects):
1. PWA shell + three recipes (lentil curry, Rabokki, Panang) in the plain step-by-step view, tested on the tablet.
2. Scaling with inline quantities, mise-en-place groups, "Ablauf" view, shopping checklist.
3. Ratings, cooked/wishlist status, photos.
4. Ingredient nutrition (macros first, then micronutrients) with clickable nutrient explanations.
5. Pantry as `pantry.json`, "what can I cook" and "open too long" warnings.
6. Scanner (camera first), maybe move the pantry into Heinzelmännchen's database.

Working style for the new session:
- He learns by doing and wants to understand the why. Explain briefly, in short steps, with concrete values (real names, numbers) instead of placeholders, and say what the next step is once the current one works.
- He mixes German and English. Recipes and product names may stay German.
- He tests on his Samsung tablet and takes screenshots of lists, so keep layouts simple and readable.
- Prefer plain, readable views over fancy widgets (he rejected the interactive recipe card).

Open questions for the user:
- Which nutrient data source (USDA FoodData Central suggested) and which daily reference values (German/DACH) to use for the "percent of daily need" display?
- UI/recipe language: German, English or mixed?
- Pantry in Heinzelmännchen's database or inside the cookbook repo (JSON first)?
- Photos: committed to the repo, or stored elsewhere?
- Which scanning phase to start with (camera first is suggested)?
- Should the recipe format get a cost-per-portion field?

## 14. Vision update (28 Oct 2026)

Said in chat after the PWA shell went live (milestone 1 done for the lentil curry; Rabokki and Panang still to add). Build it bit by bit, in this order of value:

1. **Star rating 1–5 per recipe**, stored so it survives reloads. Plus the cooked/wishlist status. First version: saved in the browser on the tablet (`localStorage`), with a way to export so it can be written back into the recipe JSON later.
2. **Three levels per recipe**, shown in the list and on the recipe: *Nährwert* (nutrition), *Geschmack* (taste) and *Kosten* (cost), each `hoch` / `mittel` / `niedrig`. The best dishes are tasty, nutritious and cheap, but not every recipe has to be. Levels are hand-set in the recipe JSON (`"levels": { "nutrition": "high", "taste": "high", "cost": "low" }`); later the nutrition level can be computed from the nutrition data (milestone 4).
3. **A bigger recipe library**, not only dishes he has cooked: the ideas from section 7.8 as wishlist recipes, so the app has "many recipes I could just have".
4. **Condiments/pantry list** (`pantry.json`, section 8 is the seed data): everything he has at home.
5. **Recommendations**: ranked by what he has in the pantry (all or most ingredient categories in stock), his stars, the three levels, and his kitchen tools (cast-iron pan, induction, microwave, big pot; **no wok**, no oven listed yet). A recipe can declare `"tools": ["pan", "pot"]`; recipes needing a tool he lacks are shown but marked.

This replaces the milestone order in section 13: ratings and levels come before the Ablauf view and shopping list.
