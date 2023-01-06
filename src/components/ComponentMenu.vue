<template>
  <div id="ComponentMenu">
    <div class="logo" v-show="!isCollapse"><img src="../assets/logo-menu.png" alt=""></div>
    <div class="logo-min" v-show="isCollapse"><img src="../assets/logo.png" alt=""></div>
    <el-menu
      unique-opened
      background-color="#FAFBFC"
      text-color="#333"
      active-text-color="#000"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      router
    >
    <menu-list :routes="permission_routers"></menu-list>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import menuList from './menuList.vue'
export default {
  name: 'ComponentMenu',
  data() {
    return {
    }
  },
  components: {
    menuList
  },
  computed: {
    isCollapse() {
      return this.$store.state.user.isCollapse
    },
    ...mapGetters(["permission_routers"])
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="scss">
#ComponentMenu {
  height: 100vh;
  // overflow: hidden;
  .logo {
    width: 60%;
    margin: 0 auto;
    padding: 20px 0;
    img {
      display: block;
      width: 100%;
    }
  }
  .logo-min {
    width: 26px;
    margin: 0 auto;
    padding: 20px 0;
    img {
      display: block;
      width: 100%;
    }
  }
  .el-menu {
    border: 0;
  }
}
element.style {
  padding-left: 20px;
  color: #333;
  background-color: #FAFBFC;
}
.el-submenu__title i {
  color: #666;
}
.el-menu-item i {
  color: #666;
}
.el-menu-item.is-active {
  color: #333;
  background: #EDF0F3 !important;
}
.router-link-active li {
  color: #333;
  background: #EDF0F3 !important;
}
.router-link-active i,
.router-link-active span {
  color: #333;
}
.el-menu-item:hover,
.el-submenu__title:hover {
  background: #EDF0F3 !important;
}
</style>