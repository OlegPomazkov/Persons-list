<template>
  <div 
    id="app"
    class="app_wrapper">
      <nav-component/>
      <router-view/>
  </div>
</template>

<script>
import NavComponent from './components/NavComponent'

export default {
  name: 'app',
  components: {
    NavComponent
  },
}
</script>

<style lang="stylus">
.app_wrapper
  font-family sans-serif
  width 700px
  margin-left auto
  margin-right auto
  margin-top 10px
</style>
