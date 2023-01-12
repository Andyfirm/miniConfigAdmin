<template>
  <div class="app-container">
    <el-card class="tableInfo">
      <el-row class="headTop">
        <el-col :span="2">
          <el-button class="goBack" size="small" @click="goback()" icon="el-icon-arrow-left"
            >返回上一级</el-button
          >
        </el-col>
      </el-row>
      <!-- 微信会员端功能配置 -->
      <el-row>
        <el-row class="rowItem">
          <el-col class="lable" :span="3">会员端功能结构：</el-col>
          <el-col :span="10">
            <template>
              <el-tree
                :data="this.tableData.tbLimitConfigList"
                :props="defaultProps"
              ></el-tree> </template
          ></el-col>
        </el-row>
        <el-row style="margin: 10px 0 20px">
          <el-col :span="10" :offset="3">
            <el-button
              style="width: 80px"
              size="small"
              type="primary"
              @click="edit(tableData)"
            >
              编辑
            </el-button>
          </el-col>
        </el-row>
      </el-row>
      <!-- 微信员工端功能配置 -->
      <el-row style="display:none;">
        <el-row class="rowItem">
          <el-col class="lable" :span="3">员工端功能结构：</el-col>
          <el-col :span="20">
            <div
              class="checked"
              v-for="item in this.tableDataEmployee"
              :key="item.limitid"
            >
              {{ item.limitname }}
            </div>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0 20px">
          <el-col :span="10" :offset="3">
            <el-button
              style="width: 80px"
              size="small"
              type="primary"
              @click="editEmployee(tableDataEmployee)"
            >
              编辑
            </el-button>
          </el-col>
        </el-row>
      </el-row>
      <!-- 后台管理菜单列表控制 -->
      <el-row>
        <el-row class="rowItem">
          <el-col class="lable" :span="3">后台菜单列表：</el-col>
          <el-col :span="10">
            <template>
              <el-tree
                :data="this.chooseMenu.children"
                :props="defaultPropsmenu"
              ></el-tree>
            </template>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="10" :offset="3">
            <el-button
              style="width: 80px"
              size="small"
              type="primary"
              @click="editMenuList(chooseMenu)"
            >
              编辑
            </el-button>
          </el-col>
        </el-row>
      </el-row>
    </el-card>
    <el-dialog
      title="设置会员端功能"
      :visible.sync="dialogVisible"
      width="1000px"
    >
      <el-form :model="formparams" ref="formparams" label-width="100px">
        <el-form-item label="选择功能">
          <el-tree
            :data="this.getConfigList"
            :props="props"
            ref="tree"
            node-key="id"
            :default-expanded-keys="this.trueList"
            :default-checked-keys="this.trueList"
            show-checkbox
          >
          </el-tree>
          <!-- <el-input v-model="formparams.discountname" maxlength="20"></el-input> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm()">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="设置员工端功能"
      :visible.sync="dialogVisibleEmployee"
      width="1000px"
    >
      <el-form :model="formparams" ref="formparams" label-width="100px">
        <el-form-item label="选择功能">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
            v-model="checkedCities"
            @change="handleCheckedCitiesChange"
            style="margintop: 20px"
          >
            <el-checkbox-button
              style="margin: 10px; border: none"
              v-for="item in this.getConfigEmpolyee"
              :key="item.id"
              :label="item.id"
              border
              >{{ item.limitname }}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm()">取 消</el-button>
        <el-button type="primary" @click="submitEmpol()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="设置菜单"
      :visible.sync="dialogVisibleMenu"
      width="1000px"
    >
      <el-form :model="formparams" ref="formparamsMenu" label-width="100px">
        <el-form-item label="选择菜单">
          <el-tree
            :data="this.menuList"
            :props="propsMenu"
            ref="treeMenu"
            node-key="id"
            :default-expanded-keys="this.trueListmenu"
            :default-checked-keys="this.trueListmenu"
            show-checkbox
          >
          </el-tree>
          <!-- <el-input v-model="formparams.discountname" maxlength="20"></el-input> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm()">取 消</el-button>
        <el-button type="primary" @click="submitMenu()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  serachChooseMenu,
  serachMenu,
  getConfigInfo,
  addConfigInfo,
  getFunctionNodeInfo,
  insertMenue,
  getEmployeeConfigInfo, //查询员工端功能
  getEmployeeCanConfigInfo, //查询员工所有功能
  insertEmployeeConfigInfo, //勾选员工端配置功能
} from "../../api/index.js";
export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      loading: false,
      dialogVisibleMenu: false,
      dialogVisibleEmployee: false, //员工端
      isIndeterminate: false,
      checkAll: true,
      checkedCities: [],
      getConfigList: [], //所有会员端功能
      getConfigMenuList: [],
      getConfigEmpolyee: [], //所有员工端功能
      trueList: [],
      trueListEmp: [], //员工端勾选数据
      trueListmenu: [],
      espJson: [],
      fujimenu: [],

      tableData: [], //会员端数据数组
      tableDataEmployee: [], //员工数据数组
      tableDataMenu: [], //菜单数组

      menuList: [],
      chooseMenu: [],

      rootShortName: [],
      formparams: {
        clubMemberCode: this.$route.query.clubMemberCode,
        configInfo: [],
      },
      formparamsMenu: {
        clubMemberCode: this.$route.query.clubMemberCode,
        menueInfo: [],
      },
      props: {
        children: "tbLimits",
        label: "limitname",
      },
      propsEmpDialog: {
        children: "children",
        label: "limitname",
      },
      //微信会员端
      defaultProps: {
        children: "tbLimitConfigList",
        label: "limitname",
      },
      //微信员工端
      propsEmployee: {
        children: "tbLimitConfigList",
        label: "limitname",
      },
      //后台菜单
      defaultPropsmenu: {
        children: "children",
        label: "title",
      },
      propsMenu: {
        children: "children",
        label: "title",
      },
      form: {},
      formData: {},
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getFunctionNodeInfo();
    setTimeout(() => {
      this.getEmployeeConfigInfo();
    }, 200);

    setTimeout(() => {
      this.serachChooseMenu();
    }, 400);
  },
  watch: {},
  methods: {
    goback() {
      this.$router.go(-1);
    },
    //查询菜单树
    serachMenu() {
      serachMenu().then((res) => {
        if (res.msg == "success") {
          // this.getConfigMenuList = res.data
          this.menuList = res.data.children;
          this.fujimenu = [];
          this.fujimenu.push({ id: res.data.id, pid: res.data.pid });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //查询已经勾选的菜单树
    serachChooseMenu() {
      serachChooseMenu({
        clubMemberCode: this.$route.query.clubMemberCode,
      }).then((res) => {
        if (res.msg == "success") {
          if (res.data) {
            this.chooseMenu = res.data;
          } else {
            this.chooseMenu = [];
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //查询会员端功能配置信息
    getFunctionNodeInfo() {
      getFunctionNodeInfo({
        typestatus: 1,
        clubMemberCode: this.$route.query.clubMemberCode,
      }).then((res) => {
        if (res.msg == "success") {
          if (res.data == null) {
            this.tableData = [];
          } else {
            this.tableData = res.data;
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },

    //查询员工端功能配置信息
    getEmployeeConfigInfo() {
      getEmployeeConfigInfo({
        clubMemberCode: this.$route.query.clubMemberCode,
      }).then((res) => {
        if (res.msg == "success") {
          if (res.data == null) {
            this.tableDataEmployee = [];
          } else {
            this.tableDataEmployee = res.data;
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //查询全部功能
    getConfigInfo() {
      getConfigInfo().then((res) => {
        if (res.msg == "success") {
          this.getConfigList = res.data.tbLimits;
          this.espJson = [];
          this.espJson.push({
            id: res.data.id,
            limit: res.data.limit,
            limitname: res.data.limitname,
            pid: res.data.pid,
          });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //编辑添加权限管理
    edit(row) {
      this.getConfigInfo();
      if (row.tbLimitConfigList) {
        this.trueList = [];
        this.getLastTree(row);
      }
      this.dialogVisible = true;
    },
    //编辑权限员工端权限管理
    editEmployee(row) {
      this.getEmployeeCanConfigInfo();
      this.dialogVisibleEmployee = true;
      if (row) {
        this.checkedCities = [];
        for (var i = 0; i < row.length; i++) {
          this.checkedCities.push(row[i].limitid);
        }
      }
      this.checkAll =
        this.checkedCities.length === this.getConfigEmpolyee.length;
      this.isIndeterminate = true;
    },
    //递归过滤出已经勾选的信息
    getLastTree(list) {
      if (list.tbLimitConfigList) {
        for (let i = 0; i < list.tbLimitConfigList.length; i++) {
          this.getLastTree(list.tbLimitConfigList[i]);
        }
      } else {
        this.trueList.push(list.limitid.toString());
      }
    },
    //修改菜单
    editMenuList(row) {
      this.serachMenu();
      if (row.children) {
        this.trueListmenu = [];
        this.getLastTreeMenu(row);
      }
      this.dialogVisibleMenu = true;
    },
    //菜单勾选递归
    getLastTreeMenu(list) {
      if (list.children) {
        for (let i = 0; i < list.children.length; i++) {
          this.getLastTreeMenu(list.children[i]);
        }
      } else {
        this.trueListmenu.push(list.mid);
      }
    },
    //员工端功能配置
    getLastTreeEmpol(list) {
      if (list.children) {
        for (let i = 0; i < list.children.length; i++) {
          this.getLastTreeEmpol(list.children[i]);
        }
      } else {
        this.trueList.push(list.limitid.toString());
      }
    },
    //查询员工所有可配置功能
    getEmployeeCanConfigInfo() {
      getEmployeeCanConfigInfo().then((res) => {
        if (res.msg == "success") {
          this.getConfigEmpolyee = res.data;
          // this.espJson = []
          // this.espJson.push({id:res.data.id,limit:res.data.limit,limitname:res.data.limitname,pid:res.data.pid})
        } else {
          this.$message.error(res.message);
        }
      });
    },
    resetForm() {
      this.dialogVisible = false;
      this.dialogVisibleMenu = false;
      this.dialogVisibleEmployee = false;
    },
    submitForm() {
      this.formparams.configInfo = [""];
      this.formparams.configInfo = JSON.stringify(
        this.$refs.tree
          .getHalfCheckedNodes()
          .concat(this.$refs.tree.getCheckedNodes().concat(this.espJson))
      );
      addConfigInfo(this.formparams).then((res) => {
        if (res.msg == "success") {
          this.$message({
            type: "success",
            message: "修改成功",
          });
          this.dialogVisible = false;
          this.formparams.configInfo = "";
          this.getFunctionNodeInfo();
        }
      });
    },
    submitMenu() {
      this.formparamsMenu.menueInfo = JSON.stringify(
        this.$refs.treeMenu
          .getHalfCheckedNodes()
          .concat(this.$refs.treeMenu.getCheckedNodes().concat(this.fujimenu))
      );
      insertMenue(this.formparamsMenu).then((res) => {
        if (res.msg == "success") {
          this.$message({
            type: "success",
            message: "修改成功",
          });
          this.dialogVisibleMenu = false;
          this.formparamsMenu.menueInfo = "";
          this.serachChooseMenu();
        }
      });
    },
    //员工端配置
    submitEmpol() {
      this.formparams.configInfo = [];
      for (var i = 0; i < this.getConfigEmpolyee.length; i++) {
        if (this.checkedCities.indexOf(this.getConfigEmpolyee[i].id) >= 0) {
          this.formparams.configInfo.push(this.getConfigEmpolyee[i]);
        }
      }
      this.formparams.configInfo = JSON.stringify(this.formparams.configInfo);
      insertEmployeeConfigInfo(this.formparams).then((res) => {
        if (res.msg == "success") {
          this.$message({
            type: "success",
            message: "设置成功",
          });
          this.dialogVisibleEmployee = false;
          this.formparams.configInfo = "";
          this.getEmployeeConfigInfo();
        }
      });
    },
    removeList() {
      this.$router.push({ path: "/demo" });
    },
    handleCheckAllChange(val) {
      if (val) {
        this.checkedCities = [];
        for (var i = 0; i < this.getConfigEmpolyee.length; i++) {
          this.checkedCities.push(this.getConfigEmpolyee[i].id);
        }
      } else {
        this.checkedCities = [];
      }
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.getConfigEmpolyee.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.getConfigEmpolyee.length;
    },
  },
};
</script>

<style lang="scss">
.app-container {
  position: relative;
  height: auto;
  .tableInfo {
    height: 85vh;
    overflow-y: auto;
    .clearfix {
      font-size: 20px;
      font-weight: bolder;
    }
    .rowItem {
      padding: 20px;
      // border-bottom: 1px solid #f2f2f2;
      .lable {
        font-size: 16px;
        font-weight: bolder;
      }
    }
    .imgList {
      width: 200px;
      height: 100px;
      margin-bottom: 10px;
      margin-left: 10px;
      border-radius: 10px;
      overflow: hidden;
      background: #f2f2f2;
      float: left;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .pageination {
    position: absolute;
    top: 82vh;
    left: 0;
    right: 0;
  }
}

.checked {
  padding: 10px 15px;
  border: 1px solid #dcdfe6;
  float: left;
  border-radius: 4px;
  margin: 10px;
}
</style>
