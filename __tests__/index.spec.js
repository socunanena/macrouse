const Macrouse = require('../src/index.js').default;

function createClass() {
  const subjectData = {
    weight: 70,
    height: 180,
    age: 38,
    gender: 'male',
    exercise: 'medium',
  };

  return new Macrouse(subjectData);
}

describe('Macrouse', () => {
  it('should be a class with the proper API: bmr(), tee(), distributeMacros()', () => {
    expect(Macrouse).toBeInstanceOf(Function);
    expect(Macrouse.prototype.bmr).toBeInstanceOf(Function);
    expect(Macrouse.prototype.tee).toBeInstanceOf(Function);
    expect(Macrouse.prototype.distributeMacros).toBeInstanceOf(Function);
  });

  describe('#bmr()', () => {
    it('should return the bmr', () => {
      const macrouse = createClass();

      expect(macrouse.bmr()).toBe(2186);
    });
  });

  describe('#tee()', () => {
    it('should return the tee', () => {
      const macrouse = createClass();

      expect(macrouse.tee()).toBe(3388);
    });

    describe('when the user exercise is updated', () => {
      it('should recalculate the state (bmr & tee)', () => {
        const macrouse = createClass();

        expect(macrouse.exercise('high').tee()).toBe(3771);
      });
    });
  });

  describe('#distributeMacros(options)', () => {
    describe('when there are more than one unprovided macros', () => {
      it('should throw an error', () => {
        const macrouse = createClass();

        const distributeMacros = () => macrouse.distributeMacros({ fat: 120 });

        expect(distributeMacros)
          .toThrowError('There should be just one single macro to be calculated');
      });
    });

    describe('when the macros are expressed in percentages', () => {
      describe('and they are all provided', () => {
        it('should calculate the corresponding calories for each macro', () => {
          const macrouse = createClass();

          const macros = {
            fat: '50%',
            protein: '20%',
            carbs: '30%',
          };

          expect(macrouse.distributeMacros(macros)).toEqual({
            fat: 188,
            protein: 169,
            carbs: 254,
          });
        });
      });

      describe('and there are only two provided', () => {
        it('should put the third macro to 0 and calculate the corresponding calories for each macro', () => {
          const macrouse = createClass();

          const macros = {
            fat: '70%',
            protein: '30%',
          };

          expect(macrouse.distributeMacros(macros)).toEqual({
            fat: 264,
            protein: 254,
            carbs: 0,
          });
        });
      });
    });

    describe('when two macros are provided by value', () => {
      it('should calculate the corresponding calories for the third macro', () => {
        const macrouse = createClass();

        const macros = {
          carbs: 30,
          protein: 140,
        };

        expect(macrouse.distributeMacros(macros)).toEqual({
          fat: 301,
          protein: 140,
          carbs: 30,
        });
      });
    });

    describe('when one macro is provided by value and the rest as percentages', () => {
      it('should calculate the corresponding calories for each macro', () => {
        const macrouse = createClass();

        const macros = {
          fat: '70%',
          protein: '30%',
          carbs: 50,
        };

        expect(macrouse.distributeMacros(macros)).toEqual({
          fat: 248,
          protein: 239,
          carbs: 50,
        });
      });
    });
  });
});
