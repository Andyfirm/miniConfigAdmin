<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-row :gutter="20" style="margin-bottom:20px;">
        <el-col :span="4" v-if="showShop">
          <el-select
            size="small"
            class="w150 mr20"
            v-model="queryParams.shopNum"
            clearable
            placeholder="请选择场馆"
          >
            <el-option
              v-for="item in this.shopList"
              :key="item.shopNum"
              :label="item.name"
              :value="item.shopNum"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            size="small"
            class="w150 mr20"
            v-model="queryParams.roleType"
            clearable
            placeholder="请选择角色"
          >
            <el-option
              v-for="item in this.types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input
            size="small"
            class="w150"
            placeholder="请输入姓名"
            v-model="queryParams.name"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-input
            size="small"
            class="w150"
            placeholder="请输入手机号"
            v-model="queryParams.mobile"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button
            size="small"
            class="ml20"
            type="primary"
            icon="el-icon-search"
            @click="queryList()"
            >查询</el-button
          >
        </el-col>
      </el-row>
      <el-dialog
        :title="this.changeType == 1 ? '配置角色' : '设置'"
        :visible.sync="dialogVisible"
        width="1000px"
      >
        <el-form
          :model="formparams"
          :rules="rules"
          ref="formparams"
          label-width="120px"
        >
          <el-row v-if="this.changeType == 2">
            <el-form-item label="头像" required ref="uploadElement" prop="">
              <el-upload
                :class="{ uploaderNone: hideUpload }"
                action="aa"
                ref="upload"
                list-type="picture-card"
                :auto-upload="false"
                :http-request="uploadFile"
                :file-list="fileList"
                multiple
                :limit="1"
                :on-change="onChange"
                :on-remove="handleRemove"
                accept="image/png,image/gif,image/jpg,image/jpeg"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              *提示*：为了更好的用户体验，图片请提供160*160像素，文件大小不超过500kb。
            </el-form-item>
            <el-form-item label="上课时间">
              <el-time-select
                placeholder="起始时间"
                v-model="formparams.begintime"
                :picker-options="{
                  start: '08:00',
                  step: '00:30',
                  end: '22:00',
                }"
              >
              </el-time-select> - 
              <el-time-select
                placeholder="结束时间"
                v-model="formparams.endtime"
                :picker-options="{
                  start: '08:00',
                  step: '00:30',
                  end: '22:00',
                  minTime: formparams.begintime,
                }"
              >
              </el-time-select>
            </el-form-item>
            <el-form-item label="每节课时长" prop="classtime">
              <el-input
                style="width: 200px"
                v-model.number="formparams.classtime"
                placeholder="请输入单节课时长（分钟）"
              ></el-input
              > 分
            </el-form-item>
            <el-form-item label="教练简介" prop="info">
              <editor-bar
                v-model="formparams.info"
                :type="'infe'"
                :id="editTextObj.imgId"
                :delImgType="editTextObj.delImgType"
                @upDateText="upDateText"
              ></editor-bar>
              *提示*：为了更好的用户体验，图片请缩放至适合的宽度，文件大小不超过500kb。
            </el-form-item>
          </el-row>
          <el-form-item
            label="修改密码"
            prop="password"
            v-if="this.changeType == 3"
          >
            <el-input
              type="password"
              style="width: 200px"
              v-model="formparams.password"
              placeholder="请输入新密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="roleid" v-if="this.changeType == 1">
            <el-select v-model="formparams.roleid" placeholder="请选择">
              <el-option
                v-for="item in this.roles"
                :key="item.id"
                :label="item.remark"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上线状态" v-if="this.changeType != 3">
            <el-switch
              v-model="formparams.isWeb"
              active-value="1"
              inactive-value="0"
              active-text="上线"
              inactive-text="下线"
            >
            </el-switch>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button style="width: 100px" @click="resetForm('formparams')"
            >取 消</el-button
          >
          <el-button
            style="width: 100px"
            v-if="this.changeType == 2"
            type="primary"
            @click="submitFormTeach('formparams')"
            >确 定</el-button
          >
          <el-button
            style="width: 100px"
            v-else
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
          height="69vh"
          border
          stripe
        >
          <el-table-column label="序号" type="index" width="50">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="130"></el-table-column>
          <el-table-column label="所属场馆" width="130">
            <template slot-scope="scope">
              <div v-if="scope.row.shopNum">
                {{ getShopName(scope.row.shopNum) }}
              </div>
              <div v-else>管理中心</div>
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            prop="phone"
            label="联系电话"
          ></el-table-column>
          <el-table-column label="员工角色">
            <template slot-scope="scope">
              <div v-if="scope.row.role">{{ scope.row.role }}</div>
              <div v-else>未配置</div>
            </template>
          </el-table-column>
          <el-table-column label="角色类型">
            <template slot-scope="scope">
              <div v-if="scope.row.roletype == 0">教练</div>
              <div v-if="scope.row.roletype == 1">会籍</div>
              <div v-if="scope.row.roletype == 2">店长</div>
              <div v-if="scope.row.roletype == 3">董事长</div>
              <div v-if="scope.row.roletype == 4">会籍主管</div>
              <div v-if="scope.row.roletype == 5">教练主管</div>
              <div v-if="scope.row.roletype == null">未设置</div>
            </template>
          </el-table-column>
          <el-table-column label="教练信息">
            <template slot-scope="scope">
              <el-popover
                trigger="hover"
                placement="top"
                width="300px"
                v-if="scope.row.roletype == 0 || scope.row.roletype == 5"
              >
                <div class="menuTree">
                  <div>
                    上课时间： {{ scope.row.begintime }} - {{ scope.row.endtime }}
                  </div>
                  <div>每节课时长（分）： {{ scope.row.classtime }}</div>
                </div>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">查看详情</el-tag>
                </div>
              </el-popover>
              <div v-else>非教练</div>
            </template>
          </el-table-column>
          <el-table-column prop="inday" label="注册时间"></el-table-column>
          <el-table-column width="100" label="上线状态">
            <template slot-scope="scope">
              <div v-if="scope.row.isWeb == 1">上线</div>
              <div v-if="scope.row.isWeb == 0">下线</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-row>
                <el-button
                  type="success"
                  size="small"
                  @click="editRole(scope.row)"
                  >配置角色</el-button
                >
                <el-button
                  type="warning"
                  size="small"
                  @click="editPassword(scope.row)"
                  >修改密码</el-button
                >
              </el-row>
              <el-row style="margin-top: 10px">
                <el-button
                  type="info"
                  size="small"
                  v-if="scope.row.roletype == 0 || scope.row.roletype == 5"
                  @click="restInfo(scope.row)"
                  >休息设置</el-button
                >
                <el-button
                  type="primary"
                  size="small"
                  v-if="scope.row.roletype == 0 || scope.row.roletype == 5"
                  @click="edit(scope.row)"
                  >编&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;辑</el-button
                >
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
       <!-- 分页 -->
      <el-row>
        <el-col :offset="14" :span="10">
          <el-pagination
            style="float: right; margin-top: 20px"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[20, 40, 80, 100]"
            :page-size="20"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getShops, getInfERole, getInfEInfo, getEJtInfo, updateEUserRole, updateEUserPassword, updateEJtInfo } from '../../api/index'
