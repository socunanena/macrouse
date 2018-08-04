const Nutrition = require('../src/index.js').default;

function createClass() {
  const subjectData = {
    weight: 70,
    height: 180,
    age: 38,
    gender: 'male',
  };

  return new Nutrition(subjectData);
}

describe('Nutrition', () => {
  it('should be a class with the proper API: bmr()', () => {
    expect(Nutrition).toBeInstanceOf(Function);
    expect(Nutrition.prototype.bmr).toBeInstanceOf(Function);
  });

  describe('#bmr()', () => {
    it('should calculate the bmr', () => {
      const nutrition = createClass();

      expect(nutrition.bmr()).toBe(2186);
    });
  });

  describe('#tee({ exercise })', () => {
    it('should calculate the tee', () => {
      const nutrition = createClass();

      expect(nutrition.tee({ exercise: 'medium' })).toBe(3388);
    });
  });

  describe('#distributeMacros(options)', () => {
    describe('when the TEE is not calculated yet', () => {
      it('should throw an error', () => {
        const nutrition = createClass();

        expect(nutrition.distributeMacros).toThrow(Error);
      });
    });

    describe('when the macros are expressed in percentages', () => {
      describe('and they are all provided', () => {
        it('should calculate the corresponding calories for each macro', () => {
          const nutrition = createClass();
          nutrition.tee({ exercise: 'medium' });

          const macros = {
            fat: '50%',
            protein: '20%',
            carbs: '30%',
          };

          expect(nutrition.distributeMacros(macros)).toEqual({
            fat: 188,
            protein: 169,
            carbs: 254,
          });
        });
      });

      describe('and there are only two provided', () => {
        it('should put the third macro to 0 and calculate the corresponding calories for each macro', () => {
          const nutrition = createClass();
          nutrition.tee({ exercise: 'medium' });

          const macros = {
            fat: '70%',
            protein: '30%',
          };

          expect(nutrition.distributeMacros(macros)).toEqual({
            fat: 264,
            protein: 254,
            carbs: 0,
          });
        });
      });
    });

    describe('when two macros are provided by value', () => {
      it('should calculate the corresponding calories for the third macro', () => {
        const nutrition = createClass();
        nutrition.tee({ exercise: 'medium' });

        const macros = {
          carbs: 30,
          protein: 140,
        };

        expect(nutrition.distributeMacros(macros)).toEqual({
          fat: 301,
          protein: 140,
          carbs: 30,
        });
      });
    });

    describe('when one macro is provided by value and the rest as percentages', () => {
      it('should calculate the corresponding calories for each macro', () => {
        const nutrition = createClass();
        nutrition.tee({ exercise: 'medium' });

        const macros = {
          fat: '70%',
          protein: '30%',
          carbs: 50,
        };

        expect(nutrition.distributeMacros(macros)).toEqual({
          fat: 248,
          protein: 239,
          carbs: 50,
        });
      });
    });
  });
});
