import React from 'react'
import ReactDOM from 'react-dom/client'
import { Online, Offline } from 'react-detect-offline'

import './index.css'
import App from './components/app/app'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.Fragment>
    <Online>
      <App className="app" />
    </Online>
    <Offline>
      <div
        className="abstract-about-connection"
        style={{
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: 'large',
          textAlign: 'center',
          marginTop: '45%',
        }}
      >
        Sorry, something bad happened.
        <br />
        Please check your internet connection
      </div>
    </Offline>
  </React.Fragment>
)
