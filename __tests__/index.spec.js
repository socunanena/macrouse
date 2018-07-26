const index = require('../src/index.js');

describe('index.js', () => {
  describe('bmr', () => {
    it('should calculate the bmr', () => {
      const bmr = index.bmr(70, 180, 38, 'man');

      expect(bmr).toBe(2186.23);
    });
  });
});
