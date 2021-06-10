<template>
  <div class="container mx-auto px-4">
    <NuxtLink to="/prints">Back to Prints</NuxtLink>
    <h1 class="page-title">{{ product.title }}</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="aspect-w-1 aspect-h-1 mb-8">
        <img
          :src="product.images[0].src"
          :alt="product.description"
          class="object-contain"
        />
      </div>
      <div>
        <form action="" class="mx-auto sm:max-w-sm p-4 pt-0">
          <p class="pb-2">Print options:</p>
          <div class="pb-4">
            <v-select
              v-model="selected"
              :options="product.variants"
              label="title"
              :searchable="false"
              :clearable="false"
            />
          </div>

          <div class="py-8">
            <p class="text-xl font-medium">
              {{ formatMoney(selected.priceV2) }}
            </p>
            <p class="text-xs text-gray-600">
              Not including taxes and shipping fees
            </p>
          </div>
          <cta-button
            :disabled="!selected.available || loading"
            @click.native="() => addItem(selected.id)"
          >
            {{ selected.available ? 'Add to Cart' : 'Out of stock' }}
          </cta-button>
        </form>
      </div>
    </div>
    <!-- <Cart /> -->
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import formatMoney from '@/lib/formatMoney'

export default {
  components: {
    vSelect,
  },
  async asyncData({ params, $shopify }) {
    const product = await $shopify.product.fetchByHandle(params.handle)
    return { product, selected: product.variants[0] }
  },
  computed: {
    ...mapState(['loading']),
  },
  methods: {
    formatMoney,
    ...mapActions(['addItem']),
  },
}
</script>
