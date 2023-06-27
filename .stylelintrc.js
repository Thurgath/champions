module.exports = {
  extends: ['stylelint-config-standard-scss'],
  plugins: ['stylelint-scss'],
  rules: {
    'property-no-unknown': null,
    //Take a look at these rules and see if they really should be changed or disabled
    //Fix color-function-notation and alpha-value-notation. Sass doesn't support new notation?
    //There's a proposed rule in https://github.com/stylelint-scss/stylelint-scss/issues/582 though.
    'alpha-value-notation': 'number',
    'color-function-notation': 'legacy',
    'declaration-empty-line-before': null,
    'media-feature-range-notation': 'prefix',
    'no-descending-specificity': [true, {
      ignore: ['selectors-within-list'],
    }],
    'property-no-vendor-prefix': null,
    'rule-empty-line-before': null,
    'selector-class-pattern': '^[a-z][a-z0-9-]+$',
    //SCSS
    'scss/at-extend-no-missing-placeholder': null,
  },
}