export default ({ config }) => ({
    ...config,
    plugins: [
      ...(config.plugins || []),
      "expo-sqlite"
    ],
    extra: {
      // API URL Configuration
      // Using Vercel backend for both production and local testing
      // Backend URL: https://tijaniyahmuslimproapp-backend.vercel.app
      API_URL: process.env.API_URL || 'https://tijaniyahmuslimproapp-backend.vercel.app',
      //
      // IMPORTANT: Backend always uses PERMANENT database regardless of API_URL
      // See docs/VERCEL_DEPLOYMENT_STEP_BY_STEP.md for deployment guide
      //
      // To use local backend instead (for development only):
      // For physical device: Use http://YOUR_LOCAL_IP:3000 (not localhost)
      // For simulator: Use http://localhost:3000
      // API_URL: process.env.API_URL || 'http://localhost:3000',
      
      // Groq API for AI Noor
      GROQ_API_KEY: process.env.GROQ_API_KEY || '',
    },
  });
