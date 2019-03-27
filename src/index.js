import { mapValues, reduce } from 'lodash';
import { METABOLISM_CONSTANTS, ACTIVITY_FACTORS, MACROS_CALORIES } from '../config/constants';
import { validateUser, validateMacrosTypes } from './validators';

/**
 * @param {Object} params
 * @param {Object} params.percentages
 * @param {number} params.remainingCalories
 */
function percentagesToGrams({ percentages, remainingCalories }) {
  return mapValues(
    percentages,
    (value, key) => Math.round((remainingCalories * (value / 100)) / MACROS_CALORIES[key]),
  );
}

export default class Macrouse {
  /**
   * @param {Object} user
   * @param {number} user.weight User weight in kgs
   * @param {number} user.height User height in cms
   * @param {number} user.age User age
   * @param {string} user.gender User gender. Allowed values: 'male', 'female'
   * @param {string} user.exercise User exercise.
   *                               Allowed values: 'none', 'low', 'medium', 'high', 'extreme'
   * @param {number} user.activityFactor User activity factor.
   * @param {number} [user.goal=1] User goal.
   */
  constructor({ weight, height, age, gender, exercise, activityFactor, goal = 1 }) {
    const user = { weight, height, age, gender, exercise, activityFactor, goal };

    validateUser(user);

    const computeState = this._computeState.bind(this);

    this._user = new Proxy(
      user,
      {
        set: (object, property, value) => {
          object[property] = value;
          validateUser(object);
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
    this._calculateCalorieGoal();
  }

  _calculateBmr() {
    this._bmr = Math.round(
      METABOLISM_CONSTANTS.weight * this._user.weight
      + METABOLISM_CONSTANTS.height * this._user.height
      - METABOLISM_CONSTANTS.age * this._user.age
      + METABOLISM_CONSTANTS.base[this._user.gender],
    );
  }

  _calculateTee() {
    const activityFactor = this._user.activityFactor || ACTIVITY_FACTORS[this._user.exercise];

    this._tee = Math.round(this._bmr * activityFactor);
  }

  _calculateCalorieGoal() {
    this._calorieGoal = Math.round(this._tee * this._user.goal);
  }

  /**
   * Sets the user weight.
   *
   * @param {number} weight User weight
   */
  weight(weight) {
    this._user.weight = weight;

    return this;
  }

  /**
   * Sets the user height.
   *
   * @param {number} height User height
   */
  height(height) {
    this._user.height = height;

    return this;
  }

  /**
   * Sets the user age.
   *
   * @param {number} age User age
   */
  age(age) {
    this._user.age = age;

    return this;
  }

  /**
   * Sets the user gender.
   *
   * @param {string} gender User gender. Allowed values: 'male', 'female'
   */
  gender(gender) {
    this._user.gender = gender;

    return this;
  }

  /**
   * Sets the user exercise.
   *
   * @param {string} exercise User exercise.
   *                          Allowed values: 'none', 'low', 'medium', 'high', 'extreme'
   */
  exercise(exercise) {
    this._user.exercise = exercise;

    return this;
  }

  /**
   * Sets the user activity factor.
   *
   * @param {number} activityFactor User activity factor
   */
  activityFactor(activityFactor) {
    this._user.activityFactor = activityFactor;

    return this;
  }

  /**
   * Sets the user goal.
   *
   * @param {number} goal User goal
   */
  goal(goal) {
    this._user.goal = goal;

    return this;
  }

  /**
   * Gets the BMR (Basal Metabolic Rate) for the user using the Harris-Benedict equation.
   */
  bmr() {
    return this._bmr;
  }

  /**
   * Gets de TEE (Total Energy Expenditure) for the configured user.
   */
  tee() {
    return this._tee;
  }

  /**
   * Gets de calorie goal for the configured user.
   */
  calorieGoal() {
    return this._calorieGoal;
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
   * @param {number|string} macros.fat Fat in grams or percentage
   * @param {number|string} macros.protein Protein in grams or percentage
   * @param {number|string} macros.carbs Carbs in grams or percentage
   */
  distributeMacros(macros = {}) {
    const { percentages, grams } = validateMacrosTypes(macros);

    const gramsToCalories = (calories, value, key) => calories + value * MACROS_CALORIES[key];
    const providedCalories = reduce(grams, gramsToCalories, 0);
    const remainingCalories = this._tee - providedCalories;

    return {
      ...grams,
      ...percentagesToGrams({ percentages, remainingCalories }),
    };
  }
}
