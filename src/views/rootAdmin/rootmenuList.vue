<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-dialog
        :title="addType == 1 ? '添加菜单' : '修改菜单'"
        :visible.sync="dialogVisible"
        width="30%"
      >
        <el-form
          :model="formparams"
          :rules="rules"
          ref="formparams"
          label-width="120px"
        >
          <el-form-item label="菜单名称">
            <el-input
              v-model="formparams.title"
              placeholder="请输入菜单名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="跳转地址">
            <el-input
              v-model="formparams.path"
              placeholder="请输入跳转地址path"
            ></el-input>
          </el-form-item>
          <el-form-item label="组件名">
            <el-input
              v-model="formparams.component"
              placeholder="请输入组件名component"
            ></el-input>
          </el-form-item>
          <el-form-item label="路由名称">
            <el-input
              v-model="formparams.name"
              placeholder="请输入路由名称name"
            ></el-input>
          </el-form-item>
          <el-form-item label="图标">
            <el-input
              v-model="formparams.icon"
              placeholder="请输入icon名"
            ></el-input>
          </el-form-item>
          <el-form-item label="父级菜单">
            <el-input v-model="formparams.pid" placeholder="请输入id"></el-input>
          </el-form-item>
          <!-- <el-form-item label="父级菜单"> -->
          <!-- <el-tree
                  :data="this.tableData"
                  :props="propsMenu"
                  node-key="id"
                  :expand-on-click-node="false">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span>
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => append(data)">
                      添加子菜单
                    </el-button>
                    </span>
                  </span>
                </el-tree> -->
          <!-- <el-tree
                  :data="this.tableData"
                  :props="propsMenu"
                  ref="treeMenu"
                  node-key="id"
                  :default-expanded-keys="this.trueListmenu"
                  :default-checked-keys="this.trueListmenu"
                  show-checkbox>
                </el-tree> -->
          <!-- <el-input v-model="formparams.discountname" maxlength="20"></el-input> -->
          <!-- </el-form-item> -->
          <el-form-item label="初始隐藏">
            <el-select v-model="formparams.hidden" placeholder="请选择">
              <el-option
                v-for="item in this.showHidenList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
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
      <el-row class="tableList">
        <el-table
          v-loading="loading"
          :data="tableData"
          height="80vh"
          row-key="id"
          stripe
          lazy
          default-expand-all
          :tree-props="{ children: 'children' }"
        >
          <!-- <el-table-column label="序号" type="index" width="50">
          </el-table-column> -->
          <el-table-column prop="title" label="菜单名称" width="200"></el-table-column>
          <el-table-column prop="id" label="id"></el-table-column>
          <el-table-column prop="path" label="跳转地址"></el-table-column>
          <el-table-column prop="component" label="组件名"></el-table-column>
          <el-table-column prop="name" label="路由名"></el-table-column>
          <!-- <el-table-column prop="icon" label="图标"></el-table-column> -->
          <!-- <el-table-column prop="hidden" label="初始隐藏" width="80"></el-table-column> -->
          <el-table-column width="240" label="操作">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-circle-plus-outline"
                size="small"
                type="success"
                @click="showDialog(scope.row)"
                >子菜单</el-button
              >
              <el-button
                size="small"
                type="primary"
                @click="edit(scope.row)"
                >修改</el-button
              >
              <el-button
                size="small"
                type="danger"
                @click="removeList(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import {
  deleteMenu,
  serachMenu,
  insertMenu,
  updateMenu,
} from "../../api/index";

export default {
  data() {
    return {
      loading: true,
      dialogVisible: false,
      query: {
        userName: "",
      },
      addType: 1,
      //父级菜单
      Plist: [],
      //数据源标识
      clubMemberCodeS: [],
      formparams: {
        name: "",
        path: "",
        icon: "",
        title: "",
        component: "",
        pid: "",
        hidden: "",
      },
      //表单校验
      rules: {
        // name:[
        //   { required: true, message: '请输入路由跳转名', trigger: 'blur' }
        // ],
        // path:[
        //   { required: true, message: '请输入跳转地址', trigger: 'blur' }
        // ],
        // title:[
        //   { required: true, message: '请输入菜单名称', trigger: 'blur' }
        // ],
        // component:[
        //   { required: true, message: '请输入组件名', trigger: 'blur' }
        // ]
      },
      propsMenu: {
        children: "children",
        label: "title",
      },
      //用户列表
      tableData: [],
      showHidenList: [
        { value: "true", label: "是" },
        { value: "false", label: "否" },
      ],
      total: 0,
      currentPage: 1,
      params: {
        page: 1,
        size: 20,
      },
    };
  },
  mounted() {
    this.serachMenu();
  },
  methods: {
    showDialog(row) {
      this.dialogVisible = true;
      this.formparams.pid = row.id;
      this.formparams.name = "";
      this.formparams.path = "";
      this.formparams.title = "";
      this.formparams.component = "";
      this.formparams.icon = "";
      this.formparams.hidden = "";
      this.addType = 1;
      this.serachMenu();
    },
    append(row) {
      this.formparams.pid = row.id;
      this.formparams.functionNode = "";
      // this.dialogVisible =true
    },
    serachMenu() {
      serachMenu().then((res) => {
        if (res.msg == "success") {
          if (!res.data) {
            this.tableData = [];
          } else {
            this.tableData = res.data.children;
          }
        } else {
          this.$message.error(res.data);
        }
        this.loading = false;
      });
    },
    //提交增加数据源接口
    // addDataSource
    submitForm(formparams) {
      this.$refs[formparams].validate((valid) => {
        if (valid) {
          if (this.addType == 2) {
            //修改
            updateMenu(this.formparams).then((res) => {
              if (res.msg == "success") {
                this.dialogVisible = false;
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.serachMenu();
              } else {
                this.$message.error("失败");
              }
            });
          } else if (this.addType == 1) {
            //添加
            insertMenu(this.formparams).then((res) => {
              if (res.msg == "success") {
                this.dialogVisible = false;
                this.$message({
                  message: "添加成功",
                  type: "success",
                });
                this.serachMenu();
              } else {
                this.$message.error(res.data);
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    removeList(row) {
      deleteMenu({ id: row }).then((res) => {
        if (res.msg == "success") {
          this.dialogVisible = false;
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.serachMenu();
        } else {
          this.$message.error("失败");
        }
      });
    },
    resetForm(formparams) {
      this.dialogVisible = false;
      this.$refs[formparams].clearValidate();
    },
    edit(row) {
      this.formparams.id = row.id;
      this.formparams.name = row.name;
      this.formparams.title = row.title;
      this.formparams.component = row.component;
      this.formparams.icon = row.icon;
      this.formparams.path = row.path;
      this.formparams.hidden = row.hidden;
      this.formparams.pid = row.pid;
      this.addType = 2;
      this.dialogVisible = true;
    },
    //分页
    handleSizeChange(val) {
      this.params.size = val;
      this.params.page = 1;
      this.currentPage = 1;
    },
    handleCurrentChange(val) {
      this.params.page = val;
    },
  },
};
</script>
<style lang="scss" scoped>
.el-select {
  width: 100%;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>