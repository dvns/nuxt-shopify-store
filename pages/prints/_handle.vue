<template>
  <div>
    <h1>Product page</h1>
    <h2>{{ product.title }}</h2>
    <img :src="product.images[0].src" :alt="product.description" width="200" />
  </div>
</template>

<script>
export default {
  async asyncData({ params, $shopify }) {
    const product = await $shopify.product.fetchByHandle(params.handle)
    return { product }
  },
  data() {
    return {}
  },
}
</script>
