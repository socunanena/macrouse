# Macrouse

## Installation

```shell
$ git clone git@github.com:socunanena/macrouse.git
```

## Usage

### Building the project

```shell
$ cd macrouse
$ yarn
$ yarn run build
```

### Running the app

```javascript
var Macrouse = require('./dist/index').default;

const subjectData = {
  weight: 70,
  height: 180,
  age: 38,
  gender: 'male',
};
const macrouse = new Macrouse(subjectData);

subjectData.bmr();
```

## Documentation

### Macrouse (class)

#### constructor({ weight, height, age, gender })

| Param | Type | Description |
| --- | --- | --- |
| weight | <code>Number</code> | Subject weight in kgs |
| height | <code>Number</code> | Subject height in cms |
| age | <code>Number</code> | Subject age |
| gender | <code>string</code> | Subject gender. Allowed values: 'man', 'woman' |

#### bmr()
Gets the BMR (Basal Metabolic Rate) for the configured subject using the Harris-Benedict equation.

#### tee({ exercise })
Gets de TEE (Total Energy Expenditure) for the configured subject.

| Param | Type | Description |
| --- | --- | --- |
| exercise | <code>string</code> | Exercise factor |

#### distributeMacros(macros)
Distributes the macros so that the total of the calories matches the calculated TEE.

Input data may have different formats. The user can provide:
- The percentages for each macro to calculate the grams values. E.g.:

```javascript
macros = {
  fat: '50%',
  protein: '20%',
  carbs: '30%',
}
```
or
```javascript
macros = {
  fat: '70%',
  protein: '30%',
}
```

- The value for one macro and the percentages for the remaining macros.

```javascript
macros = {
  fat: '70%',
  protein: '30%',
  carbs: 50,
}
```

- The value for two macros.

```javascript
macros = {
  carbs: 30,
  protein: 140,
}
```

| Param | Type | Description |
| --- | --- | --- |
| macros | <code>Object</code> |  |
| macros.fat | <code>Number</code> \| <code>string</code> | Fat in grams or percentage |
| macros.protein | <code>Number</code> \| <code>string</code> | Protein in grams or percentage |
| macros.carbs | <code>Number</code> \| <code>string</code> | Carbs in grams or percentage |
