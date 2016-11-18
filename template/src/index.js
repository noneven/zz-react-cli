import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';

import './stubs/COURSES';
import './index.less';
import './logo.svg';
const rootRoute = {
  childRoutes: [{
    path: '/',
    component: require('./components/Home'),
    childRoutes: [
      require('./components/Calendar'),
      require('./components/Course'),
      require('./components/Grades'),
      require('./components/Messages'),
      require('./components/Profile'),
    ],
  }],
};
render((
  <Router
    history={browserHistory}
    routes={rootRoute}
  />
), document.getElementById('app'));
