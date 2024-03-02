<template>
  <div class="badge">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.badge {
  @include flex-container(row, 0rem, center, center);
  text-align: center;
  width: 1.7rem;
  height: 1.7rem;
  background: $coral;
  color: white;
  border-radius: 50%;
}
</style>
