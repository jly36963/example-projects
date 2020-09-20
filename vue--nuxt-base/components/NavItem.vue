<script>
import Button from './Button';

export default {
  props: {
    url: { type: String },
    active: { type: Boolean },
    label: { type: String },
    color: {
      type: String,
      default: 'green',
    },
    open: { type: Boolean },
    items: { type: Array },
  },
  components: {
    Button,
  },
  render: function (h) {
    return (
      <div class="nav-item relative" onHover={() => (this.open = !this.open)}>
        <Button color={this.color} href={this.url}>
          {this.label}
        </Button>
      </div>
    );
  },
};

// bg-primary-500 hover:bg-primary-400
</script>

<style>
.nav-item :global(button) {
  border-radius: 0;
}
</style>
