<template>
  <div class="container mx-auto px-4">
    <h1>{{ product.title }}</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="aspect-w-1 aspect-h-1">
        <img
          :src="product.images[0].src"
          :alt="product.description"
          class="object-contain"
        />
      </div>
      <div>
        <p>{{ product.description }}</p>
        <p>Print options:</p>
        <v-select
          v-model="selected"
          :options="product.variants"
          label="title"
          :searchable="false"
          :clearable="false"
        ></v-select>
        <!-- <ul>
          <li v-for="variant in product.variants" :key="variant.id">
            {{ variant.title }} - {{ formatMoney(variant.priceV2) }}
          </li>
        </ul> -->
        <p>{{ formatMoney(selected.priceV2) }}</p>
        <button :disabled="selected.available">
          {{ selected.available ? 'Add to Cart' : 'Out of stock' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import formatMoney from '../../lib/formatMoney'

export default {
  components: {
    vSelect,
  },
  async asyncData({ params, $shopify }) {
    const product = await $shopify.product.fetchByHandle(params.handle)
    return { product, selected: product.variants[0] }
  },
  data() {
    return {}
  },
  methods: {
    formatMoney,
  },
}
</script>
