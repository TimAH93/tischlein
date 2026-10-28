// Tischlein deck dich – recipe list and plain step-by-step recipe view.
"use strict";

const app = document.getElementById("app");

// ---- small DOM helper ----------------------------------------------------
function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === "class") el.className = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) el.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
}

// ---- local data: stars and cooked/wishlist, saved in this browser ---------
// Shape: { "<recipe id>": { rating: 4, status: "cooked", updated: "2026-10-28" } }
// Falls back to the values in the recipe JSON when nothing is saved locally.
const STORE_KEY = "tischlein.local";
const STATUS_LABEL = { cooked: "Gekocht", wishlist: "Wunschliste" };

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; }
}
function saveLocal(data) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch { /* private mode etc. */ }
}
function localFor(recipe) {
  const d = loadLocal()[recipe.id] || {};
  return {
    rating: d.rating ?? recipe.rating ?? null,
    status: d.status ?? recipe.status ?? "wishlist",
  };
}
function setLocal(id, patch) {
  const all = loadLocal();
  all[id] = { ...(all[id] || {}), ...patch, updated: new Date().toISOString().slice(0, 10) };
  saveLocal(all);
}

// ---- levels: hand-set per recipe in the JSON -----------------------------
// "levels": { "nutrition": "high", "taste": "high", "cost": "low" }
const LEVEL_NAME = { nutrition: "Nährwert", taste: "Geschmack", cost: "Kosten" };
const LEVEL_VALUE = { high: "hoch", medium: "mittel", low: "niedrig" };

function levelRow(levels) {
  if (!levels) return null;
  return h("div", { class: "levels" },
    Object.keys(LEVEL_NAME).map((key) => {
      const v = levels[key];
      if (!v) return null;
      // Cheap is good, so cost gets its "good" colour at low, the others at high.
      const good = key === "cost" ? v === "low" : v === "high";
      return h("span", { class: `level ${good ? "good" : v === "medium" ? "" : "weak"}` },
        `${LEVEL_NAME[key]}: ${LEVEL_VALUE[v] ?? v}`);
    }));
}

function starText(rating) {
  return rating ? "★".repeat(rating) + "☆".repeat(5 - rating) : "";
}

// Five tappable stars. Tapping the current star again clears the rating.
function starRow(rating, onChange) {
  return h("div", { class: "stars", "aria-label": "Bewertung" },
    [1, 2, 3, 4, 5].map((n) =>
      h("button", {
        class: n <= rating ? "star on" : "star",
        "aria-label": `${n} ${n === 1 ? "Stern" : "Sterne"}`,
        onclick: () => onChange(n === rating ? null : n),
      }, n <= rating ? "★" : "☆")),
    h("span", { class: "meta" }, rating ? `${rating} von 5` : "noch nicht bewertet"));
}

function statusToggle(status, onChange) {
  return h("div", { class: "status" },
    Object.entries(STATUS_LABEL).map(([key, label]) =>
      h("button", { class: key === status ? "on" : "", onclick: () => onChange(key) }, label)));
}

// ---- scaling -------------------------------------------------------------
// Spoons and pieces stay in their unit and round to ½; g and ml scale linearly.
const HALF_UNITS = new Set(["EL", "TL", "Stück"]);

function scaleAmount(amount, unit, factor) {
  const x = amount * factor;
  if (HALF_UNITS.has(unit)) return Math.max(0.5, Math.round(x * 2) / 2);
  if (x < 20) return Math.max(1, Math.round(x));
  if (x < 200) return Math.round(x / 5) * 5;
  return Math.round(x / 10) * 10;
}

function formatNumber(n) {
  const whole = Math.floor(n);
  const half = n - whole >= 0.5;
  if (half) return whole === 0 ? "½" : `${whole}½`;
  return String(whole);
}

// "3 EL Öl", "600 g rote Linsen", "1 große Zwiebel"
function ingredientParts(ing, factor) {
  const n = scaleAmount(ing.amount, ing.unit, factor);
  const amount = ing.unit === "Stück" ? formatNumber(n) : `${formatNumber(n)} ${ing.unit}`;
  const name = n <= 1 && ing.name_singular ? ing.name_singular : ing.name;
  return { amount, name };
}

// ---- views ---------------------------------------------------------------
async function showList() {
  const recipes = await loadJson("recipes/index.json");
  document.title = "Tischlein deck dich";
  app.replaceChildren(
    h("h1", null, "Rezepte"),
    h("ul", { class: "recipe-list" },
      recipes.map((r) => {
        const local = localFor(r);
        return h("li", null,
          h("a", { href: `#/r/${r.id}` },
            h("div", { class: "title" }, r.title),
            local.rating && h("div", { class: "star-text" }, starText(local.rating)),
            levelRow(r.levels),
            h("div", { class: "meta" },
              `${r.base_servings} Portionen · ${STATUS_LABEL[local.status]}`,
              r.tags.length ? ` · ${r.tags.join(", ")}` : "")));
      })),
    h("p", { class: "meta footer-links" }, h("a", { href: "#/daten" }, "Meine Bewertungen (Export)")));
}

