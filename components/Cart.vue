<template>
  <div>
    <h1>Cart</h1>
    <ul>
      <li v-for="item in items" :key="item.id">
        <div class="grid grid-cols-4">
          <p>{{ item.title }} {{ item.variant.title }}</p>
          <p>Quantity: {{ item.quantity }}</p>
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
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['loading', 'checkout']),
    items() {
      return this.checkout.lineItems
    },
  },
  methods: {
    ...mapActions(['removeItem']),
    goToCheckout() {
      window.open(this.checkout.webUrl)
    },
  },
}
</script>

<style></style>
