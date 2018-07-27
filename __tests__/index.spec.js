const Nutrition = require('../src/index.js').default;

describe('Nutrition', () => {
  it('should be a class with the proper API: bmr()', () => {
    expect(Nutrition).toBeInstanceOf(Function);
    expect(Nutrition.prototype.bmr).toBeInstanceOf(Function);
  });

  describe('#bmr()', () => {
    it('should calculate the bmr', () => {
      const subjectData = {
        weight: 70,
        height: 180,
        age: 38,
        gender: 'male',
      };
      const nutrition = new Nutrition(subjectData);

      expect(nutrition.bmr()).toBe(2186.369);
    });
  });
});
