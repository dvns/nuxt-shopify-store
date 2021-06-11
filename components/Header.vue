<template>
  <header class="container mx-auto p-4 relative flex justify-between">
    <h1 class="font-serif tracking-widest text-sm">DAVIN SUEN PHOTO</h1>
    <button class="w-6 relative" @click="setShowCart(!showCart)">
      <v-icon name="shopping-bag" aria-label="Open Cart" />
      <div
        v-show="cartCount !== 0"
        class="
          w-5
          h-5
          absolute
          top-1/2
          right-1/2
          rounded-full
          bg-black
          text-white text-center
          flex
          items-center
          justify-center
          text-xs
          font-medium
        "
      >
        {{ cartCount }}
      </div>
    </button>
  </header>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState(['showCart']),
    ...mapGetters(['cartCount']),
  },
  methods: {
    ...mapActions(['setShowCart']),
  },
}
</script>
