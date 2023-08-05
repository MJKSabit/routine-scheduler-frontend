import React, { Component, Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Spinner from "../app/shared/Spinner";
import { useContext } from "react";
import { UserContext } from "./App";

const Dashboard = lazy(() => import("./dashboard/Dashboard"));
const Teachers = lazy(() => import("./database/Teachers"));
const Sections = lazy(() => import("./database/Sections"));
const Rooms = lazy(() => import("./database/Rooms"));

// const Buttons = lazy(() => import('./basic-ui/Buttons'));
// const Dropdowns = lazy(() => import('./basic-ui/Dropdowns'));
// const Typography = lazy(() => import('./basic-ui/Typography'));

// const BasicElements = lazy(() => import('./form-elements/BasicElements'));

// const BasicTable = lazy(() => import('./tables/BasicTable'));

// const Mdi = lazy(() => import('./icons/Mdi'));

// const ChartJs = lazy(() => import('./charts/ChartJs'));

const Error404 = lazy(() => import("./error-pages/Error404"));
const Error500 = lazy(() => import("./error-pages/Error500"));

const Login = lazy(() => import("./user-pages/Login"));
const ForgetPassword = lazy(() => import("./user-pages/ForgetPassword"));

const BlankPage = lazy(() => import("./general-pages/BlankPage"));

export default function AppRoutes() {
  const { user } = useContext(UserContext);

  return (
    <Suspense fallback={<Spinner />}>
      <Switch>
        {user ? (
          <>
            <Route exact path="/dashboard" component={Dashboard} />
            <Route path="/database/teachers" component={Teachers} />
            <Route path="/database/sections" component={Sections} />
            <Route path="/database/rooms" component={Rooms} />
            <Redirect to="/dashboard" />
          </>
        ) : (
          <>
            <Route path="/auth/login" component={Login} />
            <Route path="/auth/forgot-password" component={ForgetPassword} />
            <Redirect to="/auth/login" />
          </>
        )}

        <Route path="/error-pages/error-404" component={Error404} />
        <Route path="/error-pages/error-500" component={Error500} />

        <Route path="/general-pages/blank-page" component={BlankPage} />
      </Switch>
    </Suspense>
  );
}
