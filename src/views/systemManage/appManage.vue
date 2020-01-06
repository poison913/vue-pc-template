/* 作者：陈博文  开发日期：2019-04-01
   页面描述：APP管理
   修改人员：****  修改日期：****
 */
<template>
  <div class="app-manage" v-loading="loading">
    <el-row>
      <el-form :model="params" size="mini" class="search-row" inline>
        <el-form-item label="发布时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="params.time"
            type="daterange"
            align="left"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="App类型" :label-width="formLabelWidth" prop="appType">
          <el-select v-model="params.appType" clearable placeholder="请选择">
            <el-option label="所有" value="0"></el-option>
            <el-option label="Android" value="1"></el-option>
            <el-option label="IOS" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="getTableData">
            <span class="fa fa-search m-r-5"></span>查询
          </el-button>
        </el-form-item>
        <el-form-item class="right-btn">
          <el-button type="success" @click="handleAdd">
            <span class="fa fa-plus m-r-5"></span>添加
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table
        :data="tableData"
        border
        stripe
        header-row-class-name="with_bac"
        style="width: 100%"
        size="mini"
        @row-click="handleClickRow"
        :row-class-name="tableRowClassName"
        :highlight-current-row="true"
        ref="mainTable"
      >
        <el-table-column type="index" label="序号" :index="indexMethod" width="50" align="center"></el-table-column>
        <el-table-column prop="APP_NAME" label="App名称" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.APP_NAME | spaceX}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="APP_VERSION" label="版本号" width="80" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.APP_VERSION | spaceX}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="APP_URL" label="App下载地址" align="left">
          <template slot-scope="scope">
            <div>{{scope.row.APP_URL | spaceX}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="QUICK_RESPONSE_CODE_URL" label="二维码URL" align="left">
          <template slot-scope="scope">
            <div>{{scope.row.QUICK_RESPONSE_CODE_URL | spaceX}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="FILE_NAME" label="文件名称" width="200" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.FILE_NAME | spaceX}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="APP_TYPE" label="类型" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.APP_TYPE==1">Android</span>
            <span v-else>IOS</span>
          </template>
        </el-table-column>
        <el-table-column prop="BUILD" label="编译号" width="80" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.BUILD | spaceX}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="DOWNLOAD_TIMES" label="下载次数" width="80" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.DOWNLOAD_TIMES | toThousands}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="BINARY" label="大小(字节)" width="100" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.BINARY | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="UPDATE_TIME" label="更新时间" width="90" align="center"></el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <a class="danger m-r-5" @click="handleDelete($event, scope.row)">删除</a>
            <!-- <el-button size="mini" type="text primary" @click="handleEdit(scope.row)">
              <b>编辑</b>
            </el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <div class="page-row">
        <span>注：点击表格数据显示对应的App信息</span>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalDataCount"
        ></el-pagination>
      </div>
      <div v-if="showDetail">
        <div class="menu-title">当前App信息</div>
        <el-form :model="viewData" size="mini" class="view-form">
          <el-form-item label="当前版本" label-width="200px">
            <div class="el-input el-input--mini" v-text="viewData.APP_VERSION"></div>
          </el-form-item>
          <el-form-item label="App类型" label-width="200px">
            <div class="el-input el-input--mini">
              <span v-if="viewData.APP_TYPE==1">Android</span>
              <span v-else>IOS</span>
            </div>
          </el-form-item>
          <el-form-item label="App下载链接" label-width="200px">
            <div class="el-button el-button--text primary el-button--mini">
              <a v-bind:href="viewData.APP_URL" target="_blank">
                <b style="font-size:14px;">点击下载</b>
              </a>
            </div>
          </el-form-item>
          <el-form-item label="App二维码" label-width="200px">
            <div class="el-input el-input--mini">
              <img :src="viewData.QUICK_RESPONSE_CODE_URL" class="qr-img">
            </div>
          </el-form-item>
          <el-form-item label="版本描述" label-width="200px">
            <div class="el-input el-input--mini" v-text="viewData.DESCRIPTION"></div>
          </el-form-item>
        </el-form>
      </div>
    </el-row>

    <el-dialog
      title="添加App信息"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form :model="form" :rules="rules" ref="appForm" size="mini" novalidate>
        <el-form-item label="App名称" :label-width="formLabelWidth" prop="APP_NAME">
          <el-input v-model="form.APP_NAME" placeholder="请输入名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="App版本号" :label-width="formLabelWidth" prop="APP_VERSION">
          <el-input v-model="form.APP_VERSION" placeholder="请输入App版本" clearable></el-input>
        </el-form-item>
        <el-form-item label="App类型" :label-width="formLabelWidth" prop="APP_TYPE">
          <el-select v-model="form.APP_TYPE" placeholder="请选择App类型">
            <el-option label="Android" value="1"></el-option>
            <el-option label="IOS" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编译号" :label-width="formLabelWidth" prop="BUILD">
          <el-input-number v-model="form.BUILD" :step="1" :precision="0"></el-input-number>
        </el-form-item>
        <el-form-item label="版本描述" :label-width="formLabelWidth" prop="DESCRIPTION">
          <el-input type="textarea" :rows="3" v-model="form.DESCRIPTION" placeholder="请输入版本描述"></el-input>
        </el-form-item>
        <el-form-item label="App文件" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :headers="fileHeader"
            :data="fileData"
            :on-success="handleFileSuccess"
            :before-remove="beforeRemove"
            :on-remove="handleFileRemove"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :limit="1"
            ref="fileUploader"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="handleSave" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import requestDC from "@/utils/requestDC";
