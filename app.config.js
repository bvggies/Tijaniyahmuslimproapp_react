export default ({ config }) => ({
    ...config,
    extra: {
      // API URL Configuration
      // 
      // OPTION 1: Use Vercel Backend (Recommended for all environments)
      // Replace 'your-project' with your actual Vercel project name
      API_URL: process.env.API_URL || 'https://your-project.vercel.app',
      //
      // OPTION 2: Use Local Backend (for development only)
      // For physical device: Use http://YOUR_LOCAL_IP:3000 (not localhost)
      // For simulator: Use http://localhost:3000
      // API_URL: process.env.API_URL || 'http://localhost:3000',
      //
      // IMPORTANT: Backend always uses PERMANENT database regardless of API_URL
      // See docs/VERCEL_DEPLOYMENT_STEP_BY_STEP.md for deployment guide
    },
  });
