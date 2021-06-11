<template>
  <button class="cta-button" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="postcss" scoped>
.cta-button {
  @apply text-center
      w-full
      bg-black
      text-white
      p-4
      border border-solid border-black;

  &:disabled {
    @apply cursor-auto;
  }
}

.cta-button.invert {
  @apply bg-white text-black border border-black;
}
</style>
