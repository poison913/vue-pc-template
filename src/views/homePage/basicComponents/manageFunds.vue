<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="24">
        <div class="homePage-box m-t-10"  v-if="userType">
          <div class="button-box">
            <el-button type="success" size="mini" @click="addData" v-if="auth.indexOf(2)>-1">
              <span class="fa fa-plus m-r-5"></span>新增
            </el-button>
            <!-- <el-button type="primary" size="mini" @click="exportTable">
              <span class="fa fa-download m-r-5"></span>导出
            </el-button> -->
          </div>
        </div>
        <div class="homePage-box m-t-10">
          <el-table
            :data="DataData"
            stripe
            header-row-class-name="with_bac"
            border
            size="mini"
            style="width: 100%"
          >
            <el-table-column prop="RESPOND_YEAR" label="年度" align="center"></el-table-column>
            <el-table-column prop="FOUNDS" label="经费（万元）" align="center"></el-table-column>
            <el-table-column prop="GIVE_FOUNDS" label="下达资金（万元）" align="center"></el-table-column>
            <el-table-column prop="SELF_FOUNDS" label="自筹资金（万元）" align="center"></el-table-column>
            <el-table-column label="经费文件" align="center">
              <template slot-scope="scope">
                <el-button @click="readData(scope.row)" type="text" size="mini">
                  <strong>查看</strong>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" v-if="userType">
              <template slot-scope="scope">
                <el-button @click="editData(scope.row)"  v-show="auth.indexOf(4)>-1" type="text warning" size="mini">
                  <strong>编辑</strong>
                </el-button>
                <el-button @click="deleteData(scope.row)"  v-show="auth.indexOf(8)>-1" type="text danger" size="mini">
                  <strong>删除</strong>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              class="pull-right m-t-10"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog :title="addTitle" :visible.sync="dialogData" width="500px">
      <el-form
        class="m-t-10"
        :model="form"
        ref="Form"
        :rules="rules"
        size="mini"
        label-position="left"
        novalidate
      >
        <el-form-item label="批复年度" :label-width="formLabelWidth" prop="RESPOND_YEAR">
          <el-date-picker
            size="mini"
            v-model="form.RESPOND_YEAR"
            value-format="yyyy"
            type="year"
            placeholder="选择年"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="经费(万元)" :label-width="formLabelWidth" prop="FOUNDS">
          <el-input v-model="form.FOUNDS" placeholder="请输入经费" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="下达资金（万元）：" :label-width="formLabelWidth" prop="GIVE_FOUNDS">
          <el-input v-model="form.GIVE_FOUNDS" placeholder="请输入下达资金" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="自筹资金（万元）：" :label-width="formLabelWidth" prop="SELF_FOUNDS">
          <el-input v-model="form.SELF_FOUNDS" placeholder="请输入自筹资金" size="mini"></el-input>
        </el-form-item>
        <!-- <el-form-item label="职称" :label-width="formLabelWidth" >
          <el-input v-model="input" placeholder="请输入内容" size="mini"></el-input>
        </el-form-item>-->
        <el-form-item label="经费文件" :label-width="formLabelWidth" prop="fileId">
          <upload-file v-if="dialogData" :test="fileClassName" :fileObj="fileInfo" :fileType="fileTypeName" @successFile="getUploadFile"></upload-file>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogData = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveData" size="small">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import titleStyle from "@/components/Title/index"; //标题栏组件
