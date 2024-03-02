<script lang="ts" setup>
import ChatListItem from './ChatListItem.vue'
import InputSearch from './InputSearch.vue'
import TransitionList from './TransitionList.vue'
import { useWebSocketStore } from '.././stores/index'
import { computed } from 'vue'
import type { Chat } from '.././stores/index'

const { state } = useWebSocketStore()

const getLastMsg = (chat: Chat) => chat.messages[chat.messages.length - 1]

const sortDateDesc = (a: Chat, b: Chat) => getLastMsg(b).timestamp - getLastMsg(a).timestamp

const chats = computed(() => state.chats.slice().sort(sortDateDesc))
</script>

<template>
  <div class="container">
    <InputSearch placeholder="Поиск" />
    <div class="scroll">
      <TransitionList class="list">
        <ChatListItem
          v-for="chat in chats"
          :key="chat.interlocutor"
          :active="state.activeChat?.interlocutor === chat.interlocutor"
          :chat="chat"
          @click="state.activeChat = chat"
        />
      </TransitionList>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  @include flex-container(column);
  @include rounded();
  width: 600px;
  height: 800px;
  background: white;
  padding: 1rem;
  overflow: hidden;
}
.scroll {
  @include flex-container(column);
  height: 100%;
  overflow-y: scroll;
}

.list {
  @include flex-container(column, 0.5rem);
}
</style>
