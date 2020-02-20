// App.jsx
// Import React
import React from  'react';// App.jsx
import { App, View, Page, Navbar, Toolbar, Link } from 'framework7-react';

export default () => (
  // Main Framework7 App component where we pass Framework7 params
  <App params={{ theme: 'auto', name: 'My App', id: 'com.demoapp.test' }}>

    {/* Your main view, should have "main" prop */}
    <View main>
      {/*  Initial Page */}
      <Page>
        {/* Top Navbar */}
        <Navbar title="Awesome App"></Navbar>
        {/* Toolbar */}
        <Toolbar bottom>
          <Link>Link 1</Link>
          <Link>Link 2</Link>
        </Toolbar>
        {/* Page Content */}
        <p>Page content goes here</p>
        <Link href="/about/">About App</Link>
      </Page>
    </View>
  </App>
)