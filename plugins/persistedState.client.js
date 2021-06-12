import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    key: 'vCheckout',
    paths: ['checkout'],
  })(store)
}
