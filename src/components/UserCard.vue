<script lang="ts" setup>
import IconUser from './IconUser.vue'
import { defineProps } from 'vue'

defineProps({ username: String })
</script>

<template>
  <div>
    <div class="row">
      <IconUser />
      <div class="col">
        <h5>{{ username }}</h5>
        <div class="badge">Веб-дизайнер</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.badge {
  font-size: 0.9rem;
  color: $lavender;
}
.row {
  @include flex-container();
}

.col {
  @include flex-container(column, 0.2rem);
}
</style>
