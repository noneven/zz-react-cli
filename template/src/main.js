import React from 'react';
import { render } from 'react-dom';
import { Router, hashHistory } from 'react-router';

import './main.less';
const rootRoute = {
  path: '/',
  component: require('./components/Home/Home').default,
  childRoutes: [{
    path: 'grades',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('./components/Grades/Grades').default)
      })
    }
  },{
    path: 'messages',
    name: 'messages',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('./components/Messages/Messages').default)
      })
    },
    onEnter(nextState, replace) {
      requireAuth(nextState, replace)
    }
  },{
    path: 'profile',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('./components/Profile/Profile').default)
      })
    },
    childRoutes: [{
      path: 'a',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('./components/Profile/A/A').default)
        })
      }
    },{
      path: 'b',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('./components/Profile/B/B').default)
        })
      }
    }]
  }]
}

render((
  <Router
    history={hashHistory}
    routes={rootRoute}
  />
), document.getElementById('app'));
