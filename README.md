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
var { bmr } = require('./dist/index.js');

bmr(70, 180, 38, 'man');
```

## Documentation

### bmr(weight, height, age, gender)
Gets the BMR (Basal Metabolic Rate) using the Harris–Benedict equation.

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| weight | <code>Number</code> | User weight in kgs |
| height | <code>Number</code> | User height in cms |
| age | <code>Number</code> | User age |
| gender | <code>string</code> | User gender. Allowed values: 'man', 'woman' |
