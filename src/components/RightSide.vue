<script lang="ts" setup>
import ChatContainer from './ChatContainer.vue'
import InputMessage from './InputMessage.vue'
import OnlineStatus from './OnlineStatus.vue'
import UserCard from './UserCard.vue'
import { useWebSocketStore } from '.././stores/index'

const { state } = useWebSocketStore()
</script>

<template>
  <div>
    <div class="container">
      <div class="row">
        <UserCard :username="state.activeChat?.interlocutor" />
        <OnlineStatus
          v-if="state.activeChat"
          :isOnline="state.activeChat.isOnline"
          :timestamp="state.activeChat.lastSeenAt"
        />
      </div>
      <hr />
      <ChatContainer />
      <InputMessage placeholder="Сообщение" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.row {
  @include flex-container(row, 0rem, center, space-between);
}
.container {
  @include flex-container(column, 0rem);
  @include rounded();
  width: 800px;
  height: 800px;
  background: white;
  padding: 1rem;
}
</style>
