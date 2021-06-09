export const state = () => ({
  checkout: {},
})

export const mutations = {
  SET_CHECKOUT_ID(state, checkoutId) {
    state.checkout.id = checkoutId
  },
  UPDATE_CHECKOUT(state, checkout) {
    state.checkout = { ...checkout }
  },
}

export const actions = {
  async createCheckout({ commit, state }) {
    await this.$shopify.checkout.create().then((checkout) => {
      commit('UPDATE_CHECKOUT', checkout)
    })
  },

  async updateCheckout({ commit, state }) {
    await this.$shopify.checkout.fetch(state.checkout.id).then((checkout) => {
      commit('UPDATE_CHECKOUT', checkout)
    })
  },

  async addItem({ commit, state, dispatch }, variantId) {
    const lineItemsToAdd = [
      {
        variantId,
        quantity: 1,
      },
    ]
    if (!state.checkout.id) {
      console.log('# Checkout does not exist! Creating a new one.')
      await dispatch('createCheckout')
    }
    await this.$shopify.checkout
      .addLineItems(state.checkout.id, lineItemsToAdd)
      .then((checkout) => {
        commit('UPDATE_CHECKOUT', checkout)
      })
  },

  async removeItem({ commit, state }, variantId) {
    const lineItemIdsToRemove = [variantId]

    await this.$shopify.checkout
      .removeLineItems(state.checkout.id, lineItemIdsToRemove)
      .then((checkout) => {
        commit('UPDATE_CHECKOUT', checkout)
      })
  },
}

export const getters = {
  checkout(state) {
    return state.checkout
  },
}
