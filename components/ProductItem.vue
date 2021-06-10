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
      <p class="font-serif tracking-widest text-sm uppercase pt-4 pb-2">
        {{ product.title }}
      </p>
      <p class="text-sm">from {{ lowestPrice }}</p>
    </div>
  </NuxtLink>
</template>

<script>
import formatMoney from '@/lib/formatMoney'
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  computed: {
    lowestPrice() {
      const variantWithLowestPrice = this.product.variants.reduce(
        (prev, current) => {
          const prevPrice = parseFloat(prev.price)
          const currentPrice = parseFloat(current.price)
          if (currentPrice < prevPrice) {
            return current
          } else {
            return prev
          }
        }
      )
      return formatMoney(variantWithLowestPrice.priceV2)
    },
  },
}
</script>
