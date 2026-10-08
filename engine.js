/* Mealworm math engine.
   Exact arithmetic over labeled husbandry guidance constants.
   Constants are representative midpoints of published mealworm-farming
   ranges (labeled in the UI); biology swings with temperature, feed and luck. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.Mealwormmath = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const AVG_HARVEST_G = 0.11;      // labeled: grams per harvest-size larva (~2.5 cm)
  const SURVIVAL = 0.4;            // labeled: egg-to-harvest survival at hobby scale
  const EGGS_PER_FEMALE_WEEK = 25; // labeled: conservative mid of published fecundity
  const PIPELINE_WEEKS = 12;       // labeled: egg to harvest-size larva
  const WORMS_PER_TRAY = 1500;     // labeled: comfortable density, ~40x30 cm tray
  const LARVA_TO_BEETLE = 0.8;     // labeled: share of bought larvae that make beetle
  const FEMALE_SHARE = 0.5;        // labeled: roughly half of beetles
  const STARTER_TO_HARVEST_WEEKS = 6; // labeled: bought mid-size larvae reach size
  const NEXT_GEN_WEEK = 21;        // labeled: 6 + pupate + lay + 12-week pipeline
  const SAVE_SHARE = 0.2;          // labeled: hold back as breeding stock

  function round2(x) { return Math.round(x * 100) / 100; }

  function needNumber(v, name) {
    if (typeof v !== 'number' || !isFinite(v)) throw new Error(name + ' must be a number');
    if (v <= 0) throw new Error(name + ' must be positive');
  }

  function plan(targetG) {
    needNumber(targetG, 'target');
    const hw = targetG / AVG_HARVEST_G;              // harvestable worms per week
    const beetles = Math.ceil(hw / SURVIVAL / EGGS_PER_FEMALE_WEEK / FEMALE_SHARE);
    const pipelineLarvae = Math.ceil(hw * PIPELINE_WEEKS);
    const trays = Math.ceil(pipelineLarvae / WORMS_PER_TRAY);
    let verdict;
    if (trays <= 2) verdict = 'fits on one shelf (labeled guidance)';
    else if (trays <= 6) verdict = 'a closet shelving unit (labeled guidance)';
    else if (trays <= 15) verdict = 'spare-room farm territory (labeled)';
    else verdict = 'industrial rack territory - that is a business (labeled)';
    return {
      wormsPerWeek: round2(hw),
      beetles: beetles,
      pipelineLarvae: pipelineLarvae,
      trays: trays,
      verdict: verdict
    };
  }

  function starter(startWorms) {
    needNumber(startWorms, 'starter count');
    const beetles = Math.round(startWorms * LARVA_TO_BEETLE);
    const females = Math.round(beetles * FEMALE_SHARE);
    const eggsWeek = females * EGGS_PER_FEMALE_WEEK;
    const capacityG = round2(eggsWeek * SURVIVAL * AVG_HARVEST_G);
    const capacityLarvae = Math.ceil(eggsWeek * SURVIVAL * PIPELINE_WEEKS);
    const capacityTrays = Math.ceil(capacityLarvae / WORMS_PER_TRAY);
    let verdict;
    if (capacityG < 20) verdict = 'a learning colony, not a supply line (labeled)';
    else if (capacityG < 100) verdict = 'steady treats for a pet or two (labeled)';
    else if (capacityG < 500) verdict = 'real protein, if you have the shelving (labeled)';
    else verdict = 'the beetles outrun the closet - trays are your ceiling (labeled)';
    return {
      beetles: beetles,
      females: females,
      capacityGPerWeek: capacityG,
      capacityTrays: capacityTrays,
      firstHarvestWeek: STARTER_TO_HARVEST_WEEKS,
      verdict: verdict
    };
  }

  function timeline(startWorms) {
    needNumber(startWorms, 'starter count');
    return {
      setupWeek: 0,
      firstHarvestWeek: STARTER_TO_HARVEST_WEEKS,
      gapStartWeek: STARTER_TO_HARVEST_WEEKS + 1,
      gapEndWeek: NEXT_GEN_WEEK - 1,
      nextGenWeek: NEXT_GEN_WEEK,
      saveForBreeding: Math.round(startWorms * SAVE_SHARE),
      note: 'weeks 7-20 are the harvest gap nobody mentions (labeled)'
    };
  }

  return {
    plan: plan,
    starter: starter,
    timeline: timeline,
    constants: {
      AVG_HARVEST_G: AVG_HARVEST_G,
      SURVIVAL: SURVIVAL,
      EGGS_PER_FEMALE_WEEK: EGGS_PER_FEMALE_WEEK,
      PIPELINE_WEEKS: PIPELINE_WEEKS,
      WORMS_PER_TRAY: WORMS_PER_TRAY,
      LARVA_TO_BEETLE: LARVA_TO_BEETLE,
      FEMALE_SHARE: FEMALE_SHARE,
      STARTER_TO_HARVEST_WEEKS: STARTER_TO_HARVEST_WEEKS,
      NEXT_GEN_WEEK: NEXT_GEN_WEEK,
      SAVE_SHARE: SAVE_SHARE
    }
  };
});
