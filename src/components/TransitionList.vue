<template>
  <TransitionGroup name="list" tag="div" class="transition">
    <slot />
  </TransitionGroup>
</template>

<style>
.transition {
  position: relative;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}

.list-leave-active {
  position: absolute;
}
</style>
