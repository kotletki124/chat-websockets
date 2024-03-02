<script lang="ts" setup>
import OnlineStatus from './OnlineStatus.vue'
import UserCard from './UserCard.vue'
import { defineProps, computed } from 'vue'
import BadgeComponent from './BadgeComponent.vue'
import MessageStatus from './MessageStatus.vue'
import type { Chat } from '.././stores/index.ts'

interface Props {
  active: Boolean
  chat: Chat
}

const props = defineProps<Props>()

const unreadMessagesCount = computed(
  () =>
    props.chat.messages.filter((msg) => !msg.hasBeenRead && msg.sender === props.chat.interlocutor)
      .length
)

const msgPreviewClass = computed(() => `msg-preview ${unreadMessagesCount.value > 0 ? 'bold' : ''}`)
const containerClass = computed(() => (props.active ? 'row active' : 'row'))
const lastMsg = computed(() => props.chat.messages[props.chat.messages.length - 1])
</script>

<template>
  <div :class="containerClass">
    <div class="col" role="button">
      <UserCard :username="props.chat.interlocutor" />
      <div class="msg-row">
        <div :class="msgPreviewClass">
          <span v-if="props.chat.interlocutor !== lastMsg?.sender">Вы: </span>
          <span v-else>Собеседник: </span>
          {{ lastMsg?.text }}
        </div>
        <MessageStatus v-if="props.chat.interlocutor !== lastMsg?.sender" :message="lastMsg" />
      </div>
    </div>
    <BadgeComponent v-if="unreadMessagesCount > 0">{{ unreadMessagesCount }}</BadgeComponent>
    <OnlineStatus :timestamp="lastMsg?.timestamp" :dateOnly="true" />
  </div>
</template>

<style lang="scss" scoped>
.row {
  @include flex-container(row, 0.5rem, center, space-between);
  @include rounded();
  padding: 0.8rem;
  &:hover {
    background: $secondary-lavender-30;
    cursor: pointer;
  }
}

.col {
  @include flex-container(column);
  width: 83%;
}

.active {
  background: $secondary-lavender;
  &:hover {
    background: $secondary-lavender;
    pointer-events: none;
  }
}

.msg-row {
  @include flex-container();
}

.msg-preview {
  max-width: 90%;
  text-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bold {
  font-weight: 600;
}
</style>
