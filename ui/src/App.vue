<template>
  <div id="app">
    <transition
      name="fade">
    <router-view style="position: absolute;"/>
    </transition>
  </div>
</template>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: all .25s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
  transform: translateY(10px);
}

.fade-rev-enter-active,
.fade-rev-leave-active {
  transition: all .25s ease;
}

.fade-rev-enter,
.fade-rev-leave-active {
  opacity: 0;
  transform: translateY(-10px);
}

</style>
