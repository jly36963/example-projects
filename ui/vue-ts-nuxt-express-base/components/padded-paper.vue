<template>
  <div>
    <div class="paper">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PaddedPaper',
};
</script>

<style scoped>
.paper {
  @apply p-4 bg-white rounded shadow-lg;
}
</style>
