/**
 * rollup 配置生成器
 */
const path = require('path')
const toString = require('lodash/toString')
const peerDepsExternal = require('rollup-plugin-peer-deps-external')
const resolve = require('@rollup/plugin-node-resolve').nodeResolve
const commonjs = require('@rollup/plugin-commonjs')
const json = require('@rollup/plugin-json')
// const url = require('rollup-plugin-url')
// const livereload = require('rollup-plugin-livereload')
const alias = require('@rollup/plugin-alias')
const postcss = require('rollup-plugin-postcss')
const ttypescript = require('ttypescript')
const typescript = require('rollup-plugin-typescript2')
const presetEnv = require('@babel/preset-env')
const babel = require('@rollup/plugin-babel').babel
const proposalDecoratorsPlugins = require('@babel/plugin-proposal-decorators')
const proposalClassPlugins = require('@babel/plugin-proposal-class-properties')
const runtimePlugins = require('@babel/plugin-transform-runtime')
const replace = require('@rollup/plugin-replace')
const autoprefixer = require('autoprefixer')
// const syntaxDynamicImportPlugins = require('@babel/plugin-syntax-dynamic-import');
const filesize = require('rollup-plugin-filesize')
const getFiles = require('../loader/files-loader')
// const html = require('@rollup/plugin-html')
// const fs = require('fs')
const { extensions, excludeExtensions } = require('../common')

// UMD/IIFE shared settings: output.globals
// Refer to https://rollupjs.org/guide/en#output-globals for details
const globals = {
  // Provide global variable names to replace your external imports
  jquery: '$'
}

const tempProperty = [
  'skipAlert',
  'formatConfig',
  'templateBase',
  'devServeInput',
  'batchPackage',
  'stylusAlias',
  'replaceMaps',
  'styleExtract'
]
// const EXTERNAL = [Object.keys(pkg.devDependencies)].concat(Object.keys(pkg.peerDependencies))
const isProd = require('../utils/index').isProd()
const cssModulesConfig = isProd
  ? {
    generateScopedName: '[hash:base64:5]'
  }
  : true

