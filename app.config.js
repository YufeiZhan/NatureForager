module.exports = ({ config }) => {
  // add secret google maps api key from the environment
  // use spread syntax so we can set a property several layers deep
  // without affecting anything that exists already
  config.android = {
    ...config.android,
    config: {
      ...config.android?.config,
      googleMaps: {
        ...config.android?.config?.googleMaps,
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
  };

  return config;
};
