import requireAuth from '../requireAuth'
module.exports = {
    path: 'messages',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('./Messages'))
        })
    },
    onEnter(nextState, replace) {
        requireAuth(nextState, replace)
    }
}
