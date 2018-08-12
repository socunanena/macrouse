import Schema from 'validate';

export function validateUser(user) {
  const greaterThanZero = value => value >= 0;

  const userSchema = new Schema({
    weight: {
      type: Number,
      required: true,
      // TODO use built-in validator https://github.com/eivindfjeldstad/validate/issues/63
      use: { greaterThanZero },
    },
    height: {
      type: Number,
      required: true,
      // TODO use built-in validator https://github.com/eivindfjeldstad/validate/issues/63
      use: { greaterThanZero },
    },
    age: {
      type: Number,
      required: true,
      // TODO use built-in validator https://github.com/eivindfjeldstad/validate/issues/63
      use: { greaterThanZero },
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
  });

  userSchema.message({ greaterThanZero: path => `${path} should be greater than zero` });

  const errors = userSchema.validate(user);

  if (errors.length) {
    throw Error(`User validation errors: ${errors.map(e => e.message).join(', ')}`);
  }

  return true;
}
