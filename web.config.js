const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Add custom webpack configuration for better scrolling
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
  };

  // Add CSS rules for better scrolling
  config.module.rules.push({
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
  });

  // Ensure proper viewport configuration
  config.plugins.push(
    new (require('html-webpack-plugin'))({
      template: './web/index.html',
      templateParameters: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no',
      },
    })
  );

  return config;
};
