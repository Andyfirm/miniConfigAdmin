<template>
  <div id="member">
    <el-card class="box-card">
      <search-top
        :showTypeObj="showTypeObj"
        @changeQuery="queryList"
        @showDialog="showDialog"
      ></search-top>
      <el-row class="tableList">
        <el-table
          v-loading="loading"
          :data="tableData"
          height="76vh"
          stripe
        >
          <el-table-column label="序号" type="index" width="50">
          </el-table-column>
          <el-table-column prop="remark" label="职位名称" width="200"></el-table-column>
          <el-table-column label="角色类型" width="200">
            <template slot-scope="scope">
              <div v-if="scope.row.type == 0">教练</div>
              <div v-if="scope.row.type == 1">会籍</div>
              <div v-if="scope.row.type == 2">店长</div>
              <div v-if="scope.row.type == 3">董事长</div>
              <div v-if="scope.row.type == 4">会籍主管</div>
              <div v-if="scope.row.type == 5">教练主管</div>
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
          <el-table-column label="员工端功能权限">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top" width="500px">
                <div class="menuTree">
                  <div
                    v-for="(item, index) in scope.row.tbModuleList"
                    :key="index"
                  >
                    <div>{{ item.name }}</div>
                    <span
                      class="item2"
                      v-for="(item2, index) in item.tbELimitList"
                      :key="index"
                    >
                      {{ item2.limitname }}
                    </span>
                  </div>
                </div>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">鼠标放上查看详情</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="edit(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="small"
                type="danger"
                @click="remove(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <!-- 新增编辑弹框 -->
    <el-dialog
      :title="addType == 2 ? '修改角色' : '新增角色'"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <el-form
        :model="formparams"
        :rules="rules"
        ref="formparams"
        label-width="120px"
      >
        <el-form-item label="角色类型" prop="type">
          <el-select v-model="formparams.type" placeholder="请选择">
            <el-option
              v-for="item in this.types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="场馆"
          prop="shopNum"
          v-if="addType == 1 && formparams.type !== 3"
        >
          <el-select v-model="formparams.shopNum" placeholder="请选择">
            <el-option
              v-for="item in this.shopList"
              :key="item.shopNum"
              :label="item.name"
              :value="item.shopNum"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位名称" prop="role">
          <el-input
            class="w220"
            v-model="formparams.role"
            placeholder="请输入职位名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="功能模块">
          <el-tag
            style="margin: 0 10px"
            :key="index"
            v-for="(item, index) in dynamicTags"
            closable
            :disable-transitions="false"
            @click="changegTitle(item, index)"
            @close="handleClose(item)"
          >
            {{ item.name }}
          </el-tag>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100px" type="primary" @click="addProgevt"
            >添加分类</el-button
          >
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button style="width: 100px" @click="resetForm('formparams')"
          >取 消</el-button
        >
        <el-button
          style="width: 100px"
          type="primary"
          @click="submitForm('formparams')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog title="选择功能" :visible.sync="dialogVisible2" width="800px">
      <el-form
        :model="formparams2"
        :rules="rules2"
        ref="formparams2"
        label-width="120px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="分类名" prop="name">
              <el-input
                class="w220"
                v-model="formparams2.name"
                placeholder="请输入分类名称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="orderIndex">
              <el-input
                class="w220"
                v-model.number="formparams2.orderIndex"
                placeholder="请输入显示顺序"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="选择功能">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
            v-model="formparams2.checkedCities"
            @change="handleCheckedCitiesChange"
            style="margintop: 20px"
          >
            <el-checkbox-button
              style="margin: 10px"
              v-for="(item, index) in this.empList"
              :key="index"
              :label="item.limitid"
              border
              >{{ item.limitname }}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button style="width: 100px" @click="resetForm2('formparams2')"
          >取 消</el-button
        >
        <el-button
          style="width: 100px"
          type="primary"
          @click="submitForm2('formparams2')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getInfERole, getEmployeeConfigInfo, insertERole, updateInfERole } from '../../api/index'
import SearchTop from '@/components/SearchTop.vue'
export default {
  name: 'member',
  data() {
    return {
      shopList: [],
      showTypeObj: {
        shopNum: true
      },
      params: {
        shopNum: '',
        pageNo: 1,
        pageSize: 20
      },
      formparams: {
        shopNum: "",
        role: "", //员工角色名称
        limitInfo: [],
        id: null,
        type: "", //员工角色类型
      },
      formparams2: {
        name: "",
        orderIndex: "",
        checkedCities: [],
      },
      rules: {
        type: [
          { required: true, message: "请选择角色类型", trigger: "change" },
        ],
        role: [{ required: true, message: "请输入角色名", trigger: "blur" }],
        shopNum: [{ required: true, message: "请选择场馆", trigger: "change" }],
      },
      rules2: {
        name: [{ required: true, message: "请输入分类名", trigger: "blur" }],
        orderIndex: [
          { required: true, message: "排序不能为空", trigger: "blur" },
          { type: "number", min: 0, message: "排序必选是大于或等于0的正整数" },
        ],
      },
      addType: 1,
      loading: true,
      dialogVisible: false,
      dialogVisible2: false,
      showShop: false,
      isIndeterminate: false,
      checkAll: false,
      tableData: [],
      listIndex: "",
      addList: false,
      dynamicTags: [],
      types: [
        { label: "教练", value: 0 },
        { label: "会籍", value: 1 },
        { label: "店长", value: 2 },
        { label: "董事长", value: 3 },
        { label: "会籍主管", value: 4 },
        { label: "教练主管", value: 5 },
      ],
      empList: [], //员工端功能
      espJson: [],
    }
  },
  components: {
    SearchTop
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    queryList(params) {
      this.params = params
      this.getTableList()
    },
    async getTableList() {
      const res = await getInfERole(this.params)
      this.loading = false
      if (res.msg === 'success') {
        this.tableData = res.data
      } else {
        this.$message.error(res.data)
      }
    },
    showDialog() {
      this.shopList = JSON.parse(sessionStorage.getItem('shopList'))
      this.addType = 1
      this.getEmployeeConfigInfo(); 
      this.dynamicTags = [];
      this.formparams.id = "";
      this.formparams.shopNum = "";
      this.formparams.role = ""; //员工角色名称
      this.formparams.type = ""; //员工角色类型
      this.clearForm("formparams");
      this.dialogVisible = true;
    },
    //编辑
    edit(row) {
      this.addType = 2;
      this.dialogVisible = true;
      this.formparams.shopNum = row.shopNum;
      this.formparams.role = row.remark;
      this.formparams.id = row.id;
      this.formparams.type = parseInt(row.type);
      this.dynamicTags = row.tbModuleList;
      this.getEmployeeConfigInfo();
      this.isIndeterminate = true;
    },
    async getEmployeeConfigInfo() {
      const res = await getEmployeeConfigInfo()
      if (res.msg === 'success') {
        this.empList = res.data
      } else {
        this.$message.error(res.data)
      }
    },
    // 添加分类
    addProgevt() {
      this.formparams2.name = "";
      this.formparams2.orderIndex = "";
      this.formparams2.checkedCities = [];
      this.dialogVisible2 = true;
      this.addList = true;
    },
    // 功能模块
    changegTitle(item, index) {
      this.addList = false;
      this.isIndeterminate = true;
      this.listIndex = index;
      if (item.tbELimitList) {
        this.formparams2.checkedCities = [];
        for (let i = 0; i < item.tbELimitList.length; i++) {
          this.formparams2.checkedCities.push(item.tbELimitList[i].limitid);
        }
      } else {
        for (let i = 0; i < item.limitid.length; i++) {
          this.formparams2.checkedCities.push(item.limitid[i].limitid);
        }
      }
      this.checkAll =
        this.formparams2.checkedCities.length === this.empList.length;
      this.formparams2.name = item.name;
      this.formparams2.orderIndex = item.orderIndex;
      this.dialogVisible2 = true;
    },
    handleClose(item) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(item), 1);
    },
    handleCheckAllChange(val) {
      if (val) {
        this.formparams2.checkedCities = [];
        for (var i = 0; i < this.empList.length; i++) {
          this.formparams2.checkedCities.push(this.empList[i].limitid);
        }
      } else {
        this.formparams2.checkedCities = [];
      }
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.empList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.empList.length;
    },
    submitForm(formparams) {
      this.$refs[formparams].validate(async (valid) => {
        if (valid) {
          this.formparams.limitInfo = JSON.stringify(this.dynamicTags)
          if (this.addType == 1) {
            const res = await insertERole(this.formparams)
            if (res.msg === 'success') {
                this.$message.success('增加成功')
                this.dialogVisible = false
                this.getTableList()
              } else {
                this.$message.error(res.data)
              }
          } else if (this.addType == 2) {
            const res = await updateInfERole(this.formparams)
            if (res.msg === 'success') {
              this.$message.success('修改成功')
              this.dialogVisible = false
              this.getTableList()
            } else {
              this.$message.error(res.data)
            }
          }
        } else {
          return this.$message.error('请检查必填项')
        }
      })
    },
    submitForm2(formparams2) {
      this.$refs[formparams2].validate((valid) => {
        if (valid) {
          let limitid = [];
          for (let i = 0; i < this.formparams2.checkedCities.length; i++) {
            limitid.push({ limitid: this.formparams2.checkedCities[i] });
          }
          if (this.addList) {
            this.dynamicTags.push({
              name: this.formparams2.name,
              orderIndex: this.formparams2.orderIndex,
              tbELimitList: limitid,
            });
          } else {
            this.dynamicTags[this.listIndex] = {
              name: this.formparams2.name,
              orderIndex: this.formparams2.orderIndex,
              tbELimitList: limitid,
            };
          }
          this.dialogVisible2 = false;
        } else {
          this.$message.error("请检查必填项");
          return false;
        }
      });
    },
    //取消
    resetForm(formparams) {
      this.dialogVisible = false;
      this.$refs[formparams].clearValidate();
    },
    resetForm2(formparams) {
      this.dialogVisible2 = false;
      this.$refs[formparams].clearValidate();
    },
    clearForm(formName) {
      if (this.$refs[formName] != undefined) {
        this.$refs[formName].clearValidate();
      }
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

<style lang="scss">
#member {
  width: 100%;
  height: 100%;
  .box-card {
    height: 100%;
  }
  .el-select {
    width: 100%;
  }
}
.menuTree {
  width: 500px;
  overflow: hidden;
  height: auto;
}
.item2 {
  display: inline-block;
  padding: 5px 10px;
  border: 1px solid skyblue;
  border-radius: 4px;
  margin: 5px;
}
.el-checkbox-button__inner {
  border: 1px solid #dcdfe6 !important;
  border-radius: 4px !important;
  box-shadow: none !important;
}
</style>