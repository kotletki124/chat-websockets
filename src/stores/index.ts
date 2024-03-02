import { defineStore } from 'pinia'
import WSMessageReducer from './WSMessageReducer'
import { ref, watch } from 'vue'
import type { Ref } from 'vue'

export interface WSStoreState {
  isConnected: boolean
  chats: Array<Chat>
  activeChat: Chat | null
  username: string
}

export interface Chat {
  interlocutor: string
  isTyping: boolean
  isOnline: boolean
  lastSeenAt: number
  messages: Array<Message>
}

export interface Message {
  id: number
  timestamp: number
  text: string
  sender: string
  hasBeenSent: boolean
  hasBeenRead: boolean
}

interface WSMessageClientToServer {
  type: 'auth' | 'sendMsg' | 'confirmReading' | 'startTyping' | 'finishTyping'
  payload: any
}

export const useWebSocketStore = defineStore('wsStore', () => {
  let socket: WebSocket
  const state: Ref<WSStoreState> = ref({
    isConnected: false,
    chats: [],
    username: '',
    activeChat: null
  })

  watch(
    () => state.value.username,
    (newValue) => {
      sessionStorage.setItem('username', newValue)
    }
  )

  watch(
    () => state.value.chats,
    (newValue) => {
      if (state.value.activeChat === null && newValue.length > 0)
        state.value.activeChat = newValue.reduce((res, chat) => {
          const resLastMsg = res.messages[res.messages.length - 1]
          const currLastMsg = chat.messages[chat.messages.length - 1]
          if (currLastMsg.timestamp > resLastMsg.timestamp) res = chat
          return res
        }, newValue[0])
    }
  )

  const connect = (username: string) => {
    const webSocketDomain = window.location.hostname
    const webSocketPort = '8000'
    socket = new WebSocket(`wss://${webSocketDomain}:${webSocketPort}`)
    socket.onopen = async () => {
      console.log('WebSocket connected', username)
      sendMessage({
        type: 'auth',
        payload: { sender: username }
      })
      state.value.isConnected = true
    }
    socket.onclose = () => {
      console.log('WebSocket disconnected')
      state.value.isConnected = false
    }
    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    socket.onmessage = (msg) => {
      const message = JSON.parse(msg.data)
      WSMessageReducer(state, message)
    }
  }

  const sendMessage = (message: WSMessageClientToServer) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message))
    }
  }

  const sendChatMessage = ({ text, receiver }: { text: string; receiver: string }) => {
    sendMessage({
      type: 'sendMsg',
      payload: { text, sender: state.value.username, receiver }
    })
  }

  const sendReadingConfirmation = ({ message: { id, sender } }: { message: Message }) => {
    sendMessage({
      type: 'confirmReading',
      payload: { id, sender: state.value.username, receiver: sender }
    })
  }

  const sendStartTyping = () => {
    sendMessage({
      type: 'startTyping',
      payload: { sender: state.value.username, receiver: state.value.activeChat?.interlocutor }
    })
  }

  const sendFinishTyping = () => {
    sendMessage({
      type: 'finishTyping',
      payload: { sender: state.value.username, receiver: state.value.activeChat?.interlocutor }
    })
  }

  return {
    state,
    connect,
    sendMessage,
    sendChatMessage,
    sendReadingConfirmation,
    sendStartTyping,
    sendFinishTyping
  }
})
