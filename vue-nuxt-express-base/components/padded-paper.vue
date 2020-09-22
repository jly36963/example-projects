<script>
export default {
  name: 'PaddedPaper',
  render: function (h) {
    return <div class="paper">{this.$slots.default}</div>;
  },
};
</script>

<style scoped>
.paper {
  @apply p-4 bg-white rounded shadow-lg;
}
</style>
