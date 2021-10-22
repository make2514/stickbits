/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import SingleHabitView from 'containers/SingleHabitView/Loadable';
import SingleHabitDailyView from 'containers/SingleHabitDailyView/Loadable';
import LoginPage from 'containers/Login/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

import GlobalStyle from '../../global-styles';

export default function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={LoginPage} />
        <Route
          path="/singlehabitview/:habitId/:date"
          component={SingleHabitDailyView}
        />
        <Route path="/singlehabitview/:habitId" component={SingleHabitView} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </div>
  );
}
