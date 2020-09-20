<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    fullWidth: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: 'medium',
    },
    color: {
      type: String,
      default: 'green',
    },
    text: {
      type: String,
      default: 'white',
    },
    href: { type: String },
    onClick: { type: Function },
  },
  render: function (h) {
    console.log('this', this);

    const slotContent = this.$scopedSlots.default();
    return (
      <div
        class={`btn btn-${
          this.size
        } bg-${`${this.color}-500`} hover:bg-${`${this.color}-600`} text-${this.text}`}
      >
        {this.url ? <a href={this.href}>{slotContent}</a> : <span>{slotContent}</span>}
      </div>
    );
  },
};
</script>

<style>
/*
    bg-green-500 hover:bg-green-600
    bg-red-500 hover:bg-red-600
    bg-blue-500 hover:bg-blue-600
    bg-yellow-500 hover:bg-yellow-600
    bg-orange-500 hover:bg-orange-600
    bg-cyan-500 hover:bg-cyan-600
    bg-teal-500 hover:bg-teal-600
  */
.btn {
  @apply rounded shadow text-center items-center content-center justify-center flex cursor-pointer;
}
.btn-small {
  @apply p-1 text-sm;
}
.btn-medium {
  @apply px-2 py-1;
}
.btn-large {
  @apply px-4 py-2 text-lg;
}
</style>
