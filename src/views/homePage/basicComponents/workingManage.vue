<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="24">
        <div class="homePage-box m-t-10">
          <div class="title-box" >
            <div class="title-box-inner">
              <span>出厂水水质日常监测频率：</span>
              每
              <span v-if="!userType" v-text="monInfo.MONITOR_CYCLE"></span>
              <el-input
                v-if="userType"
                v-model="monInfo.MONITOR_CYCLE"
                placeholder="请输入内容"
                size="mini"
              ></el-input>
            </div>
            <div class="title-box-inner">
              <span v-if="!userType" v-text="monInfo.CYCLE_UNIT"></span>
              <el-select v-if="userType" v-model="monInfo.CYCLE_UNIT" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in dateOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </div>
            <div class="title-box-inner">
              检测
              <span v-if="!userType" v-text="monInfo.MONITOR_FREQUENCY"></span>
              <el-input v-if="userType" v-model="monInfo.MONITOR_FREQUENCY" placeholder size="mini"></el-input>次
            </div>
           
          </div>
           
          <div class="button-box" v-if="userType">
            <el-button type="primary" size="mini"  v-if="auth.indexOf(2)>-1" @click="uploadData">
                <span class="fa fa-upload m-r-5"></span>上传管理办法
              </el-button>
              <el-button type="danger" size="mini"  v-if="auth.indexOf(8)>-1" @click="deleteData">
                <span class="fa fa-trash m-r-5"></span>删除
              </el-button>
              <span v-if="typeshow">
                <el-button type="success" v-if="userType&&auth.indexOf(2)>-1" size="mini" @click="saveFrequency">
              <span class="fa fa-save m-r-5"></span>提交
            </el-button>
              </span>
             
          </div>
          <div class="button-box">
                <span v-if="fileInfo.FILE_TIME" class="c-title">生效时间：{{fileInfo.FILE_TIME.substring(0,10)}}</span>
            </div>
        </div>
      </el-col>
      <el-col :span="24" class="m-t-10"  v-if="pdfShow">
        <div class="file-box">
          <embed class="pdf-embed" :src="fileUrl" type>
        </div>
      </el-col>
      <el-col :span="24" v-if="!pdfShow" class="m-t-10">
        <div class="no-pdf">暂无PDF文件</div>
      </el-col>
    </el-row>
    <el-dialog title="上传运行管理办法" :visible.sync="dialogData" width="500px">
      <el-form :model="form" ref="form" :rules="rules" size="mini" novalidate>
        <el-form-item label="生效时间" :label-width="formLabelWidth" prop="FILE_TIME">
          <el-date-picker
            v-model="form.FILE_TIME"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          v-if="dialogData"
          label="上传运行管理办法"
          prop="fileId"
          :label-width="formLabelWidth"
        >
          <upload-file v-if="dialogData" :test="fileClassName" :fileType="fileTypeName" @successFile="getUploadFile"></upload-file>
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
      userType: "",
      fileTypeName: ".pdf",
      input: "",
      DataData: [],
      value1: "",
      dialogData: false,
      pdfShow:'',
      fileClassName: "ManagementFile",
      formLabelWidth: "150px",
      projectType:'',
      testCode: "",
      fileType: "运行管理办法",
      typeshow:'',
      dateValue: "",
      fileUrl: "",
      dateOptions: [
        { name: "天", value: 0 },
        { name: "周", value: 1 },
        { name: "季度", value: 2 },
        { name: "年", value: 3 }
      ],
      form: {
        BELONGED_TYPE: "运行管理办法",
        PROJECT_CODE: "",
        FILE_TIME:"",
        fileId:""
      },
      rules: {
        FILE_TIME:[
          { required: true, message: "请选择时间", trigger: "blur" }
        ],
        fileId: [
          { required: true, message: "请选择上传PDF文件", trigger: "blur" }
        ]
      },
      monInfo: {},
      fileInfo: {}
    };
  },
  created() {
    let type = getUserInfo().USER_TYPE == 9 ? true : false; // true 是监管 false 运管
    this.userType = type;
    this.testCode = this.code;
    this.form.PROJECT_CODE = this.code;
    this.getProjectInfo();
    this.getFrequencyList();
    this.searchProjectFile();
  },
  methods: {
    getProjectInfo(){ // 获取工程信息 判断 IV V 型号
        $http({
            url:"ProjectInfo/GetProjectRuralWaterSupplyBaseInfos",
            method: "post",
        data: { projectCode: this.code }
      }).then(res => {
          this.projectType = res.message.PROJECT_TYPE_BY_SCALE;
          if(this.projectType == 'CE1F4915-9DEF-4199-A53C-9E366731D235' || this.projectType == '25DBD2CD-7706-41C4-AA60-7D23D200D741'){
            this.typeshow = false;
          }else{
            this.typeshow = true;
          }
        console.log("工程信息", res);
      });
    },
    getUploadFile(file) {
      // 获取文件
      console.log("文件材料", file);
      this.form.fileId = file.fileID;
      this.form.FILE_NAME = file.fileID;
    },
    getFrequencyList() {
      // 监测频率列表
      $http({
        url: "ProjectInfoWater/GetProjectTapWaterQualityMonitorFrequency",
        method: "post",
        data: {
          projectCode: this.testCode
        }
      }).then(res => {
        console.log("检测频率", res);
        if(res.message != null){
           this.monInfo = res.message;
        }
      });
    },
    //提交或者更新频率
    saveFrequency() {
      if (this.monInfo.ID) {
        $http({
          url: "ProjectInfoWater/UpdateProjectTapWaterQualityMonitorFrequency",
          method: "post",
          data: this.monInfo
        })
          .then(res => {
            this.$message({
              type: "success",
              message: "更新频率成功"
            });
          })
          .catch(err => {
            this.$message({
              type: "error",
              message: err
            });
          });
      } else {
        $http({
          url: "ProjectInfoWater/AddProjectTapWaterQualityMonitorFrequency",
          method: "post",
          data: this.monInfo
        }).then(res => {
          this.$message({
            type: "success",
            message: "新增频率成功"
          });
        });
      }
    },
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
        console.log(`res`,res)
        if (res.message) {
          let urlApi = getUserInfo().baseFileUrl;
          this.fileInfo = res.message;
          this.fileUrl = urlApi + res.message.RELATIVE_URL;
        }
        this.pdfShow = res.message?true:false;
      });
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
      this.form = {
        PROJECT_CODE: this.testCode,
        BELONGED_TYPE: "运行管理办法",
        FILE_TIME:'',
        fileId:""
      };
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
    top: 15%;
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
  vertical-align: text-bottom;
  margin-right: 20px;
  line-height: 30px;
}
</style>


