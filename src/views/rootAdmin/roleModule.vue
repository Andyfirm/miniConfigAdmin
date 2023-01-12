<template>
  <div class="app-container">
    <el-card class="box-card">
    <el-table v-loading="loading" :data="tableData" height="80vh" stripe>
      <el-table-column
        label="序号"
        type="index"
        width="50">
      </el-table-column>
      <el-table-column prop="role" label="用户名"></el-table-column>
      <el-table-column prop="remark" label="角色"> </el-table-column>
    </el-table>
  </el-card>
</div>
</template>

<script>
import {getRole } from "../../api/index";

export default {
data() {
  return {
    loading: true,
    //数据源标识
    clubMemberCodeS:[],
    //用户列表
    tableData:[
    ]
  }
},
mounted() {
  this.getUser()
},
methods: {
  getUser(){
    getRole().then((res)=>{
      if(res.msg=='success'){
        this.tableData = res.data  
      } else {
        this.$message.error(res.data)
      }
      this.loading = false
    })
  }
}
};
</script>
<style scoped lang="scss">
</style>