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
        <div class="max-w-xl mx-auto sm:px-4">
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
                    <div
                      class="grid grid-cols-12 mb-8 gap-2 sm:gap-4 items-center"
                    >
                      <!-- Qty & Image -->
                      <div class="col-span-3 flex items-center">
                        <div class="mr-2 sm:mr-4">
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
                        </div>

                        <div class="flex-grow">
                          <div class="aspect-w-2 aspect-h-2 w-full">
                            <nuxt-img
                              provider="imagekit"
                              :src="imgSrc(item.variant.image.src)"
                              :alt="item.variant.image.altText"
                              sizes="sm:125px"
                              class="object-cover"
                            />
                          </div>
                        </div>
                      </div>
                      <!-- Title -->
                      <div class="col-span-5">
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
                      <div
                        class="
                          col-span-1
                          sm:col-span-2
                          flex
                          justify-end
                          items-center
                        "
                      >
                        <button
                          type="button"
                          :disabled="loading"
                          class="w-5 text-gray-600 text-center"
                          @click="() => removeItem(item.id)"
                        >
                          <v-icon name="trash-2" aria-label="Remove Item" />
                        </button>
                      </div>
                      <div class="col-span-3 sm:col-span-2 flex justify-end">
                        <p class="text-base text-right my-auto">
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
import { mapActions, mapState, mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import VueNumberInput from '@chenfengyuan/vue-number-input'
import formatMoney from '@/lib/formatMoney'
import imgSrc from '@/lib/imgSrc'

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
    imgSrc,
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
  @apply w-6 flex flex-col-reverse items-center overflow-visible !important;
}

::v-deep .number-input__input {
  @apply text-xs w-full min-w-full h-6 p-0 rounded-none border-0 border-transparent bg-gray-200 !important;
}

::v-deep .number-input__input:focus {
  @apply border-black border !important;
  box-shadow: none !important;
}

::v-deep .number-input__button {
  @apply relative w-full inset-auto h-6 rounded-none border-0 !important;
}

::v-deep .number-input__button::before {
  @apply inline-block
    w-2
    h-2
    absolute
    inset-auto
    bottom-0
    my-1
    transform
    -rotate-45 
    -translate-x-1/2
    origin-center
    border-solid
    border-t
    border-r
    border-b-0
    border-l-0
    border-black
    bg-transparent
    !important;
  content: '' !important;
}

::v-deep .number-input__button--minus::before {
  @apply rotate-135 top-0 !important;
}

::v-deep .number-input__button::after {
  @apply hidden;
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
