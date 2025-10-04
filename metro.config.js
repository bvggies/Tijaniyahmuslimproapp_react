const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper handling of all file types
config.resolver.assetExts.push(
  // Add any additional asset extensions your app uses
  'db',
  'mp3',
  'ttf',
  'obj',
  'png',
  'jpg'
);

module.exports = config;
