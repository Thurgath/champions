module.exports = {
  recursive: true,
  require :  './test/test-setup.js',
  ignore : [
    './test/test-**setup*',
    './node_modules',
  ],
  loader: 'testdouble',
  package: './package.json',
}