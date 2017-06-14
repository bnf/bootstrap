#!/usr/bin/env node

'use strict';

const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const pkg = require('../package.json');

const formats = [
  'es',
  //'cjs',
  //'umd',
  //'iife',
];

const year = new Date().getFullYear();
const banner =
`/*!
 * Bootstrap v${pkg.version} (${pkg.homepage})
 * Copyright 2011-${year} ${pkg.author}
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
`;


let promise = Promise.resolve();

// Compile source code into a distributable format with Babel
formats.forEach((format) => {

  promise = promise.then(() => rollup.rollup({
    entry: `js/src/${pkg.name}.js`,
    external: Object.keys(pkg.dependencies),
    plugins: [babel({
      presets: [ [ 'es2015', { 'loose': true, 'modules': false } ] ],
      plugins: [ 'external-helpers' ],
      babelrc: false,
      exclude: 'node_modules/**',
    })],
  })
  .then(bundle => bundle.write({
    dest: `dist/js/${pkg.name}.${format}.js`,
    sourceMap: true,
    format,
    banner,
    // required for umd and iife
    globals: { jquery: 'jQuery', 'popper.js': 'Popper' },
    moduleName: pkg.name,
    //moduleName: format === 'umd' || format === 'iife' ? pkg.name : undefined,
  })));
});

promise.catch(err => console.error(err.stack)); // eslint-disable-line no-console
