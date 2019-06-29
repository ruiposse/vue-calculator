<template>
  <div class="main-wrapper">
    <calculator />
  </div>
</template>

<script>
import Calculator from '~/components/Calc'

export default {
  components: {
    Calculator
  }
}
</script>

<style>
.main-wrapper {
  font-family: 'Helvetica Neue', Helvetica, sans-serif;
  font-size: 1.5rem;
  font-weight: lighter;
  color: #fff;
}
</style>

