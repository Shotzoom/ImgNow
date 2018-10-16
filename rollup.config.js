import tsc from 'typescript';
import typescript from 'rollup-plugin-typescript2';
import replace from 'rollup-plugin-replace';
import * as pkg from './package.json';

function plugins() {
  return [
    typescript({
      typescript: tsc,
      useTsconfigDeclarationDir: true,
      tsconfig: 'tsconfig.json',
      cacheRoot: 'cache'
    }),
    replace({
      ASSEMBLY_VERSION: pkg.version
    })
  ]
}

export default [
  {
    input: 'targets/module.ts',
    output: [
      { file: 'lib/imgnow.js', format: 'cjs' },
      { file: 'lib/imgnow.es.js', format: 'es' },
      { file: 'bin/imgnow.js', format: 'umd', name: 'imgnow' }
    ],
    plugins: plugins()
  },
  {
    input: 'targets/angularjs.ts',
    output: [
      { file: 'bin/imgnow.angularjs.js', format: 'iife' }
    ],
    plugins: plugins()
  }
];
