import type { WSStoreState, Message } from './index'
import type { Ref } from 'vue'

interface WSMessageServerToClient {
  type: 'update' | 'newMsg' | 'confirmReading' | 'setIsTyping' | 'updateStatus'
  payload: any
}

export default function WSMessageReducer(
  state: Ref<WSStoreState>,
  action: WSMessageServerToClient
) {
  switch (action.type) {
    case 'update':
      updateState(state, action.payload)
      break
    case 'newMsg':
      handleNewMessage(state, action.payload)
      break
    case 'confirmReading':
      handleConfirmReading(state, action.payload)
      break
    case 'setIsTyping':
      handleSetIsTyping(state, action.payload)
      break
    case 'updateStatus':
      handleUpdateStatus(state, action.payload)
      break
  }
}

function updateState(state: Ref<WSStoreState>, payload: WSStoreState) {
  Object.assign(state.value, payload)
}

function handleNewMessage(
  state: Ref<WSStoreState>,
  payload: { interlocutor: string; message: Message }
) {
  const targetChat = state.value.chats.find((chat) => chat.interlocutor === payload.interlocutor)
  targetChat?.messages.push(payload.message)
}

function handleConfirmReading(
  state: Ref<WSStoreState>,
  payload: { id: number; interlocutor: string }
) {
  const targetChat = state.value.chats.find((chat) => chat.interlocutor === payload.interlocutor)
  const targetMsg = targetChat?.messages.find((msg) => msg.id === payload.id)
  if (targetMsg) targetMsg.hasBeenRead = true
}

function handleSetIsTyping(
  state: Ref<WSStoreState>,
  payload: { interlocutor: string; isTyping: boolean }
) {
  const targetChat = state.value.chats.find((chat) => chat.interlocutor === payload.interlocutor)
  if (targetChat) targetChat.isTyping = payload.isTyping
}

function handleUpdateStatus(
  state: Ref<WSStoreState>,
  payload: { interlocutor: string; isOnline: boolean; lastSeenAt: number }
) {
  const targetChat = state.value.chats.find((chat) => chat.interlocutor === payload.interlocutor)
  if (targetChat) {
    targetChat.isOnline = payload.isOnline
    targetChat.lastSeenAt = payload.lastSeenAt
  }
}
