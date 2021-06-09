export default async function ({ store }) {
  if (!process.server) {
    if (!store.getters.checkoutId) {
      await store.dispatch('createCheckout')
    }

    // Force a checkout refresh on each page load
    if (store.getters.checkoutId) {
      await store.dispatch('updateCheckout')

      // // If checkout is complete, create a new checkout Id
      // if (app.store.getters['checkout/isCheckoutComplete']) {
      //   await app.store.dispatch('checkout/createCheckout')
      // }
    }
  }
}
