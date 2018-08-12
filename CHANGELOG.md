# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2018-08-12
### Added
- New methods in `Macrouse` to set the user information and recalculate the class state: `weight`, `height`, `age`, `gender` and `exercise`
- Input validation
- Eslint script and rules
- Package description
- Changelog file

### Changed
- `Macrouse` constructor now receives the `exercise` parameter needed to calculate the `tee()`
- `tee()` method don't receive `exercise` parameter anymore
- Precalculated `bmr()` and `tee()` in the constructor as a state of the class
- Refactored macros validation
- Documentation

## [1.0.3] - 2018-08-05
### Changed
- Documentation

## [1.0.2] - 2018-08-05
### Changed
- Entry point exposing the default module

## 1.0.1 - 2018-08-05
### Added
- Webpack

## 1.0.0 - 2018-08-05
### Added
- Macrouse class
- `bmr()`, `tee()` and `distributeMacros()` implementation
- Tests
- Documentation
- Babel

[Unreleased]: https://github.com/socunanena/macrouse/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/socunanena/macrouse/compare/v1.0.3...v2.0.0
[1.0.3]: https://github.com/socunanena/macrouse/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/socunanena/macrouse/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/socunanena/macrouse/compare/v1.0.0...v1.0.1