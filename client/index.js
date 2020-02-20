
// Import React
import React from  'react';

// Import ReactDOM
import ReactDOM from  'react-dom';

// Import F7 Bundle
import Framework7 from 'framework7/framework7-lite.esm.bundle.js';

// Import F7-React Plugin
import Framework7React from 'framework7-react';

// Init F7-React Plugin
Framework7.use(Framework7React);

// Import Main App component
import App from './App.jsx';

// Mount React App
ReactDOM.render(
  React.createElement(App),
  document.getElementById('root')
)