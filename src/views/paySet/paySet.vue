<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-row class="tableList" style="height:82vh">
        <el-row style="margin-bottom:20px;">
          <el-col :span="2">
            <el-button class="goBack" size="small" @click="goback()" icon="el-icon-arrow-left"
              >返回上一级</el-button
            >
          </el-col>
        </el-row>
        <el-tabs v-model="activeName">
          <el-tab-pane label="支付宝" name="zfb">
            <el-row>
              <el-col :offset="22" :span="2" style="margin-bottom:10px;">
                <el-button size="small" style="float:right;" type="success" icon="el-icon-circle-plus-outline" @click="showDialogZFB()">新增</el-button>
              </el-col>
            </el-row>
            <el-row class="tableListZFB">
              <el-dialog title="支付宝设置"  :visible.sync="dialogVisibleZFB" width="1000px">
                <el-form :model="formparamsZFB" :rules="rules2" ref="formparamsZFB" label-width="120px">
                  <el-form-item label="选择场馆">
                    <el-select v-model="formparamsZFB.shopNum" clearable  placeholder="请选择场馆" :disabled="addTypeZFB==2">
                      <el-option
                      v-for="item in this.shopList"
                      :key="item.shopNum"
                      :label="item.name"
                      :value="item.shopNum"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="appId" prop="appid">
                    <el-input v-model="formparamsZFB.appid" placeholder="请输入appId"></el-input>
                  </el-form-item>
                  <el-form-item label="支付宝id" prop="pid">
                    <el-input v-model="formparamsZFB.pid" placeholder="请输入支付宝id"></el-input>
                  </el-form-item>
                  <el-form-item label="应用公钥" prop="publicKey">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 6}"
                      v-model="formparamsZFB.publicKey"
                      placeholder="请输入应用公钥"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="应用私钥" prop="privateKey">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 6}"
                      v-model="formparamsZFB.privateKey"
                      placeholder="请输入应用私钥"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="支付宝公钥" prop="alipayPublicKey">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 6}"
                      v-model="formparamsZFB.alipayPublicKey"
                      placeholder="请输入支付宝公钥"
                    ></el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button style="width:100px"  @click="resetForm('formparams')">取 消</el-button>
                    <el-button style="width:100px"  type="primary" @click="insertZFBPayConfig('formparamsZFB')" v-if="addTypeZFB==1">确 定</el-button>
                    <el-button style="width:100px"  type="primary" @click="submitChangeZFB('formparamsZFB')" v-else>确 定</el-button>
                </span>
              </el-dialog>
              <el-table v-loading="loading" :data="tableListZFB" height="63vh" border stripe>
                <el-table-column prop="clubMemberCode" label="数据源"></el-table-column>
                <el-table-column label="场馆">
                  <template slot-scope="scope">
                    <div v-if="!scope.row.shopNum">通用</div>
                    <div v-else> {{scope.row.shopNum|caseType}} </div>
                  </template>
                </el-table-column>
                <el-table-column prop="appid" label="appid"></el-table-column>
                <el-table-column prop="pid" label="支付宝id"></el-table-column>
                <el-table-column prop="publickey" label="应用公钥"></el-table-column>
                <el-table-column prop="privatekey" label="应用私钥"></el-table-column>
                <el-table-column prop="alipayPublicKey" label="支付宝公钥"></el-table-column>
                <el-table-column label="操作" width="80">
                  <template slot-scope="scope">
                    <el-button size="small" type="primary" :disabled="scope.row.classId" @click="editZFB(scope.row)">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="微信" name="wx">
            <el-row>
              <el-col :offset="22" :span="2" style="margin-bottom:10px;">
                <el-button style="float:right;" size="small" type="success" icon="el-icon-circle-plus-outline" @click="showDialogWX()">新增</el-button>
              </el-col>
            </el-row>
            <el-row class="tableListWX">
              <el-dialog title="微信设置"  :visible.sync="dialogVisibleWX" width="1000px">
                <el-form :model="formparams" :rules="rules" ref="formparams" label-width="120px">
                  <el-form-item label="选择场馆">
                    <el-select v-model="formparams.shopNum" clearable  placeholder="请选择场馆" :disabled="addTypeWX==2">
                      <el-option
                      v-for="item in this.shopList"
                      :key="item.shopNum"
                      :label="item.name"
                      :value="item.shopNum"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="appId" prop="appid">
                    <el-input v-model="formparams.appid" placeholder="请输入appId"></el-input>
                  </el-form-item>

                  <el-form-item label="app密码" prop="appsecret">
                    <el-input v-model="formparams.appsecret" placeholder="请输入app密码"></el-input>
                  </el-form-item>
                  <el-form-item label="apiKey" prop="apikey">
                    <el-input v-model="formparams.apikey" placeholder="请输入api密钥"></el-input>
                  </el-form-item>
                  <el-form-item label="商户ID" prop="mchid">
                    <el-input v-model="formparams.mchid" placeholder="请输入商户ID"></el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button style="width:100px"  @click="resetFormWX('formparams')">取 消</el-button>
                    <el-button style="width:100px"  type="primary" @click="submitFormWx('formparams')" v-if="addTypeWX==1">确 定</el-button>
                    <el-button style="width:100px"  type="primary" @click="submitChangeWx('formparams')" v-else>确 定</el-button>
                </span>
              </el-dialog>
              <el-table v-loading="loading" :data="tableListWX" height="63vh" border stripe>
                <el-table-column prop="clubMemberCode" label="数据源"></el-table-column>
                <el-table-column label="场馆">
                  <template slot-scope="scope">
                    <div v-if="!scope.row.shopNum">通用</div>
                    <div v-else> {{scope.row.shopNum|caseType}} </div>
                  </template>
                </el-table-column>
                <el-table-column prop="appid" label="appid"></el-table-column>
                <el-table-column prop="appsecret" label="app密码"></el-table-column>
                <el-table-column prop="apikey" label="api密钥"></el-table-column>
                <el-table-column prop="mchid" label="商户ID"></el-table-column>
                <el-table-column label="操作" width="80">
                  <template slot-scope="scope">
                    <el-button size="small" type="primary" :disabled="scope.row.classId" @click="editWX(scope.row)">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="美团" name="mt">
            <el-col :span="10">
            <h4 style="text-align:center;margin:40px 0 20px;">美团支付设置</h4>
            <el-form :model="formparamsMT" :rules="rules3" ref="formparamsMT" label-width="100px">
              <el-form-item label="门店ID" prop="merchantId">
                <el-input v-model="formparamsMT.merchantId" placeholder="请输入门店ID"></el-input>
              </el-form-item>
              <el-form-item label="门店名称" prop="merchantName">
                <el-input v-model="formparamsMT.merchantName" placeholder="请输入门店名称"></el-input>
              </el-form-item>
              <el-col style="text-align:center">
                <span class="dialog-footer">
                  <!-- <el-button style="width:100px"  @click="resetForm('formparams')">取 消</el-button> -->
                  <el-button
                    size="small"
                    v-if="!mtData"
                    type="primary"
                    @click="addMerchant('formparamsMT')"
                  >新 增</el-button>
                  <el-button
                    size="small"
                    v-if="mtData"
                    type="primary"
                    @click="modifyMerchant('formparamsMT')"
                  >保 存</el-button>
                </span>
              </el-col>
            </el-form>
          </el-col>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-card>
  </div>
</template>

<script>
let that;
import {
  getPayConfig,
  insertWxPayConfig,
  updateWxPayConfig,
  insertZFBPayConfig,
  updateZFBPayConfig,
  getSourceShops,
  addMerchant,
  getMerchant,
  modifyMerchant
} from "../../api/index";
export default {
  data() {
    return {
      activeName: 'zfb',
      tableListZFB: [],
      tableListWX: [],
      tableListMT: [], 
      shopNum: null,
      loading: false,
      dialogVisibleZFB: false,
      dialogVisibleWX: false,
      clubMemberCode: "",
      date: [], //开始时间结束时间
      rules: {
        shopNum:[
          { required: true, message: '请选择场馆', trigger: 'change' }
        ],
        appid: [{ required: true, message: "请输入appID", trigger: "blur" }],
        appsecret: [
          { required: true, message: "请输入app密码", trigger: "blur" }
        ],
        apikey: [{ required: true, message: "请输入app密钥", trigger: "blur" }],
        mchid: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { pattern: /^\d/, message: "请输入正确的格式", trigger: "blur" }
        ]
      },
      rules2: {
        shopNum:[
          { required: true, message: '请选择场馆', trigger: 'change' }
        ],
        appid: [{ required: true, message: "请输入appID", trigger: "blur" }],
        pid: [{ required: true, message: "请输入支付宝id", trigger: "blur" }],
        publicKey: [
          { required: true, message: "请输入应用公钥", trigger: "blur" }
        ],
        privateKey: [
          { required: true, message: "请输入应用私钥", trigger: "blur" }
        ],
        alipayPublicKey: [
          { required: true, message: "请输入支付宝公钥", trigger: "blur" }
        ]
      },
      rules3: {
          shopNum:[
          { required: true, message: '请选择场馆', trigger: 'change' }
        ],
        merchantId: [{ required: true, message: "请输入门店ID", trigger: "blur" }],
        merchantName: [{ required: true, message: "请输入门店名称", trigger: "blur" }]
      },
      timeList: [],
      addTypeZFB: 1,
      addTypeWX: 1,
      wxData: false,
      zfbData: false,
      mtData: false,
      formparams: {
        type: 'xcx',
        shopNum: null,
        appid: "",
        appsecret: "",
        mchid: "",
        apikey: "",
        clubMemberCode: this.$route.query.clubMemberCode
      },
      formparamsZFB: {
        type: 'xcx',
        shopNum: null,
        appid: "",
        pid: "",
        publicKey: "",
        privateKey: "",
        alipayPublicKey: "",
        clubMemberCode: this.$route.query.clubMemberCode
      },
      formparamsMT: {
        type: 'xcx',
        merchantId: '',
        merchantName: '',
        clubMemberCode: this.$route.query.clubMemberCode
      },
      //票列表
      tableData: [],
      //票类型
      options: [],
      titleList: [],
      //场馆列表
      shopList: [],
      total: 0,
      currentPage: 1,
      params: {
        page: 1,
        size: 20
      }
    };
  },
  filters: {
    caseType(value) {
      if (
        that.shopList.find(i => {
          return i.shopNum == value;
        })
      ) {
        return that.shopList.find(i => {
          return i.shopNum == value;
        }).name;
      }
    }
  },
  beforeCreate() {
    that = this;
  },
  created() {
    this.clubMemberCode = this.$route.query.clubMemberCode;
    this.getSourceShops()
  },
  mounted() {
    this.getTableList()
  },
  methods: {
     showDialogZFB(){
      this.dialogVisibleZFB =true
      this.addTypeZFB = 1
      this.formparamsZFB.id = null;
      this.formparamsZFB.shopNum = null;
      this.formparamsZFB.appid = null;
      this.formparamsZFB.pid = null;
      this.formparamsZFB.publicKey = null;
      this.formparamsZFB.privateKey = null;
      this.formparamsZFB.alipayPublicKey =
        null;
    },
    //编辑
    editZFB(row){
      this.dialogVisibleZFB =true
      this.addTypeZFB = 2
      this.formparamsZFB.id = row.id;
      this.formparamsZFB.shopNum = row.shopNum;
      this.formparamsZFB.appid = row.appid;
      this.formparamsZFB.pid = row.pid;
      this.formparamsZFB.publicKey = row.publickey;
      this.formparamsZFB.privateKey = row.privatekey;
      this.formparamsZFB.alipayPublicKey =
        row.alipayPublicKey;
    },
    showDialogWX(){
      this.dialogVisibleWX =true
      this.addTypeWX = 1
      this.formparams.id = null;
      this.formparams.shopNum = null;
      this.formparams.appid = null;
      this.formparams.appsecret = null;
      this.formparams.apikey = null;
      this.formparams.mchid = null;
    },
    //编辑
    editWX(row){
      this.dialogVisibleWX =true
      this.addTypeWX = 2
      this.formparams.id = row.id;
      this.formparams.shopNum = row.shopNum;
       this.formparams.appid = row.appid;
      this.formparams.appsecret = row.appsecret;
      this.formparams.apikey = row.apikey;
      this.formparams.mchid = row.mchid;
    },
    getAll() {
      this.getMtTableList()
    },
    goback() {
      this.$router.go(-1);
    },
    //查询支付设置数据
    getTableList() {
      getPayConfig({ clubMemberCode: this.clubMemberCode, shopNum: this.shopNum, type: 'xcx' }).then(res => {
        if (res.msg == "success") {
          if (res.data.infWxconfig) {
            this.tableListWX = res.data.infWxconfig
            this.wxData = true;
          } else {
            this.wxData = false;
          }
          if (res.data.infZFBConfig) {
            this.tableListZFB = res.data.infZFBConfig
            this.zfbData = true;
          } else {
            this.zfbData = false;
          }
        }
      });
    },
    //查询美团支付设置数据
    getMtTableList() {
      getMerchant({ clubMemberCode: this.clubMemberCode, shopNum: this.shopNum, type: 'xcx' }).then(res => {
        if (res.msg == "success") {
          if (res.data) {
            this.formparamsMT.merchantId = res.data.merchantid
            this.formparamsMT.merchantName = res.data.merchantname
            this.mtData = true
          } else {
            this.mtData = false
          }
        }
      });
    },
    // 查询数据源场馆信息
    getSourceShops() {
      getSourceShops({ clubMemberCode: this.clubMemberCode, type: 'xcx' }).then(res => {
        this.shopList = res.data;
      })
    },
    //添加微信支付配置
    // insertWxPayConfig
    submitFormWx(formparams) {
      this.$refs[formparams].validate(valid => {
        if (valid) {
          insertWxPayConfig(this.formparams).then(res => {
            if (res.msg == "success") {
              this.$message({
                type: "success",
                message: "配置成功"
              });
              this.dialogVisibleWX=false
              this.getTableList();
            }
          });
        } else {
          this.$message.error("请检查必填项");
          return false;
        }
      });
    },
    //修改微信支付设置
    //POST /pay/updateWxPayConfig
    submitChangeWx(formparams) {
      this.$refs[formparams].validate(valid => {
        if (valid) {
          updateWxPayConfig(this.formparams).then(res => {
            if (res.msg == "success") {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.dialogVisibleWX=false
              this.getTableList();
            } else {
              this.$message.error("修改失败");
            }
          });
        } else {
          this.$message.error("请检查必填项");
          return false;
        }
      });
    },
    //添加支付宝支付配置
    insertZFBPayConfig(formparamsZFB) {
      this.$refs[formparamsZFB].validate(valid => {
        if (valid) {
          insertZFBPayConfig(this.formparamsZFB).then(res => {
            if (res.msg == "success") {
              this.$message({
                type: "success",
                message: "配置成功"
              });
              this.dialogVisibleZFB=false
              this.getTableList();
            }
          });
        } else {
          this.$message.error("请检查必填项");
          return false;
        }
      });
    },
    //修改支付宝支付设置
    submitChangeZFB(formparamsZFB) {
      this.$refs[formparamsZFB].validate(valid => {
        if (valid) {
          updateZFBPayConfig(this.formparamsZFB).then(res => {
            if (res.msg == "success") {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.dialogVisibleZFB=false
              this.getTableList();
            } else {
              this.$message.error("修改失败");
            }
          });
        } else {
          this.$message.error("请检查必填项");
          return false;
        }
      });
    },
     //添加美团支付配置
    addMerchant(formparamsMT) {
      this.$refs[formparamsMT].validate(valid => {
        if (valid) {
          addMerchant(this.formparamsMT).then(res => {
            if (res.msg == "success") {
              this.$message({
                type: "success",
                message: "配置成功"
              });
              this.getMtTableList();
            }
          });
        } else {
          this.$message.error("请检查必填项");
          return false;
        }
      });
    },
     //修改美团支付配置
    modifyMerchant(formparamsMT) {
      this.$refs[formparamsMT].validate(valid => {
        if (valid) {
          if(!this.shopNum) return this.$message.error("请先选择场馆");
          this.formparamsMT.shopNum = this.shopNum
          this.formparamsMT.status = 'update'
          modifyMerchant(this.formparamsMT).then(res => {
            if (res.msg == "success") {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.getMtTableList();
            }
          });
        } else {
          this.$message.error("请检查必填项");
          return false;
        }
      });
    },
    //取消
    resetForm(formparams) {
      this.dialogVisibleZFB = false;
      this.$refs[formparams].clearValidate();
    },
    //取消
    resetFormWX(formparams) {
      this.dialogVisibleWX = false;
      this.$refs[formparams].clearValidate();
    },
    //分页
    handleSizeChange(val) {
      this.params.size = val;
      this.params.page = 1;
      this.currentPage = 1;
    },
    handleCurrentChange(val) {
      this.params.page = val;
    }
  }
};
</script>

<style lang="scss">

</style>
