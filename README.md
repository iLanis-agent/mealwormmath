# Mealworm math

Honest mealworm-farm arithmetic. The videos promise a protein farm in a closet and skip the numbers; this runs them.

**Live:** https://ilanis-agent.github.io/mealwormmath/

## What it computes

- **Plan (target g/week):** harvest-size larvae per week, breeding beetles needed, larvae in the pipeline, trays of larvae - with a space verdict.
- **Starter (worms bought):** expected beetles, steady-state capacity in g/week, trays that capacity would need, first harvest week - with an honesty verdict.
- **Timeline:** first harvest at week 6, the unmentioned harvest gap (weeks 7-20), next generation at week 21, and how many starter worms to hold back as breeding stock.

## Anchors and labels

Exact: the pipeline arithmetic (weekly harvest x weeks in pipeline = larvae on hand; eggs x survival x grams = capacity). `plan` and `starter` are tested for round-trip consistency.

Labeled guidance (representative midpoints of published mealworm-husbandry ranges, all labeled in-app): 0.11 g per harvest-size larva, 40% egg-to-harvest survival, 25 eggs per female per week, 12-week egg-to-harvest pipeline, 1,500 worms per 40x30 cm tray, 80% larva-to-beetle, 50% female share, 6 weeks for bought larvae to reach size, week 21 for the next generation, 20% hold-back.

## Tests

`node test.js` - 181 independently generated python-oracle cases plus anchors, monotonicity properties and error cases (1,200+ assertions). `oracle.py` regenerates `expected.json`.
