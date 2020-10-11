<template>
  <div>
    <div class="flex-container">
      <div class="flex-container-main">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'FlexContainer',
};
</script>

<style scoped>
.flex-container {
  @apply flex content-center justify-center m-auto p-4 h-screen w-full;
}
.flex-container-main {
  @apply p-2 text-center m-auto;
}
</style>