import EditorBar from "../../components/wangEnduitNew";
import config from "../../configUrl.json";
export default {
  data() {
    return {
      imgURL: config.imgURL,
      loading: true,
      dialogVisible: false,
      hideUpload: false,
      showShop: false,
      shopList: [],
      shopListAll: JSON.parse(sessionStorage.getItem("shopListAll")),
      roles: [], //角色
      types: [
        { label: "教练", value: 0 },
        { label: "会籍", value: 1 },
        { label: "店长", value: 2 },
        { label: "董事长", value: 3 },
        { label: "会籍主管", value: 4 },
        { label: "教练主管", value: 5 },
      ],
      changeType: 1,
      queryParams: {
        name: null,
        shopNum: null,
        pageSize: 20,
        pageNo: 1,
        mobile: null,
        roleType: "",
      },
      password: "",
      formparams: {
        begintime: "",
        endtime: "",
        id: "",
        classtime: "",
        shopNum: "",
        info: "",
        isWeb: "", //1上线0是下线
        // role:'',
        eid: null,
        roleid: "",
        password: null,
      },
      newData: "",
      rules: {
        info: [{ required: true, message: "请输入教练信息", trigger: "blur" }],
        classtime: [
          { required: true, message: "上课时长" },
          { type: "number", message: "上课时长必须为数字值" },
        ],
        roleid: [{ required: true, message: "请选择角色", trigger: "change" }],
        password: [
          {
            required: true,
            min: 6,
            max: 10,
            message: "请输入6-10位字母数字结合的密码",
          },
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/,
            message: "请输入6-10位字母数字结合的密码",
            trigger: "change",
          },
        ],
      },
      formData: {},
      fileList: [], //图片回显示
      tableData: [],
      currentPage: 1,
      total: 0,
      editTextObj: {
        imgId: null,
        firstId: null,
        delImgType: false,
      },
    };
  },
  components: {
    EditorBar,
  },
  mounted() {
    this.getShopsList();
    if (this.$route.query.queryParams) {
      this.queryParams = JSON.parse(this.$route.query.queryParams);
    }
    this.getTableList();
  },
  methods: {
    // 给文本框重新赋子组件传来的值
    upDateText(data) {
      this.formparams.info = data;
    },
    queryList() {
      this.queryParams.pageNo = 1;
      this.currentPage = 1;
      this.getTableList();
    },
    //查询场馆类型
    getShopsList() {
      getShops({ isWeb: 1 }).then((res) => {
        this.shopList = res.data;
        sessionStorage.setItem("shopList", JSON.stringify(res.data));
        if (JSON.parse(sessionStorage.getItem("userinfo")).shopNum != null) {
          this.queryParams.shopNum = this.shopList[0].shopNum;
          this.showShop = false;
        } else {
          this.queryParams.shopNum = "";
          this.showShop = true;
        }
      });
    },
    //查询场馆下角色权限
    getInfERole(obj) {
      getInfERole({ shopNum: obj }).then((res) => {
        this.loading = false;
        this.roles = res.data;
      });
    },
    //查询所有员工数据
    getTableList() {
      getInfEInfo(this.queryParams).then((res) => {
        this.loading = false;
        this.tableData = res.data.info;
        this.total = res.data.total;
        if (this.queryParams.pageNo == "1" && res.data.info.length > 0) {
          //取列表的第一个id作为添加图片id
          this.editTextObj.firstId = res.data.info[0].id + "";
        }
      });
    },
    restInfo(row) {
      this.$router.push({
        path: "/configurable/teacherRest",
        query: {
          id: row.id,
          name: row.name,
          queryParams: JSON.stringify(this.queryParams),
        },
      });
    },
    //修改密码
    editPassword(row) {
      this.dialogVisible = true;
      this.changeType = 3;
      this.formparams.eid = row.id;
      this.clearForm("formparams");
    },
    //配置角色信息
    editRole(row) {
      this.dialogVisible = true;
      this.changeType = 1;
      this.formparams.eid = row.id;
      this.newData = row;
      this.formparams.isWeb = row.isWeb.toString();
      if (row.roleid) {
        this.formparams.roleid = parseInt(row.roleid);
      }
      this.getInfERole(row.shopNum);
      this.clearForm("formparams");
    },
    //编辑
    edit(row) {
      //编辑的时候查询一遍教练信息
      getEJtInfo({ id: row.id }).then((res) => {
        if (res.msg == "success") {
          this.changeType = 2;
          this.dialogVisible = true;
          this.formparams.shopNum = res.data.shopNum;
          this.formparams.id = res.data.id;
          this.editTextObj.imgId = res.data.id + "";
          this.formparams.isWeb = res.data.isWeb.toString();
          this.fileList = [];
          if (!this.fileList) {
            this.hideUpload = true;
          } else {
            this.hideUpload = false;
          }
          if (res.data.infEImage) {
            this.formparams.info = res.data.infEImage.info;
            this.fileList.push({
              url: this.imgURL + "/images/" + res.data.infEImage.imgurl,
            });
          } else {
            this.formparams.info = "";
            this.fileList = [];
          }

          this.formparams.begintime = res.data.begintime;
          this.formparams.endtime = res.data.endtime;
          this.formparams.classtime = res.data.classtime;
        } else {
          this.$message.error(res.data);
        }
      });
      this.clearForm("formparams");
    },
    handleRemove(fileList) {
      this.hideUpload = fileList.length >= this.fileList.length;
    },
    onChange(file, fileList) {
      this.hideUpload = fileList.length >= this.fileList.length;
    },
    uploadFile(file) {
      this.formData.append("uploadFile", file.file);
    },
    submitFormTeach(formparams) {
      this.$refs[formparams].validate((valid) => {
        if (this.$refs.upload.uploadFiles.length == 0) {
          this.$message.error("上传教练头像不能为空");
          return;
        } else {
          if (this.$refs.upload.uploadFiles[0].size / 1024 > 500) {
            this.$message.error("上传图片大小不能超过500kb");
            this.fileList = [];
            this.hideUpload = false;
            return;
          }
          if (this.$refs.upload.uploadFiles[0].name) {
            let nameARR = this.$refs.upload.uploadFiles[0].name.split(".");
            var re;
            re = /^[A-Za-z0-9]+$/g;
            if (!re.test(nameARR[0])) {
              this.$message.error("上传图片名称只能是数字字母组合");
              this.fileList = [];
              this.hideUpload = false;
              return;
            }
          }
        }
        if (valid) {
          this.formData = new FormData();
          this.$refs.upload.submit();
          this.formData.append("shopNum", this.formparams.shopNum);
          this.formData.append("id", this.formparams.id);
          if (this.newData.infEImage) {
            if (this.newData.infEImage.info != this.formparams.info) {
              this.formData.append("info", this.formparams.info);
            }
          } else {
            this.formData.append("info", this.formparams.info);
          }
          if (this.newData.begintime != this.formparams.begintime) {
            this.formData.append("begintime", this.formparams.begintime);
          }
          if (this.newData.endtime != this.formparams.endtime) {
            this.formData.append("endtime", this.formparams.endtime);
          }
          if (this.newData.classtime != this.formparams.classtime) {
            this.formData.append("classtime", this.formparams.classtime);
          }
          this.formData.append("isWeb", this.formparams.isWeb);
            updateEJtInfo(this.formData)
            .then((res) => {
              console.log(res)
              if (res.msg == "success") {
                this.$message({
                  type: "success",
                  message: "修改成功",
                });
              } else {
                this.$message.error(res.data);
              }
              this.dialogVisible = false;
              this.getTableList();
              this.editTextObj.delImgType = true; //删除文本框已删除的图片
            });
        } else {
          this.$message.error("请检查必填项");
          return false;
        }
      });
    },
    submitForm(formparams) {
      this.$refs[formparams].validate((valid) => {
        if (valid) {
          // roleid:null
          if (this.changeType == 1) {
            if (this.newData.isWeb == this.formparams.isWeb) {
              this.formparams.isWeb = null;
            }
            if (this.newData.roleid == this.formparams.roleid) {
              this.formparams.roleid = null;
            }
            updateEUserRole({
              eid: this.formparams.eid,
              roleid: this.formparams.roleid,
              isWeb: this.formparams.isWeb,
            }).then((res) => {
              if (res.msg == "success") {
                this.$message({
                  type: "success",
                  message: "配置成功",
                });
              } else {
                this.$message.error(res.data);
              }
              this.dialogVisible = false;
              this.getTableList();
            });
          } else if (this.changeType == 3) {
            this.password = this.formparams.password;
            var eles = [];
            eles.push(this.password);
            this.password = this.common.encode("0x12", eles);
            updateEUserPassword({
              eid: this.formparams.eid,
              password: this.password,
            }).then((res) => {
              if (res.msg == "success") {
                this.$message({
                  type: "success",
                  message: "修改成功",
                });
              } else {
                this.$message.error(res.data);
              }
              this.dialogVisible = false;
              this.getTableList();
            });
          }
        } else {
          this.$message.error("请检查必填项");
          return false;
        }
      });
    },
    clearForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
    },
    //分页
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.queryParams.pageNo = 1;
      this.currentPage = 1;
      this.getTableList();
    },
    handleCurrentChange(val) {
      this.queryParams.pageNo = val;
      this.getTableList();
    },
    //取消
    resetForm(formparams) {
      this.dialogVisible = false;
      this.$refs[formparams].clearValidate();
    },
    // 筛选分店名
    getShopName(shopNum) {
      let shopList = JSON.parse(sessionStorage.getItem('shopList'))
      let element = shopList.find(item => item.shopNum == shopNum)
      if (element) {
        return element.name
      }
    }
  },
};
</script>
<style scoped lang="scss">
</style>