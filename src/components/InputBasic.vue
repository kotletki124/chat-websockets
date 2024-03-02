<script lang="ts" setup>
import { defineProps, defineEmits, defineExpose, computed, ref } from 'vue'
import type { Ref } from 'vue'

interface Props {
  placeholder?: string
  disabled?: boolean
  modelValue?: string
  multiline?: boolean
}

const props = defineProps<Props>()

const inputEl: Ref<HTMLInputElement | null> = ref(null)
defineExpose({ inputEl })

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])
const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const isFocused = ref(false)
const inputContainerClass = computed(
  () => `container ${isFocused.value ? 'container-focused' : ''}`
)

const handleFocus = (e: Event) => {
  isFocused.value = true
  emit('focus', e)
}

const handleBlur = (e: Event) => {
  isFocused.value = false
  emit('blur', e)
}
</script>

<template>
  <div>
    <div :class="inputContainerClass">
      <div class="start-adornment">
        <slot name="startAdornment" />
      </div>
      <textarea
        v-if="multiline"
        ref="inputEl"
        maxlength="4096"
        :placeholder="placeholder"
        :disabled="disabled"
        class="input"
        v-model="value"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <input
        v-else
        ref="inputEl"
        :placeholder="placeholder"
        :disabled="disabled"
        class="input"
        v-model="value"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <div class="">
        <slot name="endAdornment" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.start-adornment {
  padding: 0 1rem;
}
.container {
  display: flex;
  align-items: center;
  @include inputContainer();
}

.container-focused {
  border-color: $secondary-lavender;
}
.input {
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  @include inputPseudoClasses();
}
</style>
