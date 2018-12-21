const { buildWebpackConfig } = require('webpack-preset-accurapp')
const typescript = require('webpack-blocks-ts')
const { customConfig, match, setOutput } = require('@webpack-blocks/webpack')
const { babel } = require('./node_modules/webpack-preset-accurapp/customBlocks')

module.exports = buildWebpackConfig([typescript({ silent: true })])

const excludeMapbox = match(
  '*.js',
  {
    include: /node_modules/,
    exclude: /mapbox-gl/,
  },
  [
    babel({
      babelrc: false,
      presets: [['@babel/preset-env', { modules: false }]],
    }),
  ],
)

const workerLoader = () => {
  return (context, { addLoader }) =>
    addLoader({
      test: /\.worker\.js$/,
      loader: 'worker-loader',
    })
}

module.exports = buildWebpackConfig([
  typescript(),
  customConfig({
    optimization: {
      splitChunks: false,
    },
    node: {
      fs: 'empty',
    },
  }),
  workerLoader(),
  setOutput({ globalObject: 'this' }),
  excludeMapbox,
])