// Shows what is saved in this browser, so it can be copied and written
// back into the recipe files (no backend, so this is the sync for now).
function showData() {
  document.title = "Meine Bewertungen – Tischlein deck dich";
  const data = loadLocal();
  const json = JSON.stringify(data, null, 2);
  const status = h("span", { class: "meta" });
  app.replaceChildren(
    h("p", { class: "meta" }, h("a", { href: "#/" }, "← Alle Rezepte")),
    h("h1", null, "Meine Bewertungen"),
    h("p", null, `${Object.keys(data).length} Rezepte bewertet oder markiert. Gespeichert nur in diesem Browser.`),
    h("p", null,
      h("button", { class: "action", onclick: async () => {
        try { await navigator.clipboard.writeText(json); status.textContent = " Kopiert."; }
        catch { status.textContent = " Kopieren ging nicht, bitte markieren und kopieren."; }
      } }, "Kopieren"), status),
    h("pre", { class: "data" }, json));
}

async function showRecipe(id) {
  const r = await loadJson(`recipes/${encodeURIComponent(id)}.json`);
  document.title = `${r.title} – Tischlein deck dich`;
  let servings = r.base_servings;

  const rating = h("div");
  const renderRating = () => {
    const local = localFor(r);
    rating.replaceChildren(
      starRow(local.rating, (n) => { setLocal(r.id, { rating: n }); renderRating(); }),
      statusToggle(local.status, (s) => { setLocal(r.id, { status: s }); renderRating(); }));
  };
  renderRating();

  const body = h("div");
  const render = () => body.replaceChildren(...recipeBody(r, servings, (n) => { servings = n; render(); }));
  render();

  app.replaceChildren(
    h("p", { class: "meta" }, h("a", { href: "#/" }, "← Alle Rezepte")),
    h("h1", null, r.title),
    h("div", null, rating, levelRow(r.levels)),
    body);
  window.scrollTo(0, 0);
}

function recipeBody(r, servings, setServings) {
  const factor = servings / r.base_servings;
  const byId = Object.fromEntries(r.ingredients.map((i) => [i.id, i]));

  const portions = h("div", { class: "portions" },
    h("button", { "aria-label": "Weniger Portionen", disabled: servings <= 1, onclick: () => setServings(servings - 1) }, "−"),
    h("output", null, servings),
    h("span", null, servings === 1 ? "Portion" : "Portionen"),
    h("button", { "aria-label": "Mehr Portionen", onclick: () => setServings(servings + 1) }, "+"),
    servings !== r.base_servings &&
      h("button", { class: "reset", onclick: () => setServings(r.base_servings) }, `Grundrezept: ${r.base_servings}`));

  const meta = [];
  if (r.cost_per_portion_eur != null) {
    const euro = (v) => v.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
    meta.push(`ca. ${euro(r.cost_per_portion_eur)} pro Portion · ${euro(r.cost_per_portion_eur * servings)} gesamt`);
  }

  const ingredients = h("ul", { class: "ingredients" },
    r.ingredients.map((ing) => {
      const { amount, name } = ingredientParts(ing, factor);
      return h("li", null,
        h("span", { class: "amount" }, amount), " ", name,
        ing.prep && h("span", { class: "prep" }, `, ${ing.prep}`),
        ing.optional && h("span", { class: "optional" }, " (optional)"),
        ing.note && h("span", { class: "note" }, ing.note));
    }));

  // {id} in step text becomes the scaled amount + name, highlighted.
  const steps = h("ol", { class: "steps" },
    r.steps.map((step) =>
      h("li", null,
        step.text.split(/(\{[a-z0-9_]+\})/i).map((part) => {
          const m = part.match(/^\{(.+)\}$/);
          const ing = m && byId[m[1]];
          if (!ing) return part;
          const { amount, name } = ingredientParts(ing, factor);
          return h("span", { class: "amount" }, `${amount} ${name}`);
        }))));

  const out = [portions, meta.length && h("p", { class: "meta" }, meta.join(" · ")),
    h("h2", null, "Zutaten"), ingredients,
    h("h2", null, "Zubereitung"), steps];

  if (r.storage) {
    const s = r.storage;
    out.push(h("h2", null, "Aufbewahrung"),
      h("p", null,
        [s.fridge_days && `Kühlschrank: bis ${s.fridge_days} Tage`,
         s.freezer_months && `Gefrierfach: ca. ${s.freezer_months} Monate`].filter(Boolean).join(" · ")),
      s.note && h("p", null, s.note));
  }
  if (r.notes?.length) {
    out.push(h("h2", null, "Notizen"), h("ul", { class: "notes" }, r.notes.map((n) => h("li", null, n))));
  }
  return out.filter(Boolean);
}

// ---- routing -------------------------------------------------------------
async function route() {
  const m = location.hash.match(/^#\/r\/([^/]+)$/);
  try {
    if (m) await showRecipe(decodeURIComponent(m[1]));
    else if (location.hash === "#/daten") showData();
    else await showList();
  } catch (err) {
    app.replaceChildren(h("p", { class: "error" }, `Fehler: ${err.message}`),
      h("p", null, h("a", { href: "#/" }, "Zur Rezeptliste")));
  }
}

window.addEventListener("hashchange", route);
route();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
