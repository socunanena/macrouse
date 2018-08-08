import { mapValues, reduce } from 'lodash';
import { SUBJECT_FACTORS, EXERCISE_FACTORS, MACROS_CALORIES } from '../config/constants';

/**
 * @param {Object} macros
 * @param {Number|string} macros.fat Fat in grams or percentage
 * @param {Number|string} macros.protein Protein in grams or percentage
 * @param {Number|string} macros.carbs Carbs in grams or percentage
 */
function validateTypes({ fat, protein, carbs }) {
  const toCalculate = [];

  const validated = reduce(
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
          toCalculate.push(key);
      }

      return types;
    },
    {
      percentages: { count: 0, macros: {} },
      grams: { count: 0, macros: {} },
    },
  );

  if (toCalculate.length) {
    if (toCalculate.length > 1) {
      throw new Error('There should be just one single macro to be calculated');
    }
    validated.percentages.macros[toCalculate.pop()] = validated.grams.count === 2 ? 100 : 0;
  }

  return validated;
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

export default class Macrouse {
  /**
   * @param {Number} weight Subject weight in kgs
   * @param {Number} height Subject height in cms
   * @param {Number} age Subject age
   * @param {string} gender Subject gender. Allowed values: 'male', 'female'
   * @param {string} exercise Subject exercise.
   *                          Allowed values: 'none', 'low', 'medium', 'high', 'extreme'
   */
  constructor({ weight, height, age, gender, exercise }) {
    // TODO check input values

    const computeState = this._computeState.bind(this);

    this._user = new Proxy(
      { weight, height, age, gender, exercise },
      {
        set: (object, property, value) => {
          object[property] = value;
          computeState();

          return true;
        },
      },
    );

    computeState();
  }

  _computeState() {
    this._calculateBmr();
    this._calculateTee();
  }

  _calculateBmr() {
    const factors = SUBJECT_FACTORS[this._user.gender];

    this._bmr = Math.round(
      factors.base
      + factors.weight * this._user.weight
      + factors.height * this._user.height
      + factors.age * this._user.age,
    );
  }

  _calculateTee() {
    const exerciseFactor = EXERCISE_FACTORS[this._user.exercise];

    this._tee = Math.round(this._bmr * exerciseFactor);
  }

  weight(weight) {
    this._user.weight = weight;

    return this;
  }

  height(height) {
    this._user.height = height;

    return this;
  }

  age(age) {
    this._user.age = age;

    return this;
  }

  gender(gender) {
    this._user.gender = gender;

    return this;
  }

  exercise(exercise) {
    this._user.exercise = exercise;

    return this;
  }

  /**
   * Gets the BMR (Basal Metabolic Rate) for the subject using the Harris-Benedict equation.
   */
  bmr() {
    return this._bmr;
  }

  /**
   * Gets de TEE (Total Energy Expenditure) for the configured subject.
   */
  tee() {
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
  distributeMacros(macros = {}) {
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
