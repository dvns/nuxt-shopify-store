<template>
  <div class="w-full h-screen fixed z-50 pointer-events-none">
    <!-- Overlay -->
    <transition name="fade">
      <div
        v-show="showCart"
        class="w-full h-full bg-gray-800 bg-opacity-75 pointer-events-auto"
        @click="setShowCart(false)"
      ></div>
    </transition>

    <!-- Cart -->
    <transition name="slide">
      <div
        v-show="showCart"
        class="
          w-full
          md:w-8/12
          lg:w-6/12
          xl:w-5/12 xl:max-w-xl
          h-auto
          max-h-screen
          md:h-screen
          bg-white
          px-4
          transform
          transition-transform
          absolute
          md:right-0
          bottom-0
          overflow-y-auto
          transform-translate-y
          md:transform-translate-x
          pointer-events-auto
        "
      >
        <div class="max-w-xl mx-auto px-4">
          <header
            class="sticky top-0 bg-white z-10 py-8 border-b border-gray-200"
          >
            <h1 class="title">Your Cart</h1>
            <button
              class="w-6 absolute right-0 top-1/2 transform -translate-y-1/2"
              @click="setShowCart(false)"
            >
              <v-icon name="x" aria-label="Close Cart" />
            </button>
          </header>
          <div v-show="cartCount > 0" class="py-8">
            <form @submit.prevent>
              <fieldset :aria-busy="isLoading" :disabled="isLoading">
                <ul>
                  <li v-for="item in items" :key="item.id">
                    <div class="grid grid-cols-12 mb-8 gap-4">
                      <div class="col-span-3 sm:col-span-2">
                        <div class="aspect-w-2 aspect-h-2">
                          <img
                            :src="item.variant.image.src"
                            :alt="item.variant.image.altText"
                            class="object-cover"
                          />
                        </div>
                      </div>
                      <div
                        class="
                          col-span-6
                          sm:col-span-7
                          flex flex-col
                          justify-between
                        "
                      >
                        <div>
                          <button
                            type="button"
                            class="text-sm underline"
                            @click="
                              () => {
                                if (
                                  $route.params.handle ===
                                  item.variant.product.handle
                                ) {
                                  setShowCart(false)
                                } else {
                                  $router.push({
                                    name: 'prints-handle',
                                    params: {
                                      handle: item.variant.product.handle,
                                    },
                                  })
                                }
                              }
                            "
                          >
                            {{ item.title }}
                          </button>
                          <p class="text-sm text-gray-600">
                            {{ item.variant.title }}
                          </p>
                        </div>
                        <div class="flex content-center">
                          <vue-number-input
                            :min="0"
                            center
                            controls
                            size="small"
                            :value="item.quantity"
                            @change="
                              (newVal, oldVal) =>
                                handleChange(newVal, oldVal, item)
                            "
                            @input="(e) => handleInput(e, item)"
                            @keypress="isNumber($event)"
                          />
                          <button
                            type="button"
                            :disabled="loading"
                            class="text-xs underline"
                            @click="() => removeItem(item.id)"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div class="col-span-3 flex justify-end">
                        <p class="text-lg text-right my-auto">
                          {{
                            checkout.paymentDueV2 &&
                            formatMoney({
                              ...checkout.paymentDueV2,
                              amount: (
                                parseFloat(item.variant.price) * item.quantity
                              ).toFixed(2),
                            })
                          }}
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </fieldset>
            </form>
          </div>
          <div v-show="cartCount === 0">
            <img
              src="~/assets/images/graphic_empty_boxes.svg"
              class="cart-empty-img"
            />
            <p class="text-lg text-center mx-auto mb-4">Your cart is empty!</p>
          </div>
          <footer
            class="
              sticky
              bottom-0
              w-full
              left-0
              py-4
              bg-white
              border-t border-gray-200
              z-10
            "
          >
            <div
              v-show="cartCount > 0"
              class="flex justify-between pb-2 duration-300"
              :class="{ 'opacity-50': isLoading }"
            >
              <div>
                <p class="text-2xl">Total</p>
                <p class="text-xs text-gray-600">
                  Not including taxes and shipping fees
                </p>
              </div>
              <p class="text-2xl text-right">
                {{
                  checkout.paymentDueV2 && formatMoney(checkout.paymentDueV2)
                }}
              </p>
            </div>

            <cta-button
              v-show="cartCount > 0"
              :disabled="isLoading"
              class="my-2 duration-300"
              :class="{ 'opacity-50': isLoading }"
              @click.native="goToCheckout"
            >
              Checkout
            </cta-button>
            <cta-button
              v-show="cartCount > 0"
              :disabled="loading"
              class="my-2 invert"
              @click.native="setShowCart(false)"
            >
              Continue Shopping
            </cta-button>
            <cta-button
              v-show="cartCount === 0"
              :disabled="loading"
              class="my-2"
              @click.native="
                () => {
                  if ($route.name === 'prints' || $route.name === 'index') {
                    setShowCart(false)
                  } else {
                    $router.push('/')
                  }
                }
              "
              >Shop for Prints</cta-button
            >
          </footer>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import formatMoney from '@/lib/formatMoney'
import { mapActions, mapState, mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import VueNumberInput from '@chenfengyuan/vue-number-input'
export default {
  components: {
    VueNumberInput,
  },
  data() {
    return {
      preventUpdate: false,
    }
  },
  computed: {
    ...mapState(['loading', 'removing', 'adding', 'checkout', 'showCart']),
    ...mapGetters(['cartCount']),
    items() {
      return this.checkout.lineItems
    },
    isLoading() {
      return this.loading || this.adding || this.removing
    },
  },
  methods: {
    ...mapActions(['removeItem', 'updateItemQuantity', 'setShowCart']),
    formatMoney,
    goToCheckout() {
      window.location.href = this.checkout.webUrl
    },
    isNumber(e) {
      // Validate that input is a number
      if (!/^[0-9]+$/.test(e.key) || e.key === '.') return e.preventDefault()
    },
    handleInput: debounce(function (e, item) {
      let value = e.target.value
      if (value === '') return
      if (typeof value === 'string') {
        value = parseInt(value)
      }

      if (typeof value === 'number') {
        this.updateItemQuantity({
          variantId: item.id,
          quantity: value,
        })
        this.preventUpdate = true
      }
    }, 500),
    handleChange: debounce(function (newVal, oldVal, item) {
      if (newVal === oldVal || isNaN(oldVal)) return
      if (this.preventUpdate) {
        // Vuex is already updated via @input event, so don't update state again on change
        this.preventUpdate = false
      } else {
        this.updateItemQuantity({
          variantId: item.id,
          quantity: newVal,
        })
      }
    }, 500),
  },
}
</script>

<style lang="postcss" scoped>
.fade-enter-active,
.fade-leave-active {
  @apply duration-300;
}
.fade-enter,
.fade-leave-to {
  @apply bg-opacity-0;
}

.slide-enter-active,
.slide-leave-active {
  @apply duration-300;
}
.slide-enter,
.slide-leave-to {
  @apply translate-y-full;

  @screen md {
    @apply translate-x-full translate-y-0;
  }
}

.number-input {
  @apply w-24 flex-shrink-0 mr-4;
}

.number-input__input {
  @apply text-xs !important;
}

.number-input__button:hover::before,
.number-input__button:hover::after {
  @apply bg-black !important;
}

.number-input__button::before {
  width: 35% !important;
}
.number-input__button::after {
  height: 40% !important;
}

.cart-empty-img {
  @apply opacity-50 max-w-md mx-auto;
  filter: grayscale(100%);
}

fieldset {
  @apply duration-300;
}
fieldset:disabled {
  @apply opacity-50 pointer-events-none;
}
</style>
