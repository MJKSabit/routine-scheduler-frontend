import React, { Component, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import './App.scss';
import AppRoutes from './AppRoutes';
import Navbar from './shared/Navbar';
import Sidebar from './shared/Sidebar';
import SettingsPanel from './shared/SettingsPanel';
import Footer from './shared/Footer';

import logo from './logo.svg';
import './App.css';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

function App(props) {
  const location = useLocation();
  const [isFullPageLayout, setIsFullPageLayout] = useState(false);

  useEffect(() => {
    onRouteChanged(location);
  }, []);

  useEffect(() => {
    onRouteChanged(location);
  }, [location]);

  function onRouteChanged(location) {
    console.log("ROUTE CHANGED");
    window.scrollTo(0, 0);
    const fullPageLayoutRoutes = [
      '/user-pages/login-1',
      '/user-pages/register-1',
      '/user-pages/lockscreen',
      '/error-pages/error-404',
      '/error-pages/error-500',
      '/general-pages/landing-page',
    ];
    const isFullPageLayout = fullPageLayoutRoutes.includes(location.pathname);
    console.log("isFullPageLayout: ", isFullPageLayout);
    setIsFullPageLayout(isFullPageLayout);

    if (isFullPageLayout) {
      document.querySelector('.page-body-wrapper').classList.add('full-page-wrapper');
    } else {
      document.querySelector('.page-body-wrapper').classList.remove('full-page-wrapper');
    }

  }

  let navbarComponent = !isFullPageLayout ? <Navbar /> : '';
  let sidebarComponent = !isFullPageLayout ? <Sidebar /> : '';
  let SettingsPanelComponent = !isFullPageLayout ? <SettingsPanel /> : '';
  let footerComponent = !isFullPageLayout ? <Footer /> : '';

  return (
    <div className="container-scroller">
      {navbarComponent}
      <div className={"container-fluid page-body-wrapper"}>
        {sidebarComponent}
        <div className="main-panel">
          <div className="content-wrapper">
            <AppRoutes />
            {SettingsPanelComponent}
          </div>
          {footerComponent}
        </div>
      </div>
    </div>
  );
}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default withRouter(App);
