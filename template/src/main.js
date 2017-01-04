import React from 'react';
import { render } from 'react-dom';
import { Router, hashHistory } from 'react-router';
import './main.less';

const rootRoute = {
  path: '/',
  component: require('./components/Home/Home').default,
  childRoutes: [{
    path: 'profile',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('./components/Profile/Profile').default)
      }, 'profile')
    },
    childRoutes: [{
      path: 'a',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('./components/Profile/A/A').default)
        }, 'profileA')
      }
    },{
      path: 'b',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('./components/Profile/B/B').default)
        }, 'profileB')
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
