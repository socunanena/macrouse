# Nutrition

## Installation

```shell
$ git clone git@github.com:socunanena/nutrition.git
```

## Usage

### Building the project

```shell
$ cd nutrition
$ yarn
$ yarn run build
```

### Running the app

```javascript
var Nutrition = require('./dist/index').default;

const subjectData = {
  weight: 70,
  height: 180,
  age: 38,
  gender: 'male',
};
const nutrition = new Nutrition(subjectData);

subjectData.bmr();
```

## Documentation

### Nutrition (class)

#### constructor({ weight, height, age, gender })

| Param | Type | Description |
| --- | --- | --- |
| weight | <code>Number</code> | Subject weight in kgs |
| height | <code>Number</code> | Subject height in cms |
| age | <code>Number</code> | Subject age |
| gender | <code>string</code> | Subject gender. Allowed values: 'man', 'woman' |

#### bmr()
Gets the BMR (Basal Metabolic Rate) for the configured subject using the Harris-Benedict equation.
