import { mapValues, reduce } from 'lodash';
import { SUBJECT_FACTORS, EXERCISE_FACTORS, MACROS_CALORIES } from '../config/constants';

/**
 * @param {Object} macros
 * @param {Number|string} macros.fat Fat in grams or percentage
 * @param {Number|string} macros.protein Protein in grams or percentage
 * @param {Number|string} macros.carbs Carbs in grams or percentage
 */
function validateTypes({ fat, protein, carbs }) {
  let toCalculate;

  const validatedTypes = reduce(
    { fat, protein, carbs },
    (types, value, key) => {
      switch (typeof value) {
        case 'number':
          types.grams.count += 1;
          types.grams.macros[key] = value;
          break;
        case 'string':
          const match = value.match(/^(\d+)%$/)[1];
          if (match) {
            types.percentages.count += 1;
            types.percentages.macros[key] = match;
          }
          break;
        default:
          toCalculate = key;
      }

      return types;
    },
    {
      percentages: { count: 0, macros: {} },
      grams: { count: 0, macros: {} },
    },
  );

  if (toCalculate) {
    validatedTypes.percentages.macros[toCalculate] = validatedTypes.grams.count === 2 ? 100 : 0;
  }

  return validatedTypes;
}

/**
 * @param {Object} params
 * @param {Object} params.percentageMacros
 * @param {number} params.remainingCalories
 */
function percentagesToGrams({ percentageMacros, remainingCalories }) {
  return mapValues(
    percentageMacros,
    (value, key) => Math.round((remainingCalories * (value / 100)) / MACROS_CALORIES[key]),
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
   * Gets the BMR (Basal Metabolic Rate) for the subject using the Harris-Benedict equation.
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
   * Distributes the macros so that the total of the calories matches the calculated TEE.
   *
   * Input data may have different formats. The user can provide:
   * - The percentages for each macro to calculate the grams values.
   * - The value for one macro and the percentages for the remaining macros.
   * - The value for two macros.
   *
   * @param {Object} macros
   * @param {Number|string} macros.fat Fat in grams or percentage
   * @param {Number|string} macros.protein Protein in grams or percentage
   * @param {Number|string} macros.carbs Carbs in grams or percentage
   */
  distributeMacros(macros) {
    if (!this._tee) {
      throw new Error('Subject TEE must be calculated to get the distributed macros');
    }

    const { percentages, grams } = validateTypes(macros);

    const percentageMacros = percentages.macros;
    const gramsToCalories = (calories, value, key) => calories + value * MACROS_CALORIES[key];
    const providedCalories = reduce(grams.macros, gramsToCalories, 0);
    const remainingCalories = this._tee - providedCalories;

    return {
      ...grams.macros,
      ...percentagesToGrams({ percentageMacros, remainingCalories }),
    };
  }
}
