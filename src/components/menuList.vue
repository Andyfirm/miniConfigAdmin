<template>
  <fragment class="menu">
    <template v-for="item of routes">
      <el-submenu v-if="!item.hidden&&item.children" :index="item.name" :key="item.name">
        <template slot="title">
          <i v-if="item.meta&&item.meta.icon" :class="item.meta.icon"></i>
          <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
        </template>
        <template v-for="child in item.children">  
            <menu-list v-if="!child.hidden&&child.children&&child.children.length" :routes="[child]" :key="child.name" ></menu-list>
            <router-link v-else-if="!child.hidden" :to="child.path" :key="'A' + child.name">
              <el-menu-item :index="child.path">
                <i v-if="child.meta&&child.meta.icon" :class="child.meta.icon"></i>
                <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
              </el-menu-item>
            </router-link>
        </template>
      </el-submenu>
    </template>
  </fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'

export default {
  name: 'menuList',
  props: {
    routes: {
      type: Array
    }
  },
  components: { Fragment },
  computed: {
    isCollapse() {
      return this.$store.state.user.isCollapse
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
</style>