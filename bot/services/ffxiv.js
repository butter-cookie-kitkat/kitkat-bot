import XIVAPI from 'xivapi-js';

import { CrafterStats, CraftingJob } from '@ffxiv-teamcraft/simulator';
import { Solver } from '@ffxiv-teamcraft/crafting-solver';

const xivapi = new XIVAPI();

const ABILITIES = {
  // Progress actions
  'BasicSynthesis': `Basic Synthesis`,
  'CarefulSynthesis': `Careful Synthesis`,
  'RapidSynthesis': `Rapid Synthesis`,
  'FocusedSynthesis': `Focused Synthesis`,
  'MuscleMemory': `Muscle Memory`,
  'BrandOfTheElements': `Brand Of The Elements`,
  'IntensiveSynthesis': `Intensive Synthesis`,
  // Quality actions
  'BasicTouch': `Basic Touch`,
  'StandardTouch': `Standard Touch`,
  'HastyTouch': `Hasty Touch`,
  'ByregotsBlessing': `Byregot's Blessing`,
  'PreciseTouch': `Precise Touch`,
  'FocusedTouch': `Focused Touch`,
  'PatientTouch': `Patient Touch`,
  'PrudentTouch': `Prudent Touch`,
  'TrainedEye': `Trained Eye`,
  'PreparatoryTouch': `Preparatory Touch`,
  // CP recovery
  'TricksOfTheTrade': `Tricks Of The Trade`,
  // Repair
  'MastersMend': `Master's Mend`,
  // Buffs
  'InnerQuiet': `Inner Quiet`,
  'WasteNot': `Waste Not`,
  'WasteNotII': `Waste Not II`,
  'GreatStrides': `Great Strides`,
  'NameOfTheElements': `Name Of The Elements`,
  'FinalAppraisal': `Final Appraisal`,
  // Other
  'DelicateSynthesis': `Delicate Synthesis`,
};

export const BUFFS = ['']

export class FFXIV {
  static #abilities = {};

  static async getRecipe(name) {
    const response = await xivapi.search(name, {
      filters: 'RecipeLevelTable.ClassJobLevel>0',
      limit: 1,
      columns: [
        'Name',
        'CanHq',
        'CanQuickSynth',
        'ClassJob.Abbreviation',
        'RequiredControl',
        'RequiredCraftsmanship',
        'RecipeLevelTable.Durability',
        'RecipeLevelTable.Difficulty',
        'RecipeLevelTable.ClassJobLevel',
        'RecipeLevelTable.SuggestedControl',
        'RecipeLevelTable.SuggestedCraftsmanship',
      ].join(','),
    });

    if (response.Results.length === 0) return null;

    const [recipe] = response.Results;

    return {
      name: recipe.Name,
      job: recipe.ClassJob.Abbreviation,
      controlReq: recipe.RequiredControl,
      craftsmanshipReq: recipe.RequiredCraftsmanship,
      durability: recipe.RecipeLevelTable.Durability,
      progress: recipe.RecipeLevelTable.Difficulty,
      rlvl: recipe.RecipeLevelTable.ClassJobLevel,
      hq: recipe.CanHq,
      quality: recipe.RecipeLevelTable.quality,
      suggestedControl: recipe.RecipeLevelTable.SuggestedControl,
      suggestedCraftsmanship: recipe.RecipeLevelTable.SuggestedCraftsmanship,
      quickSynth: recipe.CanQuickSynth,
    };
  }

  static async solve(recipe, level, craftsmanship, control, cp, specialize = false) {
    const solver = new Solver(
      recipe,
      new CrafterStats(CraftingJob[recipe.job], craftsmanship, control, cp, specialize, level),
    );

    solver.availableActions = solver.availableActions.filter(({ constructor }) =>
      !['RapidSynthesis', 'Observe', 'RemoveFinalAppraisal'].includes(constructor.name),
    );

    return Promise.all(solver.run().map((ability) =>
      FFXIV.getAbility(ability.constructor.name),
    ));
  }

  static async getAbility(name) {
    const realName = ABILITIES[name] || name;

    if (!FFXIV.#abilities[realName]) {
      FFXIV.#abilities[realName] = Promise.resolve().then(async () => {
        const response = await xivapi.search(realName, {
          limit: 1,
          columns: 'Name,Icon,AnimationEnd.Key',
        });

        if (response.Results.length === 0) {
          throw new Error(`Can't find ability for name. (${realName})`);
        }

        const [ability] = response.Results;

        return {
          name: ability.Name,
          icon: `https://xivapi.com/${ability.Icon}`,
          buff: ability.AnimationEnd && ability.AnimationEnd.Key === 'craft/buff',
        };
      });
    }

    return FFXIV.#abilities[realName];
  }
}
