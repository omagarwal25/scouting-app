module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            // This needs to be mirrored in tsconfig.json
            '@': '.',
          },
        },
      ],
    ],
    presets: ['babel-preset-expo'],
  };
};
