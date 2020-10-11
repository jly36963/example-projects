<template>
  <FlexContainer>
    <PaddedPaper>
      <h3>Hello World</h3>
    </PaddedPaper>
  </FlexContainer>
</template>

<script lang="ts">
// imports
import PaddedPaper from '../components/padded-paper.vue';
import FlexContainer from '../components/flex-container.vue';

// component
export default {
  components: { PaddedPaper, FlexContainer },
};
</script>

<style>
.index-button {
  @apply inline-block m-2;
}
</style>
