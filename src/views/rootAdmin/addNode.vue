<template>
  <div class="app-container">
    <el-card class="tableInfo">
      <div slot="header" class="clearfix">
        <span style="font-size: 20px">功能配置信息</span>
      </div>
      <el-row>
        <el-row class="rowItem">
          <el-row class="lable">会员端功能节点：</el-row>
          <el-col :span="8" :offset="1">
            <template>
              <el-tree
                :data="this.getConfigList"
                :props="props"
                node-key="id"
                :expand-on-click-node="false"
              >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.label }}</span>
                  <span>
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => append(data)"
                      >增加子节点</el-button
                    >
                  </span>
                </span>
              </el-tree>
            </template>
          </el-col>
        </el-row>
      </el-row>
      <el-row style="display:none;">
        <el-row class="rowItem">
          <el-row class="lable">员工端功能模块：</el-row>
          <!-- <el-col class="empoList" :span="8" :offset="1"> -->
          <el-col :span="20" :offset="1" class="empoList">
            <div
              class="empoli"
              v-for="(item, index) in this.getEmpolList"
              :key="index"
            >
              {{ item.limitname }}
            </div>
          </el-col>
        </el-row>
        <el-col :offset="1">
          <el-button class="btn" size="small" type="primary" @click="appendEmp()"
            >增加功能</el-button
          >
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      :title="type == 1 ? '新增子节点' : '新增功能'"
      width="25%"
      class="add-event-dialog"
      :visible.sync="addEventdialogVisible"
      size="tiny"
    >
      <el-form ref="formparams" :model="formparams" :rules="rules">
        <el-form-item
          :label="type == 1 ? '节点名称' : '功能名称'"
          prop="functionNode"
        >
          <el-input v-model="formparams.functionNode"></el-input>
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
  </div>
</template>

<script>
import {
  getConfigInfo,
  insertFunctionNode,
  getEmployeeCanConfigInfo, //查询员工所有功能
  insertEFunctionNode, //新增员工功能节点
} from "../../api/index.js";
export default {
  data() {
    return {
      nodata: true,
      addEventdialogVisible: false,
      dialogVisibleEmp: false,
      loading: false,
      getConfigList: [],
      getEmpolList: [],
      treeListData: [],
      espJson: [],
      // tableData:[],
      type: 1,
      formparams: {
        functionNode: "",
        pid: "",
      },
      rules: {
        functionNode: [
          { required: true, message: "请输入子节点名称", trigger: "blur" },
        ],
      },
      props: {
        children: "tbLimits",
        label: "limitname",
      },
      defaultProps: {
        children: "tbLimitConfigList",
        label: "limitname",
      },
      propsEmp: {
        children: "children",
        label: "limitname",
      },
      defaultPropsEmp: {
        children: "children",
        label: "limitname",
      },
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getConfigInfo();
    setTimeout(() => {
      this.getEmployeeCanConfigInfo();
    }, 200);
  },
  watch: {},
  methods: {
    append(row) {
      this.type = 1;
      this.formparams.pid = row.id;
      this.formparams.functionNode = "";
      this.addEventdialogVisible = true;
    },
    appendEmp() {
      this.type = 2;
      this.formparams.pid = null;
      this.addEventdialogVisible = true;
    },

    //查询会员端所有功能
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
    //查询员工端所有功能
    getEmployeeCanConfigInfo() {
      getEmployeeCanConfigInfo().then((res) => {
        if (res.msg == "success") {
          this.getEmpolList = res.data;
          // this.espJson = [];
          // this.espJson.push({
          //   id: res.data.id,
          //   limit: res.data.limit,
          //   limitname: res.data.limitname,
          //   pid: res.data.pid
          // });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    submitForm(formparams) {
      this.$refs[formparams].validate((valid) => {
        if (valid) {
          this.$confirm(
            "增加节点或者功能模块之后不可修改删除, 确认添加吗?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then(() => {
              if (this.type == 1) {
                insertFunctionNode(this.formparams).then((res) => {
                  if (res.msg == "success") {
                    this.$message({
                      type: "success",
                      message: "增加节点成功",
                    });
                  } else {
                    this.$message.error(res.data);
                  }
                  this.addEventdialogVisible = false;
                  this.getConfigInfo();
                });
              } else {
                insertEFunctionNode(this.formparams).then((res) => {
                  if (res.msg == "success") {
                    this.$message({
                      type: "success",
                      message: "增加会员端功能模块成功",
                    });
                  } else {
                    this.$message.error(res.data);
                  }
                  this.addEventdialogVisible = false;
                  this.getEmployeeCanConfigInfo();
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消添加",
              });
              this.addEventdialogVisible = false;
              this.formparams.functionNode = "";
            });
        } else {
          this.$message.error("请检查必填项");
          return false;
        }
      });
    },
    //取消
    resetForm(formparams) {
      this.addEventdialogVisible = false;
      this.$refs[formparams].clearValidate();
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.tableInfo {
  height: 84vh;
  overflow-y: auto;
  .clearfix {
    font-size: 20px;
    font-weight: bolder;
  }
  .rowItem {
    padding: 0 20px 20px;
    .lable {
      font-size: 16px;
      font-weight: bolder;
      padding: 20px;
    }
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.vue-cropper-content {
  width: 100vh;
  height: 60vh;
}
.vue-cropper-box {
  height: auto;
}
.imgListF {
  display: flex;
  align-items: center;
  justify-content: space-around;
  .imgItem {
    width: 200px;
    height: 100px;
    border: 1px solid #cecece;
  }
  img {
    width: 200px;
    height: 100px;
  }
}
.empoList {
  border: 1px solid #cecece;
  border-radius: 4px;
  padding: 10px;
  overflow: hidden;
  .empoli {
    padding: 5px 10px;
    border: 1px solid skyblue;
    color: skyblue;
    border-radius: 4px;
    float: left;
    margin-right: 10px;
    margin-top: 10px;
  }
}
.btn {
  margin-left: 20px;
}
</style>
