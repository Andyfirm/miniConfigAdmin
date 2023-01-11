<template>
  <div class="home">
    <el-container>
      <el-aside width="auto">
        <component-menu></component-menu>
      </el-aside>
      <el-container>
        <el-header>
          <nav-top></nav-top>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import ComponentMenu from '../components/ComponentMenu.vue'
import NavTop from '../components/NavTop.vue'
export default {
  name: 'HomeView',
  data() {
    return {}
  },
  components: {
    ComponentMenu,
    NavTop
  },
  computed: {
    isCollapse() {
      return this.$store.state.user.isCollapse
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-aside {
    // color: #fff;
    // background-color: #0087c4;
    color: #fff;
    background-color: #fff;
    border-right: 1px solid #efefef;
  }
  .el-aside::-webkit-scrollbar {
    // width: 5px;
    // height: 5px;
    display: none;
  }
  .el-aside::-webkit-scrollbar-thumb {
    background-color: #efefef;
    border-radius: 8px;
  }
  .el-main {
    background-color: #f0f2f5;
    color: #333;
    padding: 15px;
  }
  body > .el-container {
    margin-bottom: 40px;
  }
  .el-header {
    padding: 0 20px 0 10px;
  }
</style>
