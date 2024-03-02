<script lang="ts" setup>
import LeftSide from './components/LeftSide.vue'
import RightSide from './components/RightSide.vue'
import { useWebSocketStore } from './stores/index'

const { connect } = useWebSocketStore()

let username = sessionStorage.getItem('username')
while (!username) username = prompt('Введите свое имя:')
connect(username)
</script>

<template>
  <div class="root">
    <LeftSide />
    <RightSide />
  </div>
</template>

<style lang="scss" scoped>
.root {
  @include flex-container(row, 2rem, center, center);
  width: 1440px;
  margin: auto;
}
</style>
