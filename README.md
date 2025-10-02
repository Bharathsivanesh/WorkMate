## WebView Integration

This React Native app uses a WebView to display a web application inside the mobile app.

- **Current setup (development):**  
  The WebView points to a local development server:  
  `http://192.168.0.17:5173`  
  This allows live reloading and testing during development.

- **Future setup (production):**  
  In the production build, the WebView will point to the deployed URL of the web application, for example:  
  `https://mywebapp.com`  
  This ensures the app always loads the live, deployed version of the website.

> **Note:** Make sure to update the `source.uri`(index.tsx) in the WebView component before building for production.
