<script lang="ts" setup>
import { defineProps, computed, onMounted, ref } from 'vue'
import MessageStatus from './MessageStatus.vue'
import { useWebSocketStore } from '.././stores/index'
import { formatTime } from '.././util'
import type { Ref } from 'vue'
import type { Message } from '.././stores/index.ts'

interface Props {
  message: Message
  observer: IntersectionObserver | null
}

const props = defineProps<Props>()

const { state } = useWebSocketStore()

const elRef: Ref<Element | null> = ref(null)

const time = computed(() => formatTime(props.message.timestamp))

const text = computed(() => props.message.text.replace(/(?:\s*\n){3,}/g, '\n\n'))

const className = computed(() => {
  let classes = ['msg']
  classes.push(props.message.sender === state.username ? 'msg-sent' : 'msg-received')
  if (props.message.sender !== state.username && !props.message.hasBeenRead)
    classes.push('msg-unread')
  return classes.join(' ')
})

onMounted(() => {
  if (props.message.sender !== state.username && !props.message.hasBeenRead && elRef.value) {
    props.observer?.observe(elRef.value)
  }
})
</script>

<template>
  <div ref="elRef" :class="className">
    <div class="text">{{ text }}</div>
    <MessageStatus v-if="props.message.sender === state.username" :message="props.message" />
    <div class="time">{{ time }}</div>
  </div>
</template>

<style lang="scss" scoped>
.msg {
  @include flex-container();
  @include rounded();
  padding: 1rem;
  width: fit-content;
  max-width: 80%;
  overflow-wrap: break-word;
  white-space: pre-line;
}
.msg-sent {
  background-color: $secondary-lavender;
  margin-left: auto;
}

.msg-received {
  background-color: $grey;
  margin-right: auto;
}

.msg-unread {
  background-color: $secondary-lime;
}

.text {
  max-width: 87%;
  overflow-wrap: break-word;
}

.time {
  @include text(0.7rem, $text-grey);
  margin-top: auto;
}
</style>
