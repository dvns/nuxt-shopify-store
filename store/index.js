export const state = () => ({
  checkout: {},
  loading: true,
})

export const getters = {
  checkoutId(state) {
    return state.checkout.id
  },
}

export const mutations = {
  UPDATE_CHECKOUT(state, checkout) {
    state.checkout = { ...checkout }
  },
  UPDATE_LOADING(state, loading) {
    state.loading = loading
  },
}

export const actions = {
  async createCheckout({ commit, state }) {
    await this.$shopify.checkout.create().then((checkout) => {
      commit('UPDATE_CHECKOUT', checkout)
      commit('UPDATE_LOADING', false)
    })
  },

  async updateCheckout({ commit, state }) {
    await this.$shopify.checkout.fetch(state.checkout.id).then((checkout) => {
      commit('UPDATE_CHECKOUT', checkout)
      commit('UPDATE_LOADING', false)
    })
  },

  async addItem({ commit, state, dispatch }, variantId) {
    const lineItemsToAdd = [
      {
        variantId,
        quantity: 1,
      },
    ]

    commit('UPDATE_LOADING', true)

    if (!state.checkout.id) {
      console.log('# Checkout does not exist! Creating a new one.')
      await dispatch('createCheckout')
    }
    await this.$shopify.checkout
      .addLineItems(state.checkout.id, lineItemsToAdd)
      .then((checkout) => {
        commit('UPDATE_CHECKOUT', checkout)
        commit('UPDATE_LOADING', false)
      })
  },

  async removeItem({ commit, state }, variantId) {
    const lineItemIdsToRemove = [variantId]

    commit('UPDATE_LOADING', true)

    await this.$shopify.checkout
      .removeLineItems(state.checkout.id, lineItemIdsToRemove)
      .then((checkout) => {
        commit('UPDATE_CHECKOUT', checkout)
        commit('UPDATE_LOADING', false)
      })
  },

  async updateItemQuantity({ commit, state }, { variantId, quantity }) {
    const lineItemsToUpdate = [{ id: variantId, quantity }]

    commit('UPDATE_LOADING', true)

    await this.$shopify.checkout
      .updateLineItems(state.checkout.id, lineItemsToUpdate)
      .then((checkout) => {
        commit('UPDATE_CHECKOUT', checkout)
        commit('UPDATE_LOADING', false)
      })
  },
}
