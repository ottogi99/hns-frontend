import RootRoutes from './routes';
import React from 'react';

import './App.css';
import 'css/base.css';
import 'css/page.css';
import 'css/user.css';
import 'css/nav.css';


//import EgovMain from './page/main/EgovMain.jsx';

function App() {
  return (
/*    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
*/
<div className="wrap">
      <React.StrictMode>
        <RootRoutes />
      </React.StrictMode>
    </div>
    );
  
}

export default App;
