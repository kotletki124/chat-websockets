<script lang="ts" setup>
import { defineProps, computed } from 'vue'
import IconCheckMark from './IconCheckMark.vue'
import type { Message } from '.././stores/index.ts'

interface Props {
  message: Message
}

const props = defineProps<Props>()

const statusSentClassName = computed(() => (props.message.hasBeenSent ? 'icon-success' : 'icon'))
const statusReadClassName = computed(
  () => `status-read ${props.message.hasBeenRead ? 'icon-success' : 'icon'}`
)
</script>

<template>
  <div class="status">
    <div :class="statusSentClassName"><IconCheckMark /></div>
    <div :class="statusReadClassName"><IconCheckMark /></div>
  </div>
</template>

<style lang="scss" scoped>
.status {
  @include flex-container(row, -0.5rem);
  margin-top: auto;
  .status-read {
    margin-left: -0.4rem;
  }
}

.icon {
  @include icon(0.7rem, transparent);
  margin-bottom: 0.75rem;
}

.icon-success {
  @include icon(0.7rem, $text-grey);
  margin-bottom: 0.75rem;
}
</style>
