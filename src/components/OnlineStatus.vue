<script lang="ts" setup>
import { computed, defineProps } from 'vue'
import { formatTime } from '.././util'

interface Props {
  isOnline?: boolean
  timestamp: number
  dateOnly?: boolean
}

const props = defineProps<Props>()

const status = computed(() => {
  if (props.isOnline) return 'онлайн'
  return props.dateOnly
    ? formatTime(props.timestamp)
    : `был(а) онлайн в ${formatTime(props.timestamp)}`
})
</script>

<template>
  <div class="status">{{ status }}</div>
</template>

<style lang="scss" scoped>
.status {
  color: $text-grey;
}
</style>
