<script lang="ts" setup>
import { defineProps, ref, watch, nextTick } from 'vue'
import InputBasic from './InputBasic.vue'
import { useWebSocketStore } from '.././stores/index'
import { debounce } from '.././util'
import type { DebounceReturn } from '.././util'
import type { Ref } from 'vue'

interface Props {
  placeholder: string
}

interface InputRef {
  inputEl: HTMLInputElement | null
}

defineProps<Props>()

const { sendChatMessage, sendStartTyping, sendFinishTyping, state } = useWebSocketStore()
const isTyping = ref(false)
const value = ref('')
const sending = ref(false)
const inputRef: Ref<InputRef | null> = ref(null)
let setTimeoutControl: DebounceReturn | null

watch(
  () => state.activeChat?.messages.length,
  async (newLength) => {
    if (
      sending.value &&
      newLength &&
      newLength > 0 &&
      state.activeChat?.messages[newLength - 1].sender === state.username
    ) {
      sending.value = false
      value.value = ''
      await nextTick()
      inputRef.value?.inputEl?.focus()
    }
  }
)

const handleStartTyping = () => {
  isTyping.value = true
  sendStartTyping()
}

const handleFinishTyping = () => {
  isTyping.value = false
  sendFinishTyping()
}

const debouncedHandleFinishTyping = debounce(handleFinishTyping, 1000)

const handleInput = () => {
  if (!isTyping.value) handleStartTyping()
  setTimeoutControl = debouncedHandleFinishTyping()
}

const handleEnterKeyPress = (event: KeyboardEvent) => {
  if (event.shiftKey) value.value += '\n'
  else handleSubmit()
}

const handleSubmit = () => {
  if (value.value.length > 0 && state.isConnected) {
    if (setTimeoutControl) {
      setTimeoutControl.cancel()
      setTimeoutControl = null
    }
    handleFinishTyping()
    sending.value = true
    try {
      if (state.activeChat?.interlocutor)
        sendChatMessage({
          text: value.value,
          receiver: state.activeChat.interlocutor
        })
      else throw Error()
    } catch {
      sending.value = false
    }
  }
}
</script>

<template>
  <div>
    <form class="container" @submit.prevent="handleSubmit">
      <InputBasic
        ref="inputRef"
        :placeholder="placeholder"
        :multiline="true"
        :disabled="sending"
        v-model="value"
        @input="handleInput"
        @keydown.enter.prevent="handleEnterKeyPress"
      >
      </InputBasic>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
}
.input {
  @include inputContainer();
  @include inputPseudoClasses();
  outline-color: $secondary-lavender;
  outline-width: 1px;
  resize: none;
  padding: 0.5rem;
  width: 100%;
  box-sizing: border-box;
}
</style>
