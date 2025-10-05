export default ({ config }) => ({
    ...config,
    extra: {
      API_URL: process.env.API_URL,
    },
  });
