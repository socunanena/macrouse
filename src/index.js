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

    this._bmr = factors.base
      + factors.weight * this._weight
      + factors.height * this._height
      + factors.age * this._age;

    return this._bmr;
  }
}