import uploadFile from "@/components/uploadFile/index"; // 上传文件
import { getUserInfo } from "@/utils/auth";
import $http from "@/utils/requestDC";
export default {
  components: { titleStyle, uploadFile },
  props: { code: { type: String }, auth:{type:Array}},
  data() {
    return {
      fileTypeName:'.pdf',
      DataData: [],
      userType:'',
      total: 0,
      fileClassName: "SupplementInfo",
      dialogData: false,
      currentPage: 1,
      pageSize:10,
      testCode: "",
      fileInfo:{},
      formLabelWidth: "150px",
      addTitle: "新增经费",
      form: {
        PROJECT_CODE: "",
        FOUNDS: "",
        GIVE_FOUNDS: "",
        SELF_FOUNDS: "",
        fileId: ""
      },
      rules: {
        RESPOND_YEAR: [
          { required: true, message: "请选择年份", trigger: "blur" }
        ],
        FOUNDS: [{ required: true, message: "请输入经费", trigger: "blur" }],
        GIVE_FOUNDS: [
          { required: true, message: "请输入下达资金", trigger: "blur" }
        ],
        SELF_FOUNDS: [
          { required: true, message: "请输入自筹资金", trigger: "blur" }
        ],
        fileId: [{ required: true, message: "请上传文件", trigger: "blur" }]
      }
    };
  },
  created() {
    let type = getUserInfo().USER_TYPE ==9?true:false;// true 是监管 false 运管
    this.userType = type;
    this.testCode = this.code;
    this.getListData();
  },
  methods: {
    //index索引方法
    indexMethod(index) {
      //debugger
      return index + (this.currentPage) * this.pageSize + 1;
    },
    getUploadFile(file) {
      // 获取文件
      console.log("文件材料", file);
      this.form.fileId = file.fileID;
    },
    getListData() {
      //获取管护经费列表
      $http({
        url: "ProjectInfoCost/ListProjectManagementCostInfos",
        method: "post",
        data: {
          projectCode: this.testCode,
          pageSize: this.pageSize,
          pageNumber: this.currentPage
        }
      })
        .then(res => {
          this.DataData = res.message.rows;
          this.total = res.message.total;
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    editData(data) {
      this.addTitle = "编辑经费";
      $http({
        url: "ProjectInfoCost/GetProjectManagementCostInfos",
        method: "post",
        data: {
          recordCode: data.RECORD_CODE
        }
      })
        .then(res => {
          res.message.RESPOND_YEAR = res.message.RESPOND_YEAR.toString();
          res.message.fileId = res.message.FILE_ID;
          this.fileInfo.name = res.message.TITLE;
          this.fileInfo.url = res.message.RELATIVE_URL;
          console.log(`fileinfo`,this.fileInfo)
          this.form = res.message;
          this.dialogData = true;
          console.log(res);
        })
        .catch(err => {
          this.$message.error(err);
        });
      // 编辑
    },
    deleteData(data) {
      // 删除
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log("删除data", data);
          this.confirmDel(data.RECORD_CODE, data.FILE_ID);
        })
        .catch(err => {
          // this.$message.error(err);
        });
    },
    confirmDel(code, id) {
      $http({
        url: "ProjectInfoCost/DeleteProjectManagementCostInfos",
        method: "post",
        data: {
          RECORD_CODE: code,
          fileId: id
        }
      })
        .then(res => {
          this.$message({
            type: "success",
            message: "删除成功！"
          });
          this.getListData();
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    readData(data) {
      // 查看文件
      let linkUrl = getUserInfo().baseFileUrl + data.RELATIVE_URL;
      window.open(linkUrl);
    },
    addData() {
      this.addTitle = "新增经费";
      this.form = {
        BELONGED_TYPE: "管护经费",
        PROJECT_CODE: this.testCode,
        FOUNDS: "",
        GIVE_FOUNDS: "",
        SELF_FOUNDS: "",
        fileId: ""
      };
      console.log(this.fileInfo)
      this.dialogData = true;
    },
    saveData() {
      // 添加管护经费
      this.$refs["Form"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？")
            .then(_ => {
              if (this.form.RECORD_CODE) {
                $http({
                  url: "ProjectInfoCost/UpdateProjectManagementCostInfos",
                  method: "post",
                  data: this.form
                }).then(res => {
                  this.dialogData = false;
                  this.$message({
                    type: "success",
                    message: "更新经费成功！"
                  });
                  this.getListData();
                });
              } else {
                $http({
                  url: "ProjectInfoCost/AddProjectManagementCostInfos",
                  method: "post",
                  data: this.form
                }).then(res => {
                  this.dialogData = false;
                  this.$message({
                    type: "success",
                    message: "新增经费成功！"
                  });
                  this.getListData();
                });
              }
            })
            .catch(_ => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getListData();
      // 分页
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getListData();
      console.log(`当前页: ${val}`);
    },
    handleRemove(file, fileList) {
      // 上传
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
     //导出表格
    exportTable() {
      this.exportLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const theader = [
          "年度",
          "经费（万元）",
          "下达资金（万元）",
          "自筹资金（万元）",
        ];
        const filterVal = [
          "RESPOND_YEAR",
          "FOUNDS",
          "GIVE_FOUNDS",
          "SELF_FOUNDS",
        ];
        const data = this.formatJson(filterVal, this.tableData);
        let fileTitle = "";
        excel.export_json_to_excel({
          header: theader,
          data,
          filename:
            fileTitle +
            "管护经费" +
            this.$moment().format("YYYY_MM_DD_HH_mm_ss"),
          autoWidth: true,
          bookType: "xlsx"
        });
        this.exportLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
  }
};
</script>
<style lang="less" scoped>
.table {
  font-size: 13px;
  width: 100%;
  // border: 1px solid #eee;
  border-color: #797979;
  border-collapse: collapse;
  td {
    width: 25%;
    text-align: center;
  }
  .td-title {
    padding: 10px;
    background-color: #e4e4e4;
  }
}
.homePage-box {
  overflow: hidden;
}
.m-t-10 {
  margin-top: 10px;
}
.button-box {
  float: right;
}
.pdf-embed {
  width: 100%;
  height: 100vh;
}
</style>


