<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="24" v-if="userType">
        <div class="homePage-box m-t-10">
          <span v-if="fileInfo.FILE_TIME" class="c-title">竣工时间：{{fileInfo.FILE_TIME.substring(0,10)}}</span>
          <div class="button-box">
            <el-button type="primary" size="mini"  v-if="auth.indexOf(2)>-1" @click="uploadData">
              <span class="fa fa-upload m-r-5"></span>上传
            </el-button>
            <el-button type="danger" size="mini" v-if="auth.indexOf(8)>-1" @click="deleteData">
              <span class="fa fa-trash m-r-5"></span>删除
            </el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="24" v-if="pdfShow" class="m-t-10">
        <div class="file-box">
          <embed class="pdf-embed" :src="fileUrl" type>
        </div>
      </el-col>
      <el-col :span="24" v-if="!pdfShow" class="m-t-10">
        <div class="no-pdf">暂无PDF文件</div>
      </el-col>
    </el-row>
    <el-dialog title="上传管网布设图" :visible.sync="dialogData" width="500px">
      <el-form :model="form" ref="form" :rules="rules" size="mini" novalidate>
        <el-form-item label="竣工时间" :label-width="formLabelWidth" prop="FILE_TIME">
          <el-date-picker
            v-model="form.FILE_TIME"
            value-format="yyyy-MM-dd"
            type="date"
            size="mini"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="上传管网布设图：" :label-width="formLabelWidth" prop="fileId">
          <upload-file
            v-if="dialogData"
            :test="fileClassName"
            :fileType="fileTypeName"
            @successFile="getUploadFile"
          ></upload-file>
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
      fileTypeName: ".pdf",
      userType: "",
      input: "",
      DataData: [],
      value1: "",
      dialogData: false,
      formLabelWidth: "150px",
      dateValue: "",
      fileUrl: "",
      pdfShow:'',
      fileType: "管网布设图",
      fileClassName: "NetworkInfo",
      testCode: "",
      dateOptions: [
        { name: "天", value: 0 },
        { name: "周", value: 1 },
        { name: "季度", value: 3 },
        { name: "年", value: 4 }
      ],
      form: {
        BELONGED_TYPE: "管网布设图",
        PROJECT_CODE: "",
        FILE_TIME: "",
        fileId: ""
      },
      rules: {
        FILE_TIME: [{ required: true, message: "请选择时间", trigger: "blur" }],
        fileId: [
          { required: true, message: "请选择上传PDF文件", trigger: "blur" }
        ]
      },
      fileInfo: {}
    };
  },
  created() {
    let type = getUserInfo().USER_TYPE == 9 ? true : false; // true 是监管 false 运管
    this.userType = type;
    this.testCode = this.code;
    this.form.PROJECT_CODE = this.code;
    this.searchProjectFile();
  },
  methods: {
    searchProjectFile() {
      // 查询文件
      $http({
        url: "ProjectInfoManagement/GetProjectManagementFile",
        method: "post",
        data: {
          projectCode: this.testCode,
          belongedType: this.fileType
        }
      }).then(res => {
        if (res.message) {
          let urlApi = getUserInfo().baseFileUrl;
          this.fileInfo = res.message;
          console.log(`pdf`,this.fileInfo)
          this.fileUrl = urlApi + res.message.RELATIVE_URL;
        }
        console.log(`res`,res.message)
        this.pdfShow = res.message?true:false;
      });
    },
    getUploadFile(file) {
      // 获取文件
      console.log("文件材料", file);
      this.form.fileId = file.fileID;
      this.form.FILE_NAME = file.fileID;
    },
    editData(data) {
      // 编辑
      console.log(data);
    },
    // 删除调取
    confirmDel() {
      $http({
        url: "ProjectInfoManagement/DeleteProjectManagementFile",
        method: "post",
        data: {
          FILE_CODE: this.fileInfo.FILE_CODE,
          BELONGED_TYPE: this.fileType,
          fileId: this.fileInfo.FILE_CODE
        }
      }).then(res => {
        console.log("删除完成", res);
        this.searchProjectFile();
        this.$message({
          type: "success",
          message: "删除完成"
        });
      });
    },
    deleteData() {
      this.$confirm("确认删除吗？")
        .then(_ => {
          this.confirmDel();
        })
        .catch(_ => {});
      // 删除
    },
    uploadData() {
      (this.form = {
        BELONGED_TYPE: "管网布设图",
        PROJECT_CODE: this.testCode,
        FILE_TIME: "",
        fileId: ""
      }),
        console.log(`this`, this.form);
      this.dialogData = true;
    },
    saveData() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          $http({
            url: "ProjectInfoManagement/AddProjectManagementFile",
            method: "post",
            data: this.form
          }).then(res => {
            console.log("上传完成", res);
            this.$message({
              type: "success",
              message: "上传完成"
            });
            this.searchProjectFile();
            this.dialogData = false;
          });
        }
      });
    }
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
.title-box {
  float: left;
  overflow: hidden;
  .title-box-inner {
    font-size: 13px;
    float: left;
  }
  .el-input {
    width: 70px;
  }
  .el-select {
    width: 80px;
  }
}
.button-box {
  float: right;
}

.file-box {
  min-height: 600px;
  width: 100%;
  border: #797979 1px solid;
  .file-btn-box {
    position: absolute;
    right: 40px;
  }
}
.pdf-embed {
  width: 100%;
  height: 100vh;
}
.no-pdf {
  height: 400px;
  font-size: 48px;
  line-height: 400px;
  text-align: center;
  color: #ddd;
}
.c-title{
  font-size: 13px;
  font-weight: 600;
}
</style>


