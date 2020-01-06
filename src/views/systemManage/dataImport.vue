/* 作者：陈博文  开发日期：2019-04-01
   页面描述：数据导入
   修改人员：****  修改日期：****
 */
<template>
  <div class="p-10">
    <el-row>
      <el-col :span="24">
        <el-form :model="params" size="mini" class="search-row" inline>
          <el-form-item label="行政区划">
            <ThreeTrash
              :options="adcd"
              :init-adcd="initAdcd"
              @sendAdcd="getChildAdcd"
              v-model="params.adcd"
              class="simpleSelect"
            />
          </el-form-item>
          <el-form-item label="选择月份">
            <el-date-picker
              v-model="params.month"
              type="month"
              value-format="yyyy-MM"
              placeholder="选择月份"
              :clearable="false"
              style="width: 180px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" @click="getTableData">
              <span class="fa fa-search m-r-5"></span>查询
            </el-button>
          </el-form-item>
          <el-form-item class="right-btn">
            <el-button type="primary" @click="handleImport" v-if="permission.add">
              <span class="fa fa-upload m-r-5"></span>导入
            </el-button>
            <el-button type="success" @click="handleDownload">
              <span class="fa fa-download m-r-5"></span>模板下载
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          size="mini"
          stripe
          header-row-class-name="with_bac"
          v-loading="tableLoading"
        >
          <el-table-column type="index" label="序号" :index="indexMethod" width="50" align="center"></el-table-column>
          <el-table-column prop="CITY_NAME" label="所在市" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.CITY_NAME | spaceX}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="COUNTY_NAME" label="所在县" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.COUNTY_NAME | spaceX}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="STANDARD_POPLUATION_COVERAGE" label="达标人口覆盖率(%)" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.STANDARD_POPLUATION_COVERAGE | spaceX}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <a class="blue m-r-5" v-if="permission.update" @click="handleEdit(scope.row)">编辑</a>
              <a class="danger m-r-5" v-if="permission.delete" @click="handleDelete(scope.row)">删除</a>
              <span v-if="!permission.update && !permission.delete">-</span>
              <!-- <el-button size="mini" type="text primary" @click="handleEdit(scope.row)">
                <b>编辑</b>
              </el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalDataCount"
        ></el-pagination>
      </el-col>
    </el-row>

    <el-dialog
      title="数据导入"
      :visible.sync="uploadDialogVisible"
      :close-on-click-modal="false"
      :before-close="beforeClose"
      width="500px"
    >
      <el-form :model="fileForm" ref="fileDialogForm" :rules="fileRules" size="mini">
        <el-form-item label="选择月份" label-width="100px" prop="month">
          <el-date-picker
            v-model="fileForm.month"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择月份"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="文件上传" label-width="100px" prop="fileId">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :headers="fileHeader"
            :on-success="handleFileSuccess"
            :on-remove="handleFileRemove"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :file-list="fileList"
            :data="fileData"
            :limit="1"
            ref="fileUploader"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="beforeClose" size="mini">取 消</el-button>
        <el-button type="primary" @click="handleSave" size="mini" :loading="saveLoading">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="数据编辑"
      :visible.sync="updateDialogVisible"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form :model="updateForm" ref="uploadDialogForm" :rules="uploadRules" size="mini">
        <el-form-item label="所在市" label-width="160px">
          <div v-text="updateForm.CITY_NAME"></div>
        </el-form-item>
        <el-form-item label="所在县" label-width="160px">
          <div v-text="updateForm.COUNTY_NAME"></div>
        </el-form-item>
        <el-form-item label="达标人口覆盖率(%)" label-width="160px" prop="STANDARD_POPLUATION_COVERAGE">
          <el-input-number
            v-model="updateForm.STANDARD_POPLUATION_COVERAGE"
            :min="0"
            :max="100"
            :step="0.1"
            size="mini"
            :precision="1"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="handleUpdate" size="mini">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ThreeTrash from "@/components/select";
