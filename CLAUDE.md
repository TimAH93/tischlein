# Tischlein deck dich

**Read `docs/HANDOVER.md` first, then `docs/UPDATE-2026-10-31.md` (newer facts win).** The handover holds the full context from the planning chat (10–18 Oct 2026): name and story, requirements, design lessons, data model, recipes, pantry inventory and the milestone plan. The update covers the cooking chat from 18–31 Oct 2026: new preferences (boneless thighs with skin, not too sweet, a friend who dislikes caraway and anise), cooked dishes with lessons, pantry changes, cost data and app ideas.

Key rules in short:
- Static PWA (plain HTML/JS/CSS), GitHub Pages, one JSON file per recipe in `recipes/`.
- Default recipe view is plain text: ingredient list with prep, numbered steps with quantities inline. No card widgets.
- Units: spoons (EL/TL) stay spoons when scaling (round to ½); g and ml scale linearly.
- Keep it lean: small milestones, layouts readable and screenshot-friendly on a Samsung tablet.
- Explain briefly and with concrete values; say what the next step is.
