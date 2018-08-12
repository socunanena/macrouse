const { validateUser } = require('../src/validators');

describe('#validateUser', () => {
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
