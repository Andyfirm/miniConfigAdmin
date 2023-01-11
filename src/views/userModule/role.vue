<template>
  <div id="role">
    <el-card class="box-card">
      <!-- <div slot="header"> -->
      <search-top
        :showTypeObj="showTypeObj"
        @changeQuery="queryList"
        @showDialog="showDialog"
      ></search-top>
      <!-- </div> -->
      <!-- 表格 -->
      <el-row class="tableList">
        <el-table
          v-loading="loading"
          :data="tableData"
          height="76vh"
          stripe
        >
          <el-table-column label="序号" type="index" width="50">
          </el-table-column>
          <el-table-column label="角色类型" width="200">
            <template slot-scope="scope">
              <div>{{ scope.row.remark }}</div>
            </template>
          </el-table-column>

          <el-table-column label="场馆" width="200">
            <template slot-scope="scope">
              <div v-if="scope.row.shopNum">
                {{ getShopName(scope.row.shopNum) }}
              </div>
              <div v-else>管理中心</div>
            </template>
          </el-table-column>
          <el-table-column label="菜单权限">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top" width="300px">
                <div class="menuTree">
                  <el-tree
                    :data="scope.row.tbMenu.children"
                    :props="defaultPropsmenu"
                  >
                  </el-tree>
                </div>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="mini">鼠标放上查看详情</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="edit(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="small"
                type="danger"
                @click="removData(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <el-dialog
      :title="addType == 2 ? '修改角色' : '新增角色'"
      :visible.sync="dialogVisible"
      width="800px"
    >
      <el-form
        :model="formparam"
        :rules="rules"
        ref="formparam"
        label-width="120px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="场馆"
              prop="shopNum"
              v-if="addType == 1 || addType == 3"
            >
              <el-select
                style="width: 100%"
                v-model="formparam.shopNum"
                placeholder="请选择"
                @change="changeRole(formparam.shopNum)"
              >
                <el-option
                  v-for="item in shopList"
                  :key="item.shopNum"
                  :label="item.name"
                  :value="item.shopNum"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色类型" prop="name" v-if="addType != 3">
              <el-input
                v-model="formparam.name"
                placeholder="请输入角色名称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="选择菜单">
              <el-tree
                :data="menuList"
                :props="propsMenu"
                ref="treeMenu"
                node-key="mid"
                :default-expanded-keys="trueListmenu"
                :default-checked-keys="trueListmenu"
                show-checkbox
              >
              </el-tree>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button style="width: 100px" @click="resetForm('formparam')"
          >取 消</el-button
        >
        <el-button
          style="width: 100px"
          type="primary"
          @click="submitSetInfo('formparam')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { searchRole, getMenueemployee, insertRole, updateRole, deleteRole } from '../../api/index'
import SearchTop from '@/components/SearchTop.vue'
export default {
  name: 'role',
  data() {
    return {
      shopList: [],
      showTypeObj: {
        shopNum: true
      },
      queryObj: {
        shopNum: '',
      },
      loading: true,
      dialogVisible: false,
      addType: 1,
      tableData: [],
      formparam: {
        shopNum: '',
        name: '',
        ids: [],
        pid: ''
      },
      rules: {
        name: [{ required: true, message: "请输入角色名", trigger: "blur" }],
        shopNum: [
          { required: true, message: "请选择显示状态", trigger: "blur" },
        ]
      },
      defaultPropsmenu: {
        children: "children",
        label: "title",
      },
      propsMenu: {
        children: "children",
        label: "title",
      },
      menuList: [], //查询商户勾选菜单
      trueListmenu: [], //已经选中的菜单
    }
  },
  components: {
    SearchTop
  },
  mounted() {
    this.getTabledata()
    this.getMenueemployee()
  },
  methods: {
    queryList(queryObj) {
      this.queryObj = queryObj
      this.getTabledata()
    },
    async getTabledata() {
      const res = await searchRole(this.queryObj)
      this.loading = false
      if (res.msg === 'success') {
        this.tableData = res.data
      } else {
        this.$message.error(res.data)
      }
    },
    async getMenueemployee() {
      const res = await getMenueemployee()
      if (res.msg === 'success') {
        this.menuList = res.data.children
      } else {
        this.$message.error(res.message)
      }
    },
    showDialog() {
      this.addType = 1
      this.menuList = this.menuList.splice(0)
      this.shopList = JSON.parse(sessionStorage.getItem('shopList'))
      this.dialogVisible = true
      this.formparam.shopNum = ''
      this.formparam.name = ''
      this.formparam.ids = ''
      this.formparam.pid = ''
      this.trueListmenu = []
    },
    edit(row) {
      this.newData = row
      this.shopList = JSON.parse(sessionStorage.getItem('shopList'))
      this.menuList = this.menuList.splice(0)
      this.addType = 2
      this.dialogVisible = true
      this.trueListmenu = []
      this.formparam.name = row.remark
      this.formparam.id = row.id
      this.getLastTreeMenu(row.tbMenu)
      console.log(this.trueListmenu)
    },
    getLastTreeMenu(list) {
      if (list.children) {
        for (let i = 0; i < list.children.length; i++) {
          this.getLastTreeMenu(list.children[i])
        }
      } else {
        this.trueListmenu.push(list.mid)
      }
    },
    submitSetInfo(formparam) {
      this.formparam.ids = []
      let ids = this.$refs.treeMenu.getHalfCheckedKeys().concat(this.$refs.treeMenu.getCheckedKeys())
      for (let i = 0; i < ids.length; i++) {
        this.formparam.ids.push({ id: ids[i] })
      }
      this.formparam.ids = JSON.stringify(this.formparam.ids)
      this.$refs[formparam].validate(async (valid) => {
        if (valid) {
          if (this.addType == 1) {
            if (this.formparam.pid == '') {
              this.formparam.pid = JSON.parse(sessionStorage.getItem("userinfo")).pid
            }
            const res = await insertRole(this.formparam)
            this.dialogVisible = false
            if (res.msg === "success") {
              this.$message({
                type: "success",
                message: "新增成功"
              })
              this.getTabledata()
            } else {
              this.$message({
                type: "error",
                message: res.data
              })
            }
          } else if (this.addType == 2) {
            if (this.newData.remark == this.formparam.name) {
              this.formparam.name = ''
            }
            const res = await updateRole(this.formparam)
            this.dialogVisible = false
            if (res.msg === "success") {
              this.$message({
                type: "success",
                message: "修改成功"
              })
              this.getTabledata()
            } else {
              this.$message({
                type: "error",
                message: res.data
              })
            }
          }
        } else {
          return this.$message.error("请检查必填项")
        }
      })
    },
    removData(row) {
      this.$confirm(
        "此操作将删除当前用角色下所有的角色及账户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
      .then(async () => {
        const res = await deleteRole({id: row.id})
        if (res.msg == "success") {
          this.$message({
            type: "success",
            message: "删除成功"
          })
          this.getTabledata()
        } else {
          this.$message.error(res.data)
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        })
      })
    },
    //取消
    resetForm(formparams) {
      this.dialogVisible = false
      this.$refs[formparams].clearValidate()
      this.$refs[formparams].resetFields()
    },
    // 筛选分店名
    getShopName(shopNum) {
      let shopList = JSON.parse(sessionStorage.getItem('shopList'))
      let element = shopList.find(item => item.shopNum == shopNum)
      if (element) {
        return element.name
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#role {
  width: 100%;
  height: 100%;
  .box-card {
    height: 100%;
  }
}
</style>
