<template>
  <div>
    <Cart />
    <Header />
    <main class="container mx-auto px-4">
      <Nuxt />
    </main>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  watch: {
    $route() {
      this.setShowCart(false)
    },
  },
  methods: {
    ...mapActions(['setShowCart']),
  },
}
</script>

<style lang="postcss">
@layer components {
  .title {
    @apply font-serif tracking-widest text-base text-center uppercase;
  }
}
</style>
