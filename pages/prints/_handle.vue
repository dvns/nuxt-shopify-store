<template>
  <div class="container mx-auto px-4">
    <h1 class="title my-12">{{ product.title }}</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="aspect-w-1 aspect-h-1 mb-8">
        <img
          :src="product.images[0].src"
          :alt="product.description"
          class="object-contain"
        />
      </div>
      <div>
        <form class="mx-auto sm:max-w-sm pt-0 pb-4 sm:px-4">
          <p class="pb-2">Print options:</p>
          <fieldset class="pb-4" :disabled="loading" :aria-busy="loading">
            <v-select
              v-model="selected"
              :options="product.variants"
              label="title"
              :searchable="false"
              :clearable="false"
              class="product-select"
              :components="{ OpenIndicator }"
            />
          </fieldset>

          <div class="py-8">
            <p class="text-xl font-medium">
              {{ formatMoney(selected.priceV2) }}
            </p>
            <p class="text-xs text-gray-600">
              Not including taxes and shipping fees
            </p>
          </div>
          <fieldset :disabled="loading" :aria-busy="loading">
            <cta-button
              type="button"
              :disabled="!selected.available || loading"
              :class="!selected.available ? 'oos-button' : ''"
              class="mb-4"
              @click.native="
                () => {
                  addItem(selected.id).then(() => {
                    setShowCart(true)
                  })
                }
              "
            >
              {{ selected.available ? 'Add to Cart' : 'Out of stock' }}
            </cta-button>
            <cta-button
              v-show="cartCount > 0"
              type="button"
              class="invert"
              @click.native="setShowCart(true)"
              >View Cart</cta-button
            >
          </fieldset>
        </form>
      </div>
    </div>
    <div class="mx-auto text-center py-8 mb-4">
      <NuxtLink to="/prints" class="underline text-center"
        >Back to Prints</NuxtLink
      >
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
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
  data() {
    return {
      OpenIndicator: {
        render: () => <v-icon name="chevron-down" class="w-5" />,
      },
    }
  },
  computed: {
    ...mapState(['loading']),
    ...mapGetters(['cartCount']),
  },
  methods: {
    formatMoney,
    ...mapActions(['addItem', 'setShowCart']),
  },
}
</script>

<style lang="postcss" scoped>
::v-deep .product-select .vs__dropdown-toggle,
::v-deep .product-select .vs__dropdown-menu {
  @apply rounded-none border-black text-sm;
}

::v-deep .product-select .vs__fade-enter-active,
.vs__fade-leave-active {
  transition: none;
}

::v-deep .product-select .vs__open-indicator {
  fill: none;
}

.oos-button {
  @apply border-gray-200 text-gray-600 bg-gray-200 !important;
}
</style>
