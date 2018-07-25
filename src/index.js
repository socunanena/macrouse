const CONSTANTS = {
  man: {
    base: 66.5,
    weight: 13.75,
    height: 5.003,
    age: 6.755,
  },
  woman: {
    base: 655.1,
    weight: 9.563,
    height: 1.850,
    age: 4.676,
  },
}

/**
 * Gets the BMR (Basal Metabolic Rate) using the Harris–Benedict equation.
 *
 * @param {Number} weight User weight in kgs
 * @param {Number} height User height in cms
 * @param {Number} age User age
 * @param {string} gender User gender. Allowed values: 'man', 'woman'
 */
export function bmr(weight, height, age, gender) {
  const constants = CONSTANTS[gender];

  return constants.base
    + constants.weight * weight
    + constants.height * height
    + constants.age * age;
}
