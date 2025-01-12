// import { useState } from 'react'
import React, { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Widget, { component, configuration, journey } from '@forgerock/login-widget';
import '@forgerock/login-widget/widget.css';

function App() {
  const [successUrl, setSuccessUrl] = useState('');
  const [user, setUser] = useState();

  // Initiate all the Widget modules
  const config = configuration();
  const componentEvents = component();
  const journeyEvents = journey();

  useEffect(() => {

    config.set({
      forgerock: {
        serverConfig: {
          baseUrl: 'https://openam-sdks.forgeblocks.com/am/',
          timeout: 3000,
        },
        // Optional but recommended configuration:
        realmPath: 'alpha',
        clientId: 'sdkPublicClient',
        redirectUri: window.location.href,
        scope: 'openid profile email address phone'
      },
      style: {
        logo: {
          dark: 'https://res.cloudinary.com/dmubfrefi/image/private/s--fFydpO-H--/c_crop,h_2813,w_5000,x_0,y_0/c_scale,w_3840/f_auto/q_auto/v1/dee-about-cms-prod-medias/cf68f541-fc92-4373-91cb-086ae0fe2f88/006-nike-logos-jordan-white.jpg?_a=BAAAROBs',
          light: 'https://res.cloudinary.com/dmubfrefi/image/private/s--vWVG1GPn--/c_crop,h_2813,w_5000,x_0,y_0/c_scale,w_640/f_auto/q_auto/v1/dee-about-cms-prod-medias/cf68f541-fc92-4373-91cb-086ae0fe2f88/005-nike-logos-jordan-black.jpg?_a=BAAAROBs',
          height: 200,
          width: 200,
        },
        sections: {
          header: true,
        }
      },
    });

    const widget = new Widget({ target: document.getElementById('widget-root') });

    const journeyEventsUnsub = journeyEvents.subscribe((event) => {
      console.log(event);

      // Test for success event of journey
      if (event.journey.successful) {
        // Grab the successUrl from journey response
        setSuccessUrl(event.journey.response.successUrl);
      }
      // Test for success event of user
      if (event.user.successful) {
        // Save user information, if desired
        setUser(event.user.response);

        // After getting the user data, redirect to successUrl
        componentEvents.close();

        // Use `location.replace` if you don't current URL in history
        // Use `location.assign` if you want to keep this current URL in history
        location.assign(successUrl);
      }
    });

    const url = new URL(location.href);
    const suspendedId = url.searchParams.get('suspendedId');
  
    if (suspendedId) {
      journeyEvents.start({ resumeUrl: location.href });
      componentEvents.open();
    }
  
    return () => {
      widget.$destroy();
      journeyEventsUnsub();
    };
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => {
            journeyEvents.start({
              journey: 'TEST_LoginSuspendEmail'
            });
            componentEvents.open();
          }}>
          Register
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
