# Tijaniyah Muslim Pro - Landing Page

A modern, beautiful landing page built with Create React App and Material UI for the Tijaniyah Muslim Pro mobile application.

## Features

- 🎨 Modern, responsive design with Material UI
- 📱 Fully mobile-responsive
- 🚀 Fast and optimized performance
- 📄 Privacy Policy page (Google Play compliant)
- 📋 Terms and Conditions page (Google Play compliant)
- 🧭 Smooth navigation and scrolling
- ✨ Beautiful animations and transitions

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the landing-page directory:
```bash
cd landing-page
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Building for Production

To create a production build:

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
landing-page/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── LandingPage.js
│   │   ├── PrivacyPolicy.js
│   │   ├── TermsAndConditions.js
│   │   ├── Navbar.js
│   │   └── Footer.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Pages

- **Home** (`/`) - Main landing page with features and call-to-action
- **Privacy Policy** (`/privacy-policy`) - Comprehensive privacy policy compliant with Google Play policies
- **Terms and Conditions** (`/terms-and-conditions`) - Terms of service compliant with Google Play policies

## Technologies Used

- React 18
- Material UI (MUI) 5
- React Router DOM 6
- Create React App

## Customization

### Colors

The app uses a custom color scheme defined in `src/App.js`:
- Primary: `#052F2A` (Dark green)
- Secondary: `#D4AF37` (Gold)
- Background: `#F8F9FA` (Light gray)

### Typography

The app uses the Inter font family for a modern, clean look.

## Deployment

### Vercel (Recommended)

The project is pre-configured for Vercel deployment. See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.

**Quick Deploy:**
1. Push code to Git repository
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Set **Root Directory** to `landing-page`
5. Click "Deploy"

Vercel will automatically:
- Detect Create React App
- Configure build settings
- Deploy to production
- Set up continuous deployment

**Via CLI:**
```bash
cd landing-page
npm i -g vercel
vercel login
vercel --prod
```

### Other Platforms

This app can also be deployed to:
- **Netlify**: Run `npm run build` and deploy the `build` folder
- **GitHub Pages**: Use `gh-pages` package
- **Any static hosting**: Deploy the `build` folder contents

## License

This project is part of the Tijaniyah Muslim Pro application.

