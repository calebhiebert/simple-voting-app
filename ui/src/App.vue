<template>
  <div id="app">
    <transition
      name="fade-virt">
    <router-view style="position: absolute;"/>
    </transition>
  </div>
</template>
<style>
.fade-virt-enter-active,
.fade-virt-leave-active {
  transition: all 0.25s ease;
}

.fade-virt-enter,
.fade-virt-leave-active {
  opacity: 0;
  transform: translateY(10px);
}

.fade-virt-rev-enter-active,
.fade-virt-rev-leave-active {
  transition: all 0.25s ease;
}

.fade-virt-rev-enter,
.fade-virt-rev-leave-active {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