module.exports = (packConfig, pkg, formatMapping, cliConfig) => {
  const version = process.env.VERSION || pkg.version
  const { sourceFormat } = cliConfig
  const stylusAlias = packConfig.stylusAlias
  const replaceMaps = packConfig.replaceMaps || {}
  const Evaluator = require('stylus').Evaluator

  if (stylusAlias) {
    const visitImport = Evaluator.prototype.visitImport
    Evaluator.prototype.visitImport = function (imported) {
      const path = imported.path.first
      if (path.string.startsWith('~')) {
        const alias = Object.keys(stylusAlias).find((entry) =>
          path.string.startsWith(`~${entry}`)
        )
        if (alias) {
          path.string = path.string.substr(1).replace(alias, stylusAlias[alias])
        }
      }
      return visitImport.call(this, imported)
    }
  }

  const baseConfig = {
    ...packConfig,
    plugins: []
  }

  const basePlugins = {
    preBase: [
      json(),
      // url({ limit: 10 * 1024 }),
      replace({
        preventAssignment: true,
        __VERSION__: version,
        __ENV__: JSON.stringify('production'),
        ...replaceMaps
      })
    ],
    preConfig: [
      alias({
        entries: [
          {
            find: '@',
            replacement: path.resolve(process.cwd(), './src')
          },
          {
            find: '-',
            replacement: path.join(__dirname, '../../node_modules')
          }
        ]
      }),
      // stylus(),
      postcss({
        extensions: ['.css', '.styl', '.sass', '.scss'],
        modules: cssModulesConfig,
        plugins: [autoprefixer()],
        sourceMap: false,
        extract: packConfig?.styleExtract
          ? `${packConfig.output.directory}/style/style.css`
          : false,
        minimize: true,
        inject: true
      })
      // css(),
    ],
    babel: {
      exclude: ['node_modules/**', 'autopack.config.js'],
      extensions,
      babelHelpers: 'bundled',
      plugins: [
        // syntaxDynamicImportPlugins,
        [proposalDecoratorsPlugins, { legacy: true }],
        [proposalClassPlugins, { loose: true }]
        // runtimePlugins,
      ]
    },
    babelPreset: [
      presetEnv,
      {
        targets: {
          browsers: [
            'last 3 versions',
            '> 2%',
            'ie >= 9',
            'Firefox >= 30',
            'Chrome >= 30'
          ]
        },
        modules: false,
        loose: true,
        shippedProposals: true
      }
    ],
    tsConfig: {
      check: false,
      // tsconfig: path.resolve(__dirname, '../../tsconfig.json'),
      tsconfigOverride: {
        compilerOptions: {
          declarationDir: path.resolve(
            process.cwd(),
            `./${packConfig.output.directory}/types`
          )
        }
      },
      useTsconfigDeclarationDir: true,
      // emitDeclarationOnly: true,
      typescript: ttypescript
    },
    postBase: [
      filesize(),
      process.env.NODE_ENV !== 'production' &&
        cliConfig.debug &&
        require('rollup-plugin-serve')({
          open: true, // 是否打开浏览器
          contentBase: [
            path.resolve(process.cwd(), packConfig.templateBase ?? ''), // 入口html文件位置
            path.resolve(process.cwd(), packConfig.output?.directory ?? '') // 入口dist文件位置
          ],
          historyApiFallback: true, // return index.html instead of 404
          host: 'localhost',
          port: 3003,
          // // set headers
          // headers: {
          //   'Access-Control-Allow-Origin': '*'
          // },
          // // execute function after server has begun listening
          onListening: function (server) {
            const address = server.address()
            const host = address.address === '::' ? 'localhost' : address.address
            // by using a bound function, we can access options as `this`
            const protocol = this.https ? 'https' : 'http'
            console.log(
              `Server listening at ${protocol}://${host}:${address.port}/`
            )
          },
          verbose: true // 打印输出serve路径
        })
      // process.env.NODE_ENV !== 'production' &&
      //   cliConfig.debug &&
      //   require('@rollup/plugin-html')({
      //     dest: 'example',
      //     filename: 'index.html',
      //     template: () => fs.readFileSync(path.resolve(
      //       process.cwd(),
      //       './example/template.html'
      //     )),
      //     ignore: /cjs\.js/
      //   })
      // livereload({
      //   watch: packConfig.output.directory,
      //   port: 35729
      // }
    ],
    postConfig: [
      resolve({
        extensions,
        mainFields: ['jsnext:main', 'preferBuiltins', 'browser']
      }),
      commonjs()
    ]
  }
  const commonJSConf = (esMod = true) => [
    ...basePlugins.preConfig,
    babel({
      exclude: ['node_modules/**', 'autopack.config.js'],
      extensions: ['.mjs', ...extensions],
      babelHelpers: 'runtime',
      // babelrc: false,
      presets: [
        basePlugins.babelPreset
        // ["@babel/preset-typescript"]
      ],
      plugins: [
        // syntaxDynamicImportPlugins,
        [proposalDecoratorsPlugins, { legacy: true }],
        [proposalClassPlugins, { loose: true }],
        [runtimePlugins, { useESModules: esMod }]
      ]
    }),
    ...basePlugins.postConfig
  ]
  const commonTSConf = [
    ...basePlugins.preConfig,
    ...basePlugins.postConfig,
    typescript(basePlugins.tsConfig)
  ]

  function mapFormatToConfig (format, sourceFormat) {
    // esm格式配置
    if (format === 'es') {
      const esPluginMap = {
        js: commonJSConf(true),
        ts: commonTSConf
      }
      const esPlugins = esPluginMap[sourceFormat] || []
      const esConfig = {
        ...baseConfig,
        plugins: [
          peerDepsExternal(),
          ...basePlugins.preBase,
          ...esPlugins,
          ...basePlugins.postBase
        ]
      }
      return esConfig
    }

    // commonjs格式配置
    if (format === 'cjs') {
      const cjsPluginMap = {
        js: commonJSConf(false),
        ts: commonTSConf
      }
      const cjsPlugins = cjsPluginMap[sourceFormat] || []
      const cjsConfig = {
        ...baseConfig,
        plugins: [
          peerDepsExternal(),
          ...basePlugins.preBase,
          ...cjsPlugins,
          ...basePlugins.postBase
        ]
      }
      return cjsConfig
    }

    // umd格式配置
    if (format === 'umd') {
      const umdPluginMap = {
        js: commonJSConf(false),
        ts: commonTSConf
      }
      const umdPlugins = umdPluginMap[sourceFormat] || []
      const umdConfig = {
        ...baseConfig,
        plugins: [
          ...basePlugins.preBase,
          ...umdPlugins,
          ...basePlugins.postBase
        ]
      }
      return umdConfig
    }

    // iife和amd格式配置
    if (format === 'iife' || format === 'amd') {
      const unpkgPluginsMap = {
        js: [
          ...basePlugins.preConfig,
          babel({
            ...basePlugins.babel,
            presets: [basePlugins.babelPreset],
            plugins: [
              // syntaxDynamicImportPlugins,
              [proposalDecoratorsPlugins, { legacy: true }],
              [proposalClassPlugins, { loose: true }]
            ]
          }),
          ...basePlugins.postConfig
        ],
        ts: commonTSConf
      }
      const unpkgPlugins = unpkgPluginsMap[sourceFormat] || []
      const unpkgConfig = {
        ...baseConfig,
        plugins: [
          ...basePlugins.preBase,
          ...unpkgPlugins,
          ...basePlugins.postBase
        ]
      }
      return unpkgConfig
    }
  }

  const pkgDeps = pkg.dependencies
    ? Object.keys(pkg.dependencies).map((d) => toString(d))
    : []

  const rollupConfigRes = packConfig.output.format.reduce((acc, format) => {
    const { external = [], isolateDep } =
      packConfig.formatConfig?.[format] ?? {}
    const externals = isolateDep ? pkgDeps.concat(external) : external
    const configRes = mapFormatToConfig(format, sourceFormat)
    const config = {
      ...configRes,
      output: {
        ...packConfig.output,
        file: `${packConfig.output.directory}/${packConfig.output.name}${
          formatMapping[format] ? `${formatMapping[format]}` : ''
        }`,
        format,
        sourcemap: isProd,
        compact: format !== 'es',
        exports: format === 'es' ? 'named' : 'auto',
        globals
      },
      external: [...new Set(externals)]
    }

    // 非prod环境并且是debug状态并且devServeInput有值时，切换input为指定example入口文件
    if (!isProd && !!cliConfig.debug && !!packConfig.devServeInput) {
      config.input = packConfig.devServeInput ?? ''
    }

    // batchPackage为true时，会自动开启批量打包, 默认批量路径为"./packages"，可配置 input 数组属性指定input路径文件
    if (!!packConfig?.batchPackage) {
      config.input = [
        ...getFiles('./packages', extensions, excludeExtensions)
      ]
    }

    tempProperty.forEach((property) => {
      if (Object.prototype.hasOwnProperty.call(config, property)) {
        delete config[property]
      }
      if (Object.prototype.hasOwnProperty.call(config.output, 'directory')) {
        delete config.output.directory
      }
    })

    return [...acc, config]
  }, [])

  return rollupConfigRes
}
