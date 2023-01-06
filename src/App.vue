<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
html, body {
  padding: 0;
  margin: 0;
  width: 100%;
	height: 100%;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
	font-size: 14px;
	-webkit-font-smoothing: antialiased;
  a {
    text-decoration: none;
  }
  h1, h2, h3, h4, h5, h6 {
    padding: 0;
    margin: 0;
  }
  #app {
    height: 100%;
    width: 100%;
  }
}
.uploaderNone .el-upload{
  display: none !important;
}
.el-popover {
  height: 70vh;
  overflow-y: auto;
  img {
    width: 200px !important;
  }
}
  //滚动条的宽度
.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar,
.el-dialog__wrapper::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
//滚动条的滑块
.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb,
.el-dialog__wrapper::-webkit-scrollbar {
  background-color: #D6D6D6;
  border-radius: 8px;
}
</style>
