<template>
  <!-- 一行最多展示4个的模式 -->
  <el-row style="margin-bottom:20px;" v-if="showNum <= 4">
    <el-col :span="4" v-if="showTypeObj.shopNum&&showShop">
      <el-select
        size="small"
        v-model="queryObj.shopNum"
        clearable
        placeholder="请选择场馆"
      >
        <el-option
          v-for="item of shopList"
          :key="item.shopNum"
          :label="item.name"
          :value="item.shopNum"
        ></el-option>
      </el-select>
    </el-col>
    <el-col :span="2" v-show="showNum > 0">
      <el-button
        size="small"
        class="ml20"
        type="primary"
        icon="el-icon-search"
        style="margin-left:10px;"
        @click="changeQuery"
        >查询</el-button
      >
    </el-col>
    <el-col :offset="22" :span="2" v-if="showNum === 0 && showAdd">
      <el-button
        size="small"
        type="success"
        icon="el-icon-circle-plus-outline"
        style="float:right;"
        @click="showDialog"
        >新增</el-button
      >
    </el-col>
    <el-col :offset="16" :span="2" v-if="showNum === 1 && showAdd">
      <el-button
        size="small"
        type="success"
        icon="el-icon-circle-plus-outline"
        style="float:right;"
        @click="showDialog"
        >新增</el-button
      >
    </el-col>
    <el-col :offset="12" :span="2" v-if="showNum === 2 && showAdd">
      <el-button
        size="small"
        type="success"
        icon="el-icon-circle-plus-outline"
        style="float:right;"
        @click="showDialog"
        >新增</el-button
      >
    </el-col>
    <el-col :offset="8" :span="2" v-if="showNum === 3 && showAdd">
      <el-button
        size="small"
        type="success"
        icon="el-icon-circle-plus-outline"
        style="float:right;"
        @click="showDialog"
        >新增</el-button
      >
    </el-col>
    <el-col :offset="4" :span="2" v-if="showNum === 4 && showAdd">
      <el-button
        size="small"
        type="success"
        icon="el-icon-circle-plus-outline"
        style="float:right;"
        @click="showDialog"
        >新增</el-button
      >
    </el-col>
  </el-row>
  <!-- 大于四个搜索条件的 -->
</template>

<script>
import { getShops } from '../api/index'
export default {
  name: 'SearchTop',
  props: {
    onlyShopNum: { // 是否仅显示查询分店
      type: Boolean,
      default: true
    },
    showAdd: { // 是否展示新增
      type: Boolean,
      default: true
    },
    showTypeObj: { // 可以显示的查询条件字段
       type: Object,
       default: function() {
        return {
          shopNum: false
        }
       }
     },
  },
  data() {
    return {
      showShop: false,
      showNum: 0,
      queryObj: {
        shopNum: ''
      },
      shopList: []
    }
  },
  mounted() {
    if (sessionStorage.getItem("shopList")) {
      this.shopList = JSON.parse(sessionStorage.getItem("shopList"))
      if (JSON.parse(sessionStorage.getItem("userinfo")).shopNum != null) {
        this.shopNum = this.shopList[0].shopNum
        this.showShop = false
      } else {
        this.showShop = true
      }
      // 实际要显示的字段数量
      let showTypeObjValues = Object.values(this.showTypeObj)
      let showNumbers = showTypeObjValues.filter(item => item)
      let showNum = showNumbers.length
      if (!this.showShop && this.showTypeObj.shopNum) {
        showNum = showNum - 1
      }
      this.showNum = showNum
    } else {
      this.getShopsList()
    }
  },
  methods: {
    async getShopsList() {
      const res = await getShops({ isWeb: 1 })
      if (res.msg === 'success') {
        this.shopList = res.data
        sessionStorage.setItem("shopList", JSON.stringify(res.data))
        if (JSON.parse(sessionStorage.getItem("userinfo")).shopNum != null) {
          this.showShop = false
        } else {
          this.showShop = true
        }
        // 实际要显示的字段数量
        let showTypeObjValues = Object.values(this.showTypeObj)
        let showNumbers = showTypeObjValues.filter(item => item)
        let showNum = showNumbers.length
        if (!this.showShop && this.showTypeObj.shopNum) {
          showNum = showNum - 1
        }
        this.showNum = showNum
      } else {
        this.$message.error(res.message)
      }

    },
    changeQuery() {
      let obj = {}
      if (this.showTypeObj.shopNum) {
        obj.shopNum = this.queryObj.shopNum
      }
      this.$emit('changeQuery', obj)
    },
    showDialog() {
      this.$emit('showDialog')
    },
  }
}
</script>