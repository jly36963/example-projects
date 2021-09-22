<template>
  <div>
    <h1>Home</h1>
    <p>Count: {{ count }}</p>
    <p>Doubled: {{ doubledCount }}</p>
    <p>Quadrupled: {{ quadrupledCount }}</p>
    <p>
      <button @click="incrementCount">+</button>
      <button @click="decrementCount">-</button>
    </p>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'

  export default {
    computed: {
      ...mapState({ 
        count: (state) => state.countStore.count 
      }),
      ...mapGetters({ 
        doubledCount: 'countStore/doubledCount', 
        quadrupledCount: 'countStore/quadrupledCount' 
      }),
    },
    methods: {
      ...mapActions({
        setCount: 'countStore/setCount' 
      }),
      // local methods
      incrementCount: function() {
        this.setCount(this.count + 1)
      },
      decrementCount: function() {
        this.setCount(this.count - 1)
      },
    }
  }
</script>