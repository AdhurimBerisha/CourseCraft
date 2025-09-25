const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Firebase packages sometimes ship CommonJS files with a .cjs extension.
// Ensure Metro knows to resolve .cjs files so imports like `firebase/auth`
// can be found when bundling for React Native / Expo.
config.resolver.sourceExts = [...config.resolver.sourceExts, "cjs"];

module.exports = config;
