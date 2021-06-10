<template>
  <div>
    <h1 class="page-title">Prints</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="product in products" :key="product.id">
        <ProductItem :product="product" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $shopify }) {
    const products = await $shopify.product.fetchAll()
    return { products }
  },
}
</script>
