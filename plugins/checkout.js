export default function ({ app, store }) {
  app.router.onReady(async () => {
    if (!store.getters.checkoutId) {
      await store.dispatch('createCheckout')
    }

    // Force a checkout refresh on each page load
    if (store.getters.checkoutId) {
      await store.dispatch('updateCheckout')
      // console.log('# Checkout exists. Updating checkout state.')

      // If checkout is complete, create a new checkout Id
      if (store.getters.isCheckoutComplete) {
        // console.log('# Checkout is complete. Creating a new one.')
        await store.dispatch('createCheckout')
      }
    }
  })
}
