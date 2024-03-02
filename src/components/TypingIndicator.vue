<script lang="ts" setup>
import { PulseLoader } from 'vue3-spinner'
import { defineProps, computed } from 'vue'
import type { Chat } from '.././stores/index.ts'

interface Props {
  chat: Chat | null
}

const props = defineProps<Props>()

const className = computed(() => `typing-indicator ${props.chat?.isTyping ? '' : 'hidden'}`)
</script>

<template>
  <div :class="className">
    <div class="text">{{ `${chat?.interlocutor} печатает` }}</div>
    <PulseLoader size="2px" color="#aeb3be" />
  </div>
</template>

<style lang="scss" scoped>
.typing-indicator {
  @include flex-container(row, 0.1rem, center, center);
  text-align: center;
}

.text {
  @include text(0.7rem, $text-grey);
}
</style>
