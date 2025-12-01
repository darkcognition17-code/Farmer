const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const svgTransformer = require('react-native-svg-transformer');
const { resolver: defaultResolver } = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: defaultResolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...defaultResolver.sourceExts, 'svg'],
  },
   moduleNameMapper: {
    'react-native-permissions': '<rootDir>/node_modules/react-native-permissions/mock',
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

