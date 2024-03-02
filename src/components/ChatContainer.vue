<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import ChatItem from './ChatItem.vue'
import { useWebSocketStore } from '.././stores/index'
import TypingIndicator from './TypingIndicator.vue'
import TransitionList from './TransitionList.vue'
import TransitionFade from './TransitionFade.vue'
import { scrollChatDown } from '../util'
import type { Ref } from 'vue'

const { state, sendReadingConfirmation } = useWebSocketStore()
const observer: Ref<IntersectionObserver | null> = ref(null)

watch(
  () => state.activeChat?.interlocutor,
  () => {
    scrollChatDown({ hide: true })
  }
)

watch(
  () => state.activeChat?.messages.length,
  (newLength) => {
    if (
      newLength &&
      newLength > 0 &&
      state.activeChat?.messages[newLength - 1].sender === state.username
    )
      scrollChatDown()
  }
)

onMounted(() => {
  const chatEl = document.querySelector('#chat')

  let options = {
    root: chatEl,
    rootMargin: '0px',
    threshold: 0
  }

  observer.value = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target)
        const { msgid } = (entry.target as HTMLElement).dataset
        const targetMsg = msgid && state.activeChat?.messages.find((msg) => msg.id === +msgid)
        setTimeout(() => {
          if (targetMsg) sendReadingConfirmation({ message: targetMsg })
        }, 2000)
      }
    })
  }, options)
})
</script>

<template>
  <div id="chat" class="chat">
    <TransitionFade>
      <TransitionList :key="state.activeChat?.interlocutor" class="chat-container">
        <ChatItem
          v-for="msg in state.activeChat?.messages"
          :key="msg.sender + msg.id"
          :message="msg"
          :observer="observer"
          :data-msgId="msg.id"
        />
        <div ref="chatAnchorRef" id="scroll-anchor" class="scroll-anchor" />
      </TransitionList>
    </TransitionFade>
  </div>
  <TypingIndicator :chat="state.activeChat" />
</template>

<style lang="scss" scoped>
.chat {
  height: 100%;
  overflow-y: scroll;
  transition: visibility 0.1s;
}

.chat-container {
  @include flex-container(column);
  height: 100%;
}

.scroll-anchor {
  height: 1px;
  margin-top: auto;
}
</style>
