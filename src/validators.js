import { reduce } from 'lodash';
import Schema from 'validate';

/**
 * @param {Object} user
 * @param {number} user.weight User weight in kgs
 * @param {number} user.height User height in cms
 * @param {number} user.age User age
 * @param {string} user.gender User gender. Allowed values: 'male', 'female'
 * @param {string} user.exercise User exercise.
 *                               Allowed values: 'none', 'low', 'medium', 'high', 'extreme'
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
      required: true,
      enum: ['none', 'low', 'medium', 'high', 'extreme'],
    },
    goal: {
      type: Number,
      required: false,
      size: { min: 0, max: 2 },
    },
  });

  const errors = userSchema.validate(user);

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
