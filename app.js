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
      recipes.map((r) =>
        h("li", null,
          h("a", { href: `#/r/${r.id}` },
            h("div", { class: "title" }, r.title),
            h("div", { class: "meta" },
              `${r.base_servings} Portionen · ${r.status === "cooked" ? "gekocht" : "Wunschliste"}`,
              r.tags.length ? ` · ${r.tags.join(", ")}` : ""))))));
}

async function showRecipe(id) {
  const r = await loadJson(`recipes/${encodeURIComponent(id)}.json`);
  document.title = `${r.title} – Tischlein deck dich`;
  let servings = r.base_servings;

  const body = h("div");
  const render = () => body.replaceChildren(...recipeBody(r, servings, (n) => { servings = n; render(); }));
  render();

  app.replaceChildren(
    h("p", { class: "meta" }, h("a", { href: "#/" }, "← Alle Rezepte")),
    h("h1", null, r.title),
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