import { getUserInfo, getToken } from "@/utils/auth";
export default {
  data() {
    return {
      formLabelWidth: "100px",
      params: {
        time: "",
        appType: "0"
      },
      //日期选择器快捷选项
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      totalDataCount: 0,
      loading: false,
      viewData: {}, //下方查看app详情的数据
      dialogFormVisible: false,
       //编辑时的表单数据
      form: {
        APP_NAME: "",
        APP_TYPE: "1",
        APP_VERSION: "",
        BUILD: 1,
        DESCRIPTION: "",
        SAVE_NAME: "",
        FILE_NAME: ""
      },
      rules: {
        APP_NAME: { required: true, message: "请输入App名称", trigger: "blur" },
        APP_TYPE: { required: true, message: "请选择App类型", trigger: "blur" },
        APP_VERSION: {
          required: true,
          message: "请输入App版本号",
          trigger: "blur"
        },
        BUILD: { required: true, message: "请输入编译号", trigger: "change" },
        DESCRIPTION: {
          required: true,
          message: "请输入版本描述",
          trigger: "blur"
        }
      },
      fileHeader: {}, //用于文件上传token
      fileList: [],
      showDetail: true, //是否展示app详情
      uploadUrl: "",
      fileData: {
        fileClass: "App"
      },
      fileID: ""
    };
  },
  created() {
    this.fileHeader.token = getToken();
    this.userInfo = getUserInfo();
    this.uploadUrl = this.userInfo.baseApiUrl + "/api/File/UploadFile";
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    getTableData(event) {
      if (event) {
        this.currentPage = 1;
      }
      this.loading = true;
      requestDC({
        url: "App/ListApps",
        method: "post",
        data: {
          startTime: this.params.time ? this.params.time[0] : "",
          endTime: this.params.time ? this.params.time[1] : "",
          appType: this.params.appType,
          pageSize: this.pageSize,
          pageNumber: this.currentPage
        }
      })
        .then(res => {
          setTimeout(() => {
            this.loading = false;
          }, 300);
          this.tableData = res.message.rows;
          this.totalDataCount = res.message.total;
          // 有数据的情况下，默认选中第一个，否则不展示详情
          if (this.tableData.length > 0) {
            this.$nextTick(_ => {
              this.showDetail = true;
              this.$refs.mainTable.setCurrentRow(this.tableData[0]);
              this.handleClickRow(this.tableData[0]);
            });
          } else {
            this.showDetail = false;
          }
        })
        .catch(error => {
          setTimeout(() => {
            this.loading = false;
          }, 300);
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.getTableData();
    },
    handleClickRow(row, column, event) {
      this.viewData = row;
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.form = {
        APP_NAME: "",
        APP_TYPE: "1",
        APP_VERSION: "",
        BUILD: 1,
        DESCRIPTION: "",
        SAVE_NAME: "",
        FILE_NAME: ""
      };
      this.$nextTick(_ => {
        this.$refs.appForm.clearValidate();
        this.$refs.fileUploader.clearFiles();
      });
    },
    // 保存
    handleSave() {
      if (!this.form.SAVE_NAME) {
        this.$message({
          type: "warning",
          message: "APP文件不能为空！"
        });
        return;
      }
      this.$refs.appForm.validate(valid => {
        if (!valid) {
          return false;
        } else {
          requestDC({
            url: "App/AddApp",
            method: "post",
            data: this.form
          }).then(res => {
            this.currentPage = 1;
            this.getTableData();
            this.dialogFormVisible = false;
            this.$message({
              type: "success",
              message: "添加App成功！"
            });
          });
        }
      });
    },
    handleFileSuccess(res, file) {
      this.form.SAVE_NAME = res.message[0].relativePath;
      this.form.FILE_NAME = res.message[0].fileName;
      this.fileID = res.message[0].fileID;
    },
    handleFileRemove(file, fileList) {
      if (this.fileID) {
        requestDC({
          url: "File/DeleteFile",
          method: "post",
          data: {
            fileID: this.fileID
          }
        }).then(res => {
          this.$message({
            type: "success",
            message: "删除文件成功！"
          });
        });
        this.fileID = "";
        this.form.SAVE_NAME = "";
        this.form.FILE_NAME = "";
      }
    },
    // 文件数量超出时
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请清除后再添加！`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleDelete(event, row) {
      event.stopPropagation();
      this.$confirm("此操作将永久删除该App信息, 是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //发送请求
          requestDC({
            url: "App/DeleteApp",
            method: "post",
            data: {
              appId: row.ID
            }
          }).then(res => {
            this.currentPage = 1;
            this.getTableData();
            this.$message({
              type: "success",
              message: "删除App信息成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 给表格行改鼠标样式
    tableRowClassName({ row, rowIndex }) {
      return "pointer";
    },
    //index索引方法
    indexMethod(index) {
      return index + (this.currentPage - 1) * this.pageSize + 1;
    }
  }
};
</script>

<style lang="less">
.app-manage {
  padding: 10px;
  .search-row {
    .el-input {
      width: 160px;
    }
  }
  .page-row {
    & > span {
      float: left;
      font-size: 14px;
    }
  }
  .el-pagination {
    margin-top: 10px;
    text-align: right;
  }
  .right-btn {
    float: right;
  }
  .menu-title {
    position: relative;
    width: 100%;
    height: 25px;
    margin-bottom: 5px;
    padding-left: 10px;
    line-height: 24px;
    font-size: 14px;
    font-weight: 600;
    color: #606060;
    margin-left: 8px;
    // border-bottom: 1px dashed #ddd;
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 2px;
      height: 20px;
      width: 4px;
      background: #2f85e2;
    }
  }
  .qr-img {
    width: 200px;
    height: 200px;
  }
  .view-form .el-input {
    width: 600px;
  }
}

.pointer {
  cursor: pointer;
}
</style>
