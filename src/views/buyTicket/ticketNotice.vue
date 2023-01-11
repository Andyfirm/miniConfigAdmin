<template>
  <div id="ticketNotice">
    <el-card class="box-card">
      <el-form
        :model="formparams"
        :rules="rules"
        ref="formparams"
        label-width="50px"
      >
        <el-row>
          <el-col :span="4">
            <el-form-item label="状态">
              <el-switch
                v-model="formparams.type"
                active-value="1"
                inactive-value="0"
                active-text="上架"
                inactive-text="下架"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="是否开启强制阅读" label-width="160px">
              <el-switch
                v-model="formparams.ifOpen"
                active-value="1"
                inactive-value="0"
                active-text="是"
                inactive-text="否"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="阅读时长（秒）"
              label-width="160px"
              prop="duration"
              v-if="formparams.ifOpen == '1'"
            >
              <el-input
                class="w220"
                v-model.number="formparams.duration"
                placeholder="请输入阅读时长（秒）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" :offset="formparams.ifOpen == '1' ? 5 : 13">
            <el-button class="button" style="float:right;" type="success" size="medium" @click="submitForm('formparams')"
              >保存</el-button
            >
          </el-col>
        </el-row>
        <editor-bar
          v-model="formparams.info"
          @upDateText="upDateText"
        ></editor-bar>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getSaleTicketExplanation, updateSaleTicketExplanation } from '../../api/index'
import EditorBar from "../../components/wangEnduitNew.vue"

export default {
  name: 'ticketNotice',
  data() {
    return {
      formparams: {
        type: "0",
        ifOpen: "0",
        duration: null,
        info: "",
      },
      rules: {
        duration: [{ required: true, message: "时长不能为空" }],
      },
    }
  },
  components: {
    EditorBar
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    upDateText(data) {
      this.formparams.info = data
    },
    async getInfo() {
      const res = await getSaleTicketExplanation(this.formparams)
      if (res.msg === "success") {
        if (res.data) {
          this.formparams.type = res.data.type
          this.formparams.info = res.data.info
          this.formparams.ifOpen = res.data.ifOpen
          this.formparams.duration = res.data.duration
          this.formparams.id = res.data.id
        }
      } else {
        this.$message.error(res.data)
      }
    },
    submitForm(formparams) {
      this.$refs[formparams].validate(async (valid) => {
        if (valid) {
          if (this.formparams.duration && this.formparams.duration <= 0) return this.$message.error("请输入正确的时长")
          const res = await updateSaleTicketExplanation(this.formparams)
          if (res.msg === "success") {
              this.$message({
                type: "success",
                message: "保存成功"
              });
            } else {
              this.$message.error(res.data)
            }
        }
      })
    }
  }
}
</script>

<style lang="scss">
#ticketNotice {
  .edit_container {
    width: 100%;
  }
  .ql-container.ql-snow {
    max-height: 67vh;
    height: 67vh;
  }
}
</style>