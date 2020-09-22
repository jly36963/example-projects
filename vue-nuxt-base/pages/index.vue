<script>
// imports
import PaddedPaper from '../components/padded-paper';
import FlexContainer from '../components/flex-container';

// component
export default {
  components: { PaddedPaper, FlexContainer },
  render: function (h) {
    return (
      <FlexContainer>
        <PaddedPaper>
          <h3>Hello World</h3>
        </PaddedPaper>
      </FlexContainer>
    );
  },
};
</script>

<style>
.index-button {
  @apply inline-block m-2;
}
</style>
