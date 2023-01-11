<template>
  <div id="buyTicket">
    <el-card class="box-card">
      <el-row :gutter="20" style="margin-bottom:20px;">
        <el-col :span="4" v-if="showShop">
          <el-select
            size="small"
            class="w150 mr20"
            v-model="params.shopNum"
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
          <el-input
            size="small"
            class="w150"
            placeholder="请输入票名"
            v-model="params.name"
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
            @click="queryList"
            >查询</el-button
          >
        </el-col>
        <el-col :span="2" :offset="showShop ? 12 : 16">
          <el-button
            style="float:right;"
            size="small"
            type="success"
            icon="el-icon-circle-plus-outline"
            @click="showDialog"
            >新增</el-button
          >
        </el-col>
      </el-row>
      <el-row class="tableList">
        <el-table :data="tableData" height="69vh" border stripe v-loading="loading">
          <el-table-column label="序号" type="index" width="50">
          </el-table-column>
          <el-table-column label="场馆">
            <template slot-scope="scope">
              <div v-if="scope.row.shopnum">
                {{ getShopName(scope.row.shopnum) }}
              </div>
              <div v-else>管理中心</div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="票名称"></el-table-column>
          <el-table-column prop="price" label="价格"></el-table-column>
          <el-table-column prop="number" label="总数量"></el-table-column>
          <el-table-column label="使用星期">
          <template slot-scope="scope">
            <span v-if="scope.row.ticketConfig">{{
              scope.row.ticketConfig.usetime
            }}</span>
          </template>
        </el-table-column>
          <el-table-column label="使用时间">
            <template
              slot-scope="scope"
              v-if="scope.row.ticketConfig && scope.row.ticketConfig.bigintime"
            >
              {{ scope.row.ticketConfig.bigintime.slice(0,5) }} -
              {{ scope.row.ticketConfig.endtime.slice(0,5) }}
            </template>
        </el-table-column>
          <el-table-column width="230" label="操作">
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
                @click="removeList(scope.row.id)"
                v-show="scope.row.type == 1"
                >下架</el-button
              >
              <el-button
                size="small"
                type="success"
                @click="addList(scope.row.id)"
                v-show="scope.row.type != 1"
                >上架</el-button
              >
              <el-button size="small" type="warning" icon="el-icon-setting" @click="gobackTicket(scope.row)"
                >退款</el-button
              >
              <el-button
                style="margin: 10px 0"
                size="small"
                type="warning"
                icon="el-icon-setting"
                @click="goCardTicket(scope.row)"
                >会员卡购票</el-button
              >
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
import { getShops, getOnlineTicketInfo } from '../../api/index'

export default {
  name: 'buyTicket',
  data() {
    return {
      loading: true,
      showShop: false,
      shopList: [],
      params: {
        shopNum: '',
        name: '',
        pageNo: 1,
        pageSize: 20
      },
      tableData: [],
      total: 0,
      currentPage: 1,
      addType: 1,
      dialogVisible: false,
    }
  },
  mounted() {
    this.getShopsList()
    this.getTableList()
  },
  methods: {
    //查询场馆类型
    getShopsList() {
      getShops({ isWeb: 1 }).then((res) => {
        this.shopList = res.data;
        sessionStorage.setItem("shopList", JSON.stringify(res.data));
        if (JSON.parse(sessionStorage.getItem("userinfo")).shopNum != null) {
          this.params.shopNum = this.shopList[0].shopNum;
          this.showShop = false;
        } else {
          this.params.shopNum = "";
          this.showShop = true;
        }
      });
    },
    queryList() {
      this.params.pageNo = 1
      this.currentPage = 1
      this.getTableList()
    },
    showDialog() {

    },
    async getTableList() {
      this.loading = true
      const res = await getOnlineTicketInfo(this.params)
      this.loading = false
      if (res.msg === "success") {
        this.tableData = res.data.info
        this.total = res.data.total
      } else {
        this.$message.error(res.data)
      }
    },
    gobackTicket(row) {
      this.$router.push({
        path: "/buyTicket/backticket",
        query: {
          shortName: row.shortName,
          type: 4,
          shopNum: row.shopnum,
          name: row.name,
          queryParams: JSON.stringify(this.params)
        }
      })
    },
    goCardTicket(row) {
      this.$router.push({
        path: "/buyTicket/cardticket",
        query: { shopNum: row.shopnum, name: row.name, id: row.id }
      })
    },
    // 分页
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.params.pageNo = 1;
      this.currentPage = 1;
      this.getTableList();
    },
    handleCurrentChange(val) {
      this.params.pageNo = val;
      this.getTableList();
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

</style>
