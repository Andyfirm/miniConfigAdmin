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
            <template>
              <div>{{ getShopName(shopNum) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="票名称">
            <template>
              <div>{{ name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="会员卡" prop="cardName"></el-table-column>
          <el-table-column label="数量" prop="buyNum"></el-table-column>
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
    <el-dialog
      title="会员卡购票配置"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <el-form
        :model="formparams"
        :rules="rules"
        ref="formparams"
        label-width="150px"
      >
        <el-form-item label="会员卡" prop="cardShortName">
          <el-select
            v-model="formparams.cardShortName"
            placeholder="请选择会员卡"
            :disabled="addType == 2"
          >
            <el-option
              v-for="item in this.cardList"
              :key="item.value"
              :label="item.name"
              :value="item.shortname"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开启人脸验证">
          <!-- isPurchase  0 否  1是 -->
          <el-switch
            v-model="formparams.IfFace"
            active-value="1"
            inactive-value="0"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="每日可购数量" prop="buyNum">
          <el-input
            class="w220"
            v-model.number="formparams.buyNum"
            placeholder="请输入每日可购数量"
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
import { getInfCs, getTbCardTicket, insertTbCardTicket, updateTbCardTicket, deleteTbCardTicket } from '../../api/index'
export default {
  name: 'backticket',
  data() {
    return {
      loading: true,
      tableData: [],
      formparams: {
        ticketId: this.$route.query.id,
        buyNum: "",
        cardShortName: "",
        IfFace: "0",
      },
      name: this.$route.query.name,
      shopNum: this.$route.query.shopNum,
      rules: {
        buyNum: [
          { required: true, message: "请输入可购买数量", trigger: "blur" },
          { type: "number", min: 1, message: "可购买数量必须大于0的数字" },
        ],
        cardShortName: [
          { required: true, message: "请选择会员卡", trigger: "change" },
        ],
      },
      addType: 1,
      dialogVisible: false,
      cardList: []
    }
  },
  mounted() {
    this.getTableList()
    this.getInfCs()
  },
  methods: {
    goback() {
      this.$router.go(-1)
    },
    async getTableList() {
      let obj = {
        ticketId: this.$route.query.id
      }
      const res = await getTbCardTicket(obj)
      this.loading = false
      if (res.msg == "success") {
        this.tableData = res.data
      }
    },
    async getInfCs() {
      const res = await getInfCs({ shopNum: this.$route.query.shopNum })
      if (res.msg == "success") {
        this.cardList = res.data
      }
    },
    showDialog() {
      this.dialogVisible = true
      this.addType = 1
      this.formparams.cardShortName = ""
      this.formparams.buyNum = ""
      this.formparams.IfFace = "0"
    },
    // 编辑
    edit(row) {
      this.addType = 2
      this.dialogVisible = true
      this.formparams.id = row.id
      this.formparams.id = row.id
      this.formparams.cardShortName = row.cardShortName
      this.formparams.buyNum = row.buyNum
      this.formparams.IfFace = row.ifFace
    },
    submitForm(formparams) {
      this.$refs[formparams].validate(async (valid) => {
        if (valid) {
          this.cardList.forEach((item) => {
            if (this.formparams.cardShortName === item.shortname) {
              this.formparams.cardName = item.name
            }
          })
          if (this.addType == 1) {
            const res = await insertTbCardTicket(this.formparams)
            if (res.msg === "success") {
              this.$message.success("添加成功")
              this.dialogVisible = false
              this.getTableList()
            } else {
              this.$message.error(res.data)
            }
          } else {
            const res = await updateTbCardTicket(this.formparams)
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
        const res = await deleteTbCardTicket({ id: row.id })
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
