import auth from '../auth';
module.exports = function requireAuth(nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/',
      state: {
        nextPathname: nextState.location.pathname,
      },
    });
    alert('请登录');
  }
};
