import { mapValues, pickBy, omitBy, reduce } from 'lodash';

const SUBJECT_FACTORS = {
  male: {
    base: 66.473,
    weight: 13.7516,
    height: 5.0033,
    age: 6.755,
  },
  female: {
    base: 655.0955,
    weight: 9.5634,
    height: 1.8449,
    age: 4.6756,
  },
};

const EXERCISE_FACTORS = {
  none: 1.2,
  low: 1.375,
  medium: 1.55,
  high: 1.725,
  extreme: 1.9,
};

const MACROS_CALORIES = {
  fat: 9,
  protein: 4,
  carbs: 4,
};

function validateTypes(macroValues) {
  return reduce(
    macroValues,
    (types, value, key) => {
      if (typeof value === 'undefined') {
        types.toCalculate = key;
      } else if (typeof value === 'number') {
        types.grams.count++;
        types.grams.macros[key] = value;
      } else if (typeof value === 'string') {
        const match = value.match(/^(\d+)%$/)[1];
        if (match) {
          types.percentages.count++;
          types.percentages.macros[key] = match;
        }
      }

      return types;
    },
    {
      percentages: { count: 0, macros: {} },
      grams: { count: 0, macros: {} },
    },
  );
}

export default class Nutrition {
  /**
   * @param {Number} weight Subject weight in kgs
   * @param {Number} height Subject height in cms
   * @param {Number} age Subject age
   * @param {string} gender Subject gender. Allowed values: 'male', 'female'
   */
  constructor({ weight, height, age, gender }) {
    // TODO check input values

    this._weight = weight;
    this._height = height;
    this._age = age;
    this._gender = gender;
  }

  /**
   * Gets the BMR (Basal Metabolic Rate) for the configured subject using the Harris-Benedict equation.
   */
  bmr() {
    const factors = SUBJECT_FACTORS[this._gender];

    this._bmr = Math.round(factors.base
      + factors.weight * this._weight
      + factors.height * this._height
      + factors.age * this._age);

    return this._bmr;
  }

  /**
   * Gets de TEE (Total Energy Expenditure) for the configured subject.
   *
   * @param {string} exercise Exercise factor
   */
  tee({ exercise }) {
    const exerciseFactor = EXERCISE_FACTORS[exercise];
    const bmr = this._bmr || this.bmr();

    this._tee = Math.round(bmr * exerciseFactor);

    return this._tee;
  }

  /**
   * WiP
   */
  distributeMacros({ fat, protein, carbs }) {
    if (!this._tee) {
      throw new Error('Subject TEE must be calculated to get the distributed macros');
    }

    const { percentages, grams, toCalculate } = validateTypes({ fat, protein, carbs });

    if (percentages.count === 3) {
      return mapValues(
        percentages.macros,
        (value, key) => Math.round((this._tee * (value / 100)) / MACROS_CALORIES[key]),
      );
    }

    if (percentages.count === 2 && grams.count === 0) {
      percentages.macros[toCalculate] = 0;
      return mapValues(
        percentages.macros,
        (value, key) => Math.round((this._tee * (value / 100)) / MACROS_CALORIES[key]),
      );
    }

    if (grams.count === 2) {
      const providedCalories = reduce(grams.macros, (calories, value, key) => calories + value * MACROS_CALORIES[key], 0);
      const remainingCalories = this._tee - providedCalories;

      return {
        ...grams.macros,
        [toCalculate]: Math.round(remainingCalories / MACROS_CALORIES[toCalculate]),
      }
    }
  }
};
