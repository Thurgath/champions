module.exports = {
  recursive: true,
  require :  [ './test/test-setup.js', 'test/test-champion-update-setup.mjs' ],
  ignore : [
    './test/test-**setup*',
    './node_modules',
  ],
  loader: 'testdouble',
  package: './package.json',
}