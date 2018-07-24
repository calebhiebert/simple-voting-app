<template>
  <div id="app">
    <div class="toast toast-warning text-center" v-if="$store.state.me && $store.state.me.banned">
      <strong>Warning</strong>
      <br/>
      You have been banned from voting, editing, and adding new guests
    </div>
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
