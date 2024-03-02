<script lang="ts" setup>
import { defineProps, defineEmits, ref } from 'vue'
import InputBasic from './InputBasic.vue'
import IconSearch from './IconSearch.vue'

const props = defineProps({ placeholder: String, modelValue: String })
const emit = defineEmits(['submit'])
const localValue = ref(props.modelValue)
</script>

<template>
  <div>
    <form class="container" @submit.prevent="emit('submit', localValue)">
      <InputBasic v-bind="props" v-model="localValue" :placeholder="props.placeholder">
        <template #startAdornment>
          <IconSearch class="icon" />
        </template>
      </InputBasic>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
}

.icon::v-deep(*) {
  fill: $text-grey;
}
</style>
