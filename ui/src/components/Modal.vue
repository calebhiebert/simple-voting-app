<template>
  <div class="modal" :class="{active: active, 'modal-sm': size === 'sm', 'modal-lg': size === 'lg'}">
    <a @click="hide" class="modal-overlay" aria-label="Close"></a>
    <div class="modal-container">
      <div class="modal-header">
        <slot name="header">
          <a class="btn btn-clear float-right" aria-label="Close" @click="hide"></a>
          <div class="modal-title h5">{{ title }}</div>
        </slot>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    size: {
      type: String,
      default: 'md',
    },
    title: {
      type: String,
      default: '',
    },
  },

  data () {
    return {
      active: false,
    };
  },

  methods: {
    show () {
      this.active = true;
    },

    hide () {
      this.active = false;
    },
  },
};
</script>
