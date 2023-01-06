<template>
  <div id="shopList">
    <el-card class="box-card">
      <el-row class="tableList">
        <el-table
          v-loading="loading"
          :data="tableData"
          height="82vh"
          stripe
        >
          <el-table-column label="序号" type="index" width="50">
          </el-table-column>
          <el-table-column prop="name" label="场馆名称"></el-table-column>
          <el-table-column prop="imgaddress" label="场馆地址"  width="380"></el-table-column>
          <el-table-column
            prop="imgphone"
            label="场馆电话"
            width="120"
          ></el-table-column>
          <el-table-column label="场馆图片" width="80">
            <template slot-scope="scope">
              <img
                class="imgList"
                style="width: 50px; height: 30px"
                :src="imgURL + '/images/' + scope.row.shopImg"
                alt=""
              />
            </template>
          </el-table-column>
          <el-table-column label="场馆说明" width="100">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top" width="200px">
                <div
                  style="width: 200px"
                  class="imgInfoBox"
                  v-html="scope.row.venuedetails"
                ></div>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">场馆说明</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="当前状态" width="140">
            <template slot-scope="scope">
              <el-switch
                :value="scope.row.isWeb"
                :active-value="1"
                :inactive-value="0"
                active-text="上线"
                inactive-text="下线"
                disabled>
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="80" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="edit(scope.row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <el-dialog title="场馆信息" :visible.sync="dialogVisible" width="800px">
      <el-form :model="formparams" ref="formparams" label-width="100px">
        <el-row>
          <el-col :span="15">
            <el-form-item label="场馆名称">
              <el-input
                v-model="formparams.name"
                placeholder="请输入场馆名称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="客服电话">
              <el-input
                v-model="formparams.phone"
                placeholder="请输入客服电话"
                maxlength="50"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="上/下线">
          <el-switch
            v-model="formparams.isWeb"
            active-value="1"
            inactive-value="0"
            active-text="上线"
            inactive-text="下线"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="场馆图片" required ref="uploadElement" prop="">
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
          *提示*：图片请提供230*230像素，文件大小不超过500kb。
        </el-form-item>
        <el-form-item label="场馆说明">
          <editor-bar
            v-model="formparams.venuedetails"
            :type="'shop'"
            :id="editTextObj.imgId"
            :delImgType="editTextObj.delImgType"
            @upDateText="upDateText"
          ></editor-bar>
          *提示*：图片请缩放至适合的宽度，文件大小不超过500kb。
        </el-form-item>
        <el-row>
          <el-col :span="15">
            <el-form-item label="场馆地址">
              <el-input
                v-model="formparams.address"
                placeholder="请输入场馆详细地址方便场馆定位"
                style="width:375px;"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button
              type="success"
              icon="el-icon-search" circle
              size="mini"
              @click="searchKeyword"
              style="margin:6px 10px;"
              ></el-button
            >
          </el-col>
        </el-row>
        <div style="position: relative; width: 700px; margin: 0 auto">
          <div id="map"></div>
        </div>
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
import { getShops, updateShopsInfo } from '../../api/index'
import config from '../../configUrl.json'
import EditorBar from "../../components/wangEnduitNew.vue"
export default {
  name: 'shopList',
  data() {
    return {
      searchService: null,
      markers: [],
      imgURL: config.imgURL,
      loading: true,
      dialogVisible: false,
      hideUpload: false,
      tableData: [],
      formparams: {
        name: "",
        address: "",
        venuedetails: "",
        phone: "",
        shopNum: "",
        isWeb: "",
      },
      longitude: null,
      latitude: null,
      fileList: [],
      editTextObj: {
        imgId: '',
        delImgType: ''
      },
      newData: {}
    }
  },
  components: {
    EditorBar
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    async getTableList() {
      const res = await getShops()
      this.loading = false
      if (res.msg == "success") {
        this.tableData = res.data
        this.shopList = []
        sessionStorage.setItem("shopListAll", JSON.stringify(res.data))
        this.shopList = res.data.filter(item => item.isWeb == 1)
        sessionStorage.setItem("shopList", JSON.stringify(this.shopList))
      } else {
        this.$message.error(res.data)
      }
    },
    edit(row) {
      this.dialogVisible = true
      setTimeout(() => {
        this.initMap()
      }, 1000)
      this.editTextObj.imgId = row.id + ''
      this.formparams.name = row.name || ''
      this.formparams.address = row.imgaddress || ''
      this.formparams.venuedetails = row.venuedetails || ''
      this.formparams.phone = row.imgphone || ''
      this.formparams.shopNum = row.shopNum || ''
      this.formparams.isWeb = row.isWeb.toString()
      this.latitude = row.latitude || null
      this.longitude = row.longitude || null
      this.fileList = []
      if (row.shopImg) {
        this.fileList.push({ url: this.imgURL + "/images/" + row.shopImg })
        this.hideUpload = true;
      } else {
        this.hideUpload = false;
      }
    },
    // 给文本框重新赋子组件传来的值
    upDateText(data) {
      this.formparams.venuedetails = data
    },
    handleRemove(fileList) {
      this.hideUpload = fileList.length >= this.fileList.length
    },
    onChange(file, fileList) {
      this.hideUpload = fileList.length <= this.fileList.length
    },
    uploadFile(file) {
      this.formData.append("uploadFile", file.file)
    },
    initMap() {
      var address = "";
      let that = this;
      /* eslint-disable */
      var center = new qq.maps.LatLng(
        that.latitude || 39.916527,
        that.longitude || 116.397128
      );
      var map = new qq.maps.Map(document.getElementById("map"), {
        center: center,
        zoom: 13,
        disableDefaultUI: true,
      });
      var marker = new qq.maps.Marker({
        position: center,
        map: map,
      });
      var infoWin = new qq.maps.InfoWindow({
        map: map,
      });
      var geocoder = new qq.maps.Geocoder({
        complete: function (res) {
          console.log(res)
          address = res.detail.nearPois[0].name
        },
      });
      qq.maps.event.addListener(map, "click", function (event) {
        that.longitude = event.latLng.getLng()
        that.latitude = event.latLng.getLat()
        let lat = new qq.maps.LatLng(that.longitude, that.latitude)
        console.log(lat)
        geocoder.getAddress(lat)
        setTimeout(() => {
          infoWin.open()
          infoWin.setContent(
            '<div style="text-align:center;white-space:nowrap;">' +
              address +
              "</div>"
          );
          infoWin.setPosition(event.latLng)
        }, 200)
      })
      //设置Poi检索服务，用于本地检索、周边检索
      that.searchService = new qq.maps.SearchService({
        //设置Poi检索服务，用于本地检索、周边检索
        //检索成功的回调函数
        complete: function (results) {
          //设置回调函数参数
          if (!results.detail.pois) {
            console.log(results)
            return
          }
          console.log(results.detail.pois[0].latLng)
          that.longitude = results.detail.pois[0].latLng.lng
          that.latitude = results.detail.pois[0].latLng.lat
          var pois = results.detail.pois
          var infoWin = new qq.maps.InfoWindow({
            map: map,
          })
          var latlngBounds = new qq.maps.LatLngBounds();
          for (var i = 0, l = pois.length; i < l; i++) {
            var poi = pois[i]
            //扩展边界范围，用来包含搜索到的Poi点
            latlngBounds.extend(poi.latLng);
            (function (n) {
              var marker = new qq.maps.Marker({
                map: map,
              })
              marker.setPosition(pois[n].latLng)

              marker.setTitle(i + 1)
              qq.maps.event.addListener(marker, "click", function () {
                infoWin.open();
                infoWin.setPosition(pois[n].latLng)
              })
            })(i)
          }
          //调整地图视野
          map.fitBounds(latlngBounds)
        },
        //若服务请求失败，则运行以下函数
        error: function () {
          alert("出错了。")
        },
      });
    },
    submitForm(formparams) {
      this.$refs[formparams].validate(async (valid) => {
        if (this.$refs.upload.uploadFiles.length === 0) {
          this.$message.error("上传图片不能为空")
          return
        } else {
          if (this.$refs.upload.uploadFiles[0].size / 1024 > 500) {
            this.$message.error("上传图片大小不能超过500kb")
            this.fileList = []
            this.hideUpload = false
            return
          }
          if (this.$refs.upload.uploadFiles[0].name) {
            let nameARR = this.$refs.upload.uploadFiles[0].name.split(".")
            var re;
            re = /^[A-Za-z0-9]+$/g;
            if (!re.test(nameARR[0])) {
              this.$message.error("上传图片名称只能是数字字母组合")
              this.fileList = []
              this.hideUpload = false
              return
            }
          }
        }
        if (valid) {
          this.formData = new FormData()
          this.$refs.upload.submit()
          this.formData.append("shopNum", this.formparams.shopNum)
          if (
            this.formparams.name != "" &&
            this.newData.name != this.formparams.name
          ) {
            this.formData.append("name", this.formparams.name)
          }
          if (
            this.formparams.address != "" &&
            this.newData.imgaddress != this.formparams.address
          ) {
            this.formData.append("address", this.formparams.address)
          }
          if (
            this.formparams.venuedetails != "" &&
            this.newData.venuedetails != this.formparams.venuedetails
          ) {
            this.formData.append("venuedetails", this.formparams.venuedetails)
          }
          if (
            this.formparams.phone != "" &&
            this.newData.imgphone != this.formparams.phone
          ) {
            this.formData.append("phone", this.formparams.phone)
          }
          this.formData.append("isWeb", this.formparams.isWeb)
          this.formData.append("longitude", this.longitude)
          this.formData.append("latitude", this.latitude)
          const res = await updateShopsInfo(this.formData)
          if (res.msg === 'success') {
            this.dialogVisible = false
            this.$message({
              type: "success",
              message: "修改成功"
            })
            this.getTableList()
            this.editTextObj.delImgType = true //删除文本框已删除的图片
          } else {
            this.$message.error(res.data)
          }
        } else {
          return this.$message.error("请检查必填项")
        }
      })
    },
    //取消
    resetForm(formparams) {
      this.dialogVisible = false
      this.$refs[formparams].clearValidate()
      this.$refs[formparams].resetFields()
    },
    //清除地图上的marker
    clearOverlays(overlays) {
      var overlay
      while ((overlay = overlays.pop())) {
        overlay.setMap(null)
      }
    },
    //设置搜索的范围和关键字等属性
    searchKeyword() {
      var keyword = this.formparams.address
      //   var region = document.getElementById("region").value;
      //   var pageIndex = parseInt(document.getElementById("pageIndex").value);
      //   var pageCapacity = parseInt(
      //     document.getElementById("pageCapacity").value
      //   );
      this.clearOverlays(this.markers)
      //   //根据输入的城市设置搜索范围
      //   this.searchService.setLocation(region);
      //   //设置搜索页码
      this.searchService.setPageIndex(1)
      //   //设置每页的结果数
      this.searchService.setPageCapacity(1)
      //   //根据输入的关键字在搜索范围内检索
      this.searchService.search(keyword)

      //根据输入的关键字在圆形范围内检索
      //var region = new qq.maps.LatLng(39.916527,116.397128);
      //searchService.searchNearBy(keyword, region , 2000);
      //根据输入的关键字在矩形范围内检索
      //region = new qq.maps.LatLngBounds(new qq.maps.LatLng(39.936273,116.440043),new qq.maps.LatLng(39.896775,116.354212));
      //searchService.searchInBounds(keyword, region);
    },
    // 搜索相关
    seachFun() {
      //   this.searchService.search(this.formparams.address);
    },
  }
}
</script>

<style lang="scss" scoped>
#shopList {
  width: 100%;
  height: 100%;
  .box-card {
    height: 100%;
  }
}
#map {
  width: 700px;
  height: 300px;
}
</style>