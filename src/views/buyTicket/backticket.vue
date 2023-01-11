<template>
  <div id="backticket">
    <el-card class="box-card">
      <el-row style="margin-bottom:20px;">
        <el-col :span="2">
          <el-button class="goBack" size="small" @click="goback()" icon="el-icon-arrow-left"
            >返回上一级</el-button
          >
        </el-col>
        <el-col :span="2" :offset="20">
          <el-button
            style="float:right;"
            size="small"
            type="success"
            icon="el-icon-circle-plus-outline"
            @click="showDialog()"
            >新增</el-button
          >
        </el-col>
      </el-row>
      <el-row class="tableList">
        <el-table
          v-loading="loading"
          :data="tableData"
          height="75vh"
          border
          stripe
        >
          <el-table-column label="序号" type="index" width="50">
          </el-table-column>
          <el-table-column label="场馆">
            <template slot-scope="scope">
              <div>{{ getShopName(scope.row.shopnum) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="票名称">
            <template>
              <div>{{ name }}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="退票类型">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.ifBeforeOpen=='1'">开场前</span>
                <span v-if="scope.row.ifBeforeOpen=='0'">开场后</span>
              </div>
            </template>
          </el-table-column> -->
          <el-table-column label="取消预约时间">
            <template slot-scope="scope">
              <div>
                <span>{{ scope.row.canceltime }}</span>
                <span v-if="scope.row.cancleTimeType == 0">天</span>
                <span v-if="scope.row.cancleTimeType == 1">小时</span>
                <span v-if="scope.row.cancleTimeType == 2">分钟</span>
                <span v-if="scope.row.cancleTimeType == 3">当天</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="退款百分比">
            <template slot-scope="scope">
              <div>{{ scope.row.refundPercentage }}</div>
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
    <el-dialog title="退票配置" :visible.sync="dialogVisible" width="600px">
      <el-form
        :model="formparams"
        :rules="rules"
        ref="formparams"
        label-width="150px"
      >
        <!-- <el-form-item label="退票类型" prop="ifBeforeOpen">
          <el-radio-group v-model="formparams.ifBeforeOpen">
            <el-radio label="1">开场前</el-radio>
            <el-radio label="0">开场后</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="退票时长" prop="canceltime"  v-if="formparams.ifBeforeOpen=='1'">
          <el-input
            v-model.number="formparams.canceltime"
            placeholder="请输入取消预约时长"
          ></el-input>
        </el-form-item>
        <el-form-item label="退票时间类型" prop="cancleTimeType" v-if="formparams.ifBeforeOpen=='1'">
          <el-select v-model="formparams.cancleTimeType" placeholder="请选择">
            <el-option
              v-for="item in this.timetypes"
              :key="item.value"
              :label="item.lable"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退票时间类型" prop="cancleTimeType" v-if="formparams.ifBeforeOpen=='0'">
          <el-select v-model="formparams.cancleTimeType" placeholder="请选择">
            <el-option label="当天" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="是否审批">
          <el-switch
            v-model="formparams.ifApprove"
            active-value="1"
            inactive-value="0"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </el-form-item> -->
        <el-form-item label="退款百分比" prop="refundPercentage">
          <el-input
            class="w220"
            v-model.number="formparams.refundPercentage"
            maxlength="3"
            placeholder="请输入退款百分比(1-100)"
          ></el-input>
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
import { getTbAppointConfig, insertTbAppointConfig, updateTbAppointConfig, deleteTbAppointConfig } from '../../api/index'
export default {
  name: 'backticket',
  data() {
    return {
      loading: true,
      tableData: [],
      formparams: {
        canceltime: "",
        ifBeforeOpen: '1',
        cancleTimeType: "",
        refundPercentage: "",
        ifApprove: "0",
        type: this.$route.query.type,
        shortName: this.$route.query.shortName,
        shopNum: this.$route.query.shopNum,
      },
      rules: {
        timetype: [
          { required: true, message: "请选择时间类型", trigger: "change" },
        ],
        canceltime: [
          { required: true, message: "请输入取消预约时长", trigger: "blur" },
          { type: "number", min: 1, message: "取消预约时长必须大于0的数字" },
        ],
        cancleTimeType: [
          { required: true, message: "请选择时间类型", trigger: "change" },
        ],
        refundPercentage: [
          { required: true, message: "请输入1-100的数字", trigger: "blur" },
          {
            type: "number",
            min: 1,
            max: 100,
            message: "百分比必须1-100的数字",
          },
        ],
      },
      addType: 1,
      dialogVisible: false,
      name: this.$route.query.name,
      timetypes: [
        { lable: "天", value: 0 },
        { lable: "小时", value: 1 },
        { lable: "分钟", value: 2 },
      ],
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    goback() {
      this.$router.go(-1)
    },
    async getTableList() {
      let obj = {
        shortName: this.$route.query.shortName,
        type: this.$route.query.type,
        shopNum: this.$route.query.shopNum,
      }
      const res = await getTbAppointConfig(obj)
      this.loading = false
      if (res.msg == "success") {
        this.tableData = res.data
      }
    },
    showDialog() {
      this.dialogVisible = true
      this.addType = 1
      this.formparams.canceltime = ""
      this.formparams.ifBeforeOpen = "1"
      this.formparams.cancleTimeType = ""
      this.formparams.refundPercentage = ""
      this.formparams.ifApprove = "0"
    },
    // 编辑
    edit(row) {
      this.addType = 2
      this.dialogVisible = true
      this.formparams.id = row.id
      this.formparams.canceltime = row.canceltime
      this.formparams.ifBeforeOpen = row.ifBeforeOpen || '1'
      this.formparams.cancleTimeType = row.cancleTimeType
      this.formparams.type = this.type
      this.formparams.refundPercentage = row.refundPercentage
      this.formparams.ifApprove = row.ifApprove
      this.formparams.shopNum = row.shopnum
    },
    submitForm(formparams) {
      this.$refs[formparams].validate(async (valid) => {
        if (valid) {
          if (this.addType == 1) {
            const res = await insertTbAppointConfig(this.formparams)
            if (res.msg === "success") {
              this.$message.success("添加成功")
              this.dialogVisible = false
              this.getTableList()
            } else {
              this.$message.error(res.data)
            }
          } else {
            const res = await updateTbAppointConfig(this.formparams)
            if (res.msg === "success") {
              this.$message.success("修改成功")
              this.dialogVisible = false
              this.getTableList()
            } else {
              this.$message.error(res.data)
            }
          }
        } else {
          return this.$message.error("请检查必填项")
        }
      })
    },
    resetForm(formparams) {
      this.dialogVisible = false
      this.$refs[formparams].clearValidate()
    },
    remove(row) {
      this.$confirm("此操作将删除当前数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await deleteTbAppointConfig({ id: row.id })
        if (res.msg === "success") {
          this.$message.success("删除成功")
          this.getTableList()
        } else {
          this.$message.error(res.data)
        }
      })
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
.el-select {
  width: 100%;
}
</style>