import requestDC from "@/utils/requestDC";
import { getUserInfo, getToken } from "@/utils/auth";
export default {
  data() {
    const userInfo = getUserInfo();
    let step = 2; //级联选择器的跨级数，根据用户的adcd来判断
    if (userInfo.ADCD.length === 2) step = 3;
    else step = 2;
    return {
      userInfo: {},
      params: {//表格查询参数
        month: this.$moment().format("YYYY-MM")
      },
      adcd: [
        {
          ADCD: userInfo.ADCD, //顶级政区编码
          ADMIN_DIV_NAME: userInfo.ADMIN_DIV_NAME, //顶级政区名
          children: [], //固定传空
          level: 1, //顶级所在位置，固定为1
          isClear: false //是否可清除值
        } // 初始化传入当前行政区划的顶级
      ],
      //表格参数的行政区划
      initAdcd: {
        adcd: userInfo.ADCD, //选择绑定的值
        level: 1, //绑定值所在政区的级别
        step: step //允许选择的最大级别
      },
      tableData: [],
      pageSize: 20,
      currentPage: 1,
      tableLoading: true,
      totalDataCount: 1,
      uploadDialogVisible: false,
      fileHeader: {},//用来给文件传token
      fileList: [],
      fileForm: {//数据导入的表单
        month: this.$moment().format("YYYY-MM"),
        fileId: "",
        uploaded: false
      },
      fileRules: {
        month: [{ required: true, message: "请输入年份", trigger: "blur" }],
        fileId: [{ required: true, message: "请上传文件", trigger: "change" }]
      },
      updateDialogVisible: false,
      fileData: {//上传文件时带的参数
        fileClass: "SysData"
      },
      updateForm: {
        ID: "",
        CITY_NAME: "",
        COUNTY_NAME: "",
        STANDARD_POPLUATION_COVERAGE: ""
      },//编辑数据的表单
      uploadRules: {
        STANDARD_POPLUATION_COVERAGE: [
          { required: true, message: "请输入达标人口覆盖率", trigger: "change" }
        ]
      },
      uploadUrl: "",
      auth: [],
      permission: {},
      saveLoading: false
    };
  },
  components: {
    ThreeTrash
  },
  created() {
    this.auth = this.$route.meta.auth;
    this.permission.add = this.auth.indexOf(2) > -1;
    this.permission.update = this.auth.indexOf(4) > -1;
    this.permission.delete = this.auth.indexOf(8) > -1;
    this.fileHeader.token = getToken();
    this.userInfo = getUserInfo();
    this.uploadUrl = this.userInfo.baseApiUrl + "/api/File/UploadFile";
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    getChildAdcd: function(adcd) {
      if (adcd.length >= 1) {
        this.params.adcd = adcd[adcd.length - 1];
      } else {
        this.params.adcd = "";
      }
    },
    getTableData(event) {
      if (event) {
        this.currentPage = 1;
      }
      this.tableLoading = true;
      requestDC({
        url: "Coverage/ListCoverage",
        method: "post",
        data: {
          adcd: this.params.adcd || this.userInfo.ADCD,
          month: this.params.month,
          pageSize: this.pageSize,
          pageNumber: this.currentPage
        }
      })
        .then(res => {
          setTimeout(() => {
            this.tableLoading = false;
          }, 300);
          this.tableData = res.message.rows;
          this.totalDataCount = res.message.total;
        })
        .catch(error => {
          setTimeout(() => {
            this.tableLoading = false;
          }, 300);
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.getTableData();
    },
    // 点击编辑
    handleEdit({ ID, CITY_NAME, COUNTY_NAME, STANDARD_POPLUATION_COVERAGE }) {
      this.updateForm = {
        ID: ID,
        CITY_NAME: CITY_NAME,
        COUNTY_NAME: COUNTY_NAME,
        STANDARD_POPLUATION_COVERAGE: STANDARD_POPLUATION_COVERAGE
      };
      this.updateDialogVisible = true;
    },
    // 数据导入模态框关闭时触发
    beforeClose(done) {
      //有文件缺为上传
      if (this.fileForm.fileId && !this.fileForm.uploaded) {
        this.$confirm("所上传文件尚未保存，确认关闭？")
          .then(_ => {
            this.$refs.fileUploader.clearFiles();
            this.fileForm.fileId = "";
            this.fileForm.uploaded = false;
            this.uploadDialogVisible = false;
          })
      } else {
        this.$refs.fileUploader.clearFiles();
        this.fileForm.fileId = "";
        this.fileForm.uploaded = false;
        this.uploadDialogVisible = false;
      }
    },
    handleImport() {
      this.fileForm = {
        month: this.$moment().format("YYYY-MM"),
        fileId: "",
        uploaded: false
      };
      this.uploadDialogVisible = true;
      this.$nextTick(_ => {
        this.$refs.fileDialogForm.clearValidate();
      });
    },
    handleDownload() {
      window.open(
        this.userInfo.baseFileUrl + "/Template/县级供水覆盖率—数据导入模板.xlsx"
      );
    },
    handleFileSuccess(res, file) {
      this.fileForm.fileId = res.message[0].fileID;
      this.fileForm.uploaded = true;
      this.$refs.fileDialogForm.validateField("fileId");
    },
    handleFileRemove(file, fileList) {
      if (this.fileForm.fileId) {
        requestDC({
          url: "File/DeleteFile",
          method: "post",
          data: {
            fileID: this.fileForm.fileId
          }
        }).then(res => {
          this.$message({
            type: "success",
            message: "删除文件成功！"
          });
        });
        this.fileForm.fileId = "";
      }
    },
    beforeUpload(file) {
      let nameArr = file.name.split(".");
      if (
        nameArr.length > 1 &&
        (nameArr[nameArr.length - 1] === "xls" ||
          nameArr[nameArr.length - 1] === "xlsx")
      ) {
        return true;
      } else {
        this.$message.error("只允许上传excel文件!");
        return false;
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请清除后再添加！`);
    },
    handleSave() {
      this.saveLoading = true;
      this.$refs.fileDialogForm.validate(valid => {
        if (!valid) {
          return false;
        } else {
          requestDC({
            url: "Coverage/ImportCoverage",
            method: "post",
            data: {
              month: this.fileForm.month,
              fileId: this.fileForm.fileId
            }
          })
            .then(res => {
              this.saveLoading = false;
              this.$refs.fileUploader.clearFiles();
              this.uploadDialogVisible = false;
              this.currentPage = 1;
              this.getTableData();
              this.$message({
                type: "success",
                message: "导入数据成功！"
              });
            })
        }
      });
    },
    handleUpdate() {
      this.$refs.uploadDialogForm.validate(valid => {
        if (!valid) {
          return false;
        } else {
          requestDC({
            url: "Coverage/UpdateCoverage",
            method: "post",
            data: {
              dataId: this.updateForm.ID,
              coverage: this.updateForm.STANDARD_POPLUATION_COVERAGE
            }
          })
            .then(res => {
              this.updateDialogVisible = false;
              this.currentPage = 1;
              this.getTableData();
              this.$message({
                type: "success",
                message: "更新数据成功！"
              });
            })
        }
      });
    },
    //index索引方法
    indexMethod(index) {
      return index + (this.currentPage - 1) * this.pageSize + 1;
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          requestDC({
            url: "Coverage/DeleteCoverage",
            method: "post",
            data: {
              dataId: row.ID
            }
          })
            .then(res => {
              this.currentPage = 1;
              this.getTableData();
              this.$message({
                type: "success",
                message: "删除数据成功！"
              });
            })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="less" scoped>
.p-10 {
  padding: 10px;
}
.el-pagination {
  margin-top: 10px;
  text-align: right;
}
.right-btn {
  float: right;
}
</style>
