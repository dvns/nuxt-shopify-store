import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: 'vCheckout',
      paths: ['checkout'],
    })(store)
  })
}
