<script>
export default {
  name: 'FlexContainer',
  render: function (h) {
    return (
      <div class="flex-container">
        <div class="flex-container-main">{this.$slots.default}</div>
      </div>
    );
  },
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
