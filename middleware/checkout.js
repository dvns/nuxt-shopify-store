export default async function ({ store }) {
  if (!process.server) {
    if (!store.getters.checkout?.id) {
      await store.dispatch('createCheckout')
    }
  }
}
