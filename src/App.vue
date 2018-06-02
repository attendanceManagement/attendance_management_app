<template>
  <div id="app">
    <v-app>
     <router-view/>
  </v-app>    
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

</style>
<style lang="scss">
  @import "./assets/styles";
    body {
   /* background: url('./assets/images/background.jpg') no-repeat center center fixed;*/
    &:after {
      content: '';
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: .3;
      z-index: -1;
    }
  }
</style>
