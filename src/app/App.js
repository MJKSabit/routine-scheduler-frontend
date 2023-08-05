import axios from "axios";
import { useEffect, useState, createContext } from "react";
import { withRouter } from "react-router-dom";
import "./App.scss";
import AppRoutes from "./AppRoutes";
import Navbar from "./shared/Navbar";
import Sidebar from "./shared/Sidebar";
import SettingsPanel from "./shared/SettingsPanel";
import Footer from "./shared/Footer";
import "./App.css";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { FORBIDDEN, UNAUTHORIZED } from "./api";
import { Toaster } from "react-hot-toast";

export const UserContext = createContext({user: undefined, setUser: u => {}});
export const UserProvider = UserContext.Provider;

function App(props) {
  const location = useLocation();
  const [isFullPageLayout, setIsFullPageLayout] = useState(false);

  const [user, setUser] = useState({loggedIn: Boolean(localStorage.getItem("token"))});

  console.log("user: ", user);

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log(error);
      const status = error.response.status;

      if (status === UNAUTHORIZED || status === FORBIDDEN) {
        localStorage.removeItem("token");
        setUser({loggedIn: false});
        return Promise.reject(error);
      } else {
        const message = error.response.message || "Something went wrong...";
        Toaster.error(message);
        return Promise.reject(error);
      }
    }
  );

  useEffect(() => {
    onRouteChanged(location);
  }, [location]);

  function onRouteChanged(location) {
    window.scrollTo(0, 0);
    const fullPageLayoutRoutes = [
      "/auth/login",
      "/auth/forgot-password",
      "/user-pages/login-1",
      "/user-pages/register-1",
      "/user-pages/lockscreen",
      "/error-pages/error-404",
      "/error-pages/error-500",
      "/general-pages/landing-page",
    ];
    const isFullPageLayout = fullPageLayoutRoutes.includes(location.pathname);
    console.log("isFullPageLayout: ", isFullPageLayout);
    setIsFullPageLayout(isFullPageLayout);

    if (isFullPageLayout) {
      document
        .querySelector(".page-body-wrapper")
        .classList.add("full-page-wrapper");
    } else {
      document
        .querySelector(".page-body-wrapper")
        .classList.remove("full-page-wrapper");
    }
  }

  let navbarComponent = !isFullPageLayout ? <Navbar /> : "";
  let sidebarComponent = !isFullPageLayout ? <Sidebar /> : "";
  let SettingsPanelComponent = !isFullPageLayout ? <SettingsPanel /> : "";
  let footerComponent = !isFullPageLayout ? <Footer /> : "";

  return (
    <UserProvider value={{ user: user, setUser }}>
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
    </UserProvider>
  );
}

export default withRouter(App);
