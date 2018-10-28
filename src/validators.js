import { reduce, pickBy, keys, intersection, isEqual, lt } from 'lodash';
import Schema from 'validate';

function validateDependencies({ user, dependencies }) {
  const userFilledKeys = keys(pickBy(user, Boolean));
  const validations = {
    single: isEqual.bind(null, 1),
    multiple: lt.bind(null, 0),
  };

  return dependencies.map((dependency) => {
    const filledDependants = intersection(userFilledKeys, dependency.dependants).length;

    return !validations[dependency.type](filledDependants)
      && new Error(`Fields dependency errors: [${dependency.dependants}]`);
  }).filter(Boolean);
}

/**
 * @param {Object} user
 * @param {number} user.weight User weight in kgs
 * @param {number} user.height User height in cms
 * @param {number} user.age User age
 * @param {string} user.gender User gender. Allowed values: 'male', 'female'
 * @param {string} user.exercise User exercise.
 *                               Allowed values: 'none', 'low', 'medium', 'high', 'extreme'
 * @param {number} user.activityFactor User activity factor.
 * @param {number} user.goal User goal.
 */
export function validateUser(user) {
  const userSchema = new Schema({
    weight: {
      type: Number,
      required: true,
      size: { min: 0 },
    },
    height: {
      type: Number,
      required: true,
      size: { min: 0 },
    },
    age: {
      type: Number,
      required: true,
      size: { min: 0 },
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female'],
    },
    exercise: {
      type: String,
      enum: ['none', 'low', 'medium', 'high', 'extreme'],
    },
    activityFactor: {
      type: Number,
      size: { min: 1, max: 2.4 },
    },
    goal: {
      type: Number,
      required: false,
      size: { min: 0, max: 2 },
    },
  });

  const dependencies = [{
    type: 'single',
    dependants: ['exercise', 'activityFactor'],
  }];

  const errors = [
    ...userSchema.validate(user),
    ...validateDependencies({ user, dependencies }),
  ];

  if (errors.length) {
    throw Error(`User validation errors: ${errors.map(e => e.message).join(', ')}`);
  }

  return true;
}

/**
 * @param {Object} macros
 * @param {number|string} macros.fat Fat in grams or percentage
 * @param {number|string} macros.protein Protein in grams or percentage
 * @param {number|string} macros.carbs Carbs in grams or percentage
 */
export function validateMacrosTypes({ fat, protein, carbs }) {
  const toCalculate = [];

  const validated = reduce(
    { fat, protein, carbs },
    (types, value, key) => {
      switch (typeof value) {
        case 'number':
          types.grams[key] = value;
          break;
        case 'string':
          const match = value.match(/^(\d+)%$/)[1];
          if (match) {
            types.percentages[key] = parseFloat(match);
          }
          break;
        default:
          toCalculate.push(key);
      }

      return types;
    },
    {
      percentages: {},
      grams: {},
    },
  );

  if (toCalculate.length) {
    if (toCalculate.length > 1) {
      throw new Error('There should be just one single macro to be calculated');
    }
    validated.percentages[toCalculate.pop()] = Object.keys(validated.grams).length === 2 ? 100 : 0;
  }

  return validated;
}
