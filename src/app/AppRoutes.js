import React, { Component, Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Spinner from "../app/shared/Spinner";
import { useContext } from "react";
import { UserContext } from "./App";

const Dashboard = lazy(() => import("./dashboard/Dashboard"));
const Teachers = lazy(() => import("./database/Teachers"));
const Sections = lazy(() => import("./database/Sections"));
const Rooms = lazy(() => import("./database/Rooms"));
const Courses = lazy(() => import("./database/Courses"));

const TheoryPreference = lazy(() => import("./theory-pref/TheoryPreference"));
const TheorySelect = lazy(() => import("./forms/TheorySelect"));
const TheoryScheduleForm = lazy(() => import("./forms/TheorySchedule"));

const TheorySchedule = lazy(() => import("./theory-schedule/AskForSchedule"));
const FixedSchedule = lazy(() => import("./theory-schedule/FixedSchedule"));

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
        <Route exact path="/form/theory-pref/:id" component={TheorySelect} />
        <Route exact path="/form/theory-sched/:id" component={TheoryScheduleForm} />
        {user.loggedIn ? (
          <Switch>
            <Route exact path="/dashboard" component={Dashboard} />
            <Route path="/database/teachers" component={Teachers} />
            <Route path="/database/sections" component={Sections} />
            <Route path="/database/rooms" component={Rooms} />
            <Route path="/database/courses" component={Courses} />
            <Route path="/theory-assign" component={TheoryPreference} />
            <Route path="/theory-schedule/ask" component={TheorySchedule} />
            <Route path="/theory-schedule/fixed" component={FixedSchedule} />
            <Redirect to="/dashboard" />
          </Switch>
        ) : (
          <Switch>
            <Route path="/auth/login" component={Login} />
            <Route path="/auth/forgot-password" component={ForgetPassword} />
            <Redirect to="/auth/login" />
          </Switch>
        )}
      </Switch>
    </Suspense>
  );
}
