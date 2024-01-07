<template>
  <p><router-link to="/">Index</router-link></p>
  <p><router-link to="/home">Home</router-link></p>
  <p><router-link to="/about">About</router-link></p>
  <router-view />
</template>

<script>
  export default {
    name: 'App'
  };
</script>
