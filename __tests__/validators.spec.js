const { validateUser, validateMacrosTypes } = require('../src/validators');

describe('#validateUser(user)', () => {
  describe('when the input is correct', () => {
    it('should return true', () => {
      const user = {
        weight: 70,
        height: 180,
        age: 38,
        gender: 'male',
        exercise: 'medium',
      };

      expect(validateUser(user)).toBeTruthy();
    });
  });

  describe('when the input is NOT correct', () => {
    it('should throw an error with all the messages concatenated', () => {
      const user = {
        weight: 70,
        height: -180,
        age: 38,
        gender: 'male',
        exercise: 'hard',
      };

      const validation = () => validateUser(user);

      expect(validation).toThrowError(
        'User validation errors: height should be greater than zero, exercise must be either none, low, medium, high or extreme'
      );
    });
  });
});

describe('#validateMacrosTypes(macros)', () => {
  describe('when there are more than one unprovided macros', () => {
    it('should throw an error', () => {
      const macros = { fat: 120 };

      const validate = () => validateMacrosTypes(macros);

      expect(validate)
        .toThrowError('There should be just one single macro to be calculated');
    });
  });

  describe('when the macros are expressed in percentages', () => {
    describe('and they are all provided', () => {
      it('should fill the percentages object', () => {
        const macros = {
          fat: '50%',
          protein: '20%',
          carbs: '30%',
        };
        const expectedMacros = {
          percentages: { fat: 50, protein: 20, carbs: 30 },
          grams: {},
        };

        expect(validateMacrosTypes(macros)).toEqual(expectedMacros);
      });
    });

    describe('and there are only two provided', () => {
      it('should put the third macro to 0 and fill the percentages object', () => {
        const macros = {
          fat: '70%',
          protein: '30%',
        };
        const expectedMacros = {
          percentages: { fat: 70, protein: 30, carbs: 0 },
          grams: {},
        };

        expect(validateMacrosTypes(macros)).toEqual(expectedMacros);
      });
    });
  });

  describe('when two macros are provided by value', () => {
    it('should fill the grams object', () => {
      const macros = {
        carbs: 30,
        protein: 140,
      };
      const expectedMacros = {
        percentages: { fat: 100 },
        grams: { protein: 140, carbs: 30 },
      };

      expect(validateMacrosTypes(macros)).toEqual(expectedMacros);
    });
  });

  describe('when one macro is provided by value and the rest as percentages', () => {
    it('should fill the percentages and grams objects', () => {
      const macros = {
        fat: '70%',
        protein: '30%',
        carbs: 50,
      };
      const expectedMacros = {
        percentages: { fat: 70, protein: 30 },
        grams: { carbs: 50 },
      };

      expect(validateMacrosTypes(macros)).toEqual(expectedMacros);
    });
  });
});
