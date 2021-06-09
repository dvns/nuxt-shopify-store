<template>
  <div>
    <h1>Cart</h1>
    <div v-show="items.length > 0">
      <ul>
        <li v-for="item in items" :key="item.id">
          <div class="grid grid-cols-4">
            <p>{{ item.title }} {{ item.variant.title }}</p>
            <input
              type="number"
              :value="loading ? tempQty[item.id] : item.quantity"
              min="0"
              :disabled="loading"
              @input="(e) => handleQuantityChange(e, item)"
            />
            <p>{{ item.variant.price }}</p>
            <button :disabled="loading" @click="() => removeItem(item.id)">
              Remove
            </button>
            <p>
              {{ (parseFloat(item.variant.price) * item.quantity).toFixed(2) }}
            </p>
          </div>
        </li>
      </ul>
      <p>{{ checkout.paymentDue }}</p>
      <button :disabled="loading" @click="goToCheckout">Checkout</button>
    </div>
    <div v-show="items.length === 0">
      <p>Cart is empty</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import debounce from 'lodash/debounce'
export default {
  data() {
    return {
      // Store and render this value while component input is sync'ing with vuex
      tempQty: {},
    }
  },
  computed: {
    ...mapState(['loading', 'checkout']),
    items() {
      return this.checkout.lineItems
    },
  },
  methods: {
    ...mapActions(['removeItem', 'updateItemQuantity']),
    goToCheckout() {
      window.open(this.checkout.webUrl)
    },
    handleQuantityChange: debounce(function (e, item) {
      const type = e.target.type
      let value = e.target.value

      if (type === 'number' && value !== '') {
        value = parseInt(value)
      }

      // Store its value, so that it can be rendered as the input value while Vuex is updating
      this.tempQty[item.id] = value

      if (value !== '') {
        this.updateItemQuantity({
          variantId: item.id,
          quantity: value,
        })
      }
    }, 500),
  },
}
</script>

<style></style>
