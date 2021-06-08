<template>
  <NuxtLink :to="`prints/${product.handle}`">
    <div class="aspect-w-1 aspect-h-1">
      <img
        :src="product.images[0].src"
        :alt="product.description"
        class="object-contain"
      />
    </div>
    <div class="text-center py-4">
      <p>{{ product.title }}</p>
      <p>from $$$</p>
    </div>
  </NuxtLink>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style></style>
