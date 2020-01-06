<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="24">
        <div class="homePage-box">
          <div class="button-box">
            <el-button type="success" size="mini" @click="editTable" v-if="userType&&auth.indexOf(4)>-1">
              <span v-if="showDetail">
                <span class="fa fa-edit m-r-5"></span>编辑
              </span>
              <span v-if="!showDetail">
                <span class="fa fa-save m-r-5"></span>保存
              </span>
            </el-button>
            <!-- <el-button type="primary" size="mini">
              <span class="fa fa-download m-r-5"></span>导出
            </el-button> -->
          </div>
        </div>
        <div class="homePage-box" style="position:relative;">
          <titleStyle :title="'管理机构'"></titleStyle>
          <span class="span-time">更新时间:{{manageInfo.UPDATE_TIME}}</span>
        </div>
        <div class="homePage-box m-t-10">
          <table class="table" border="1" cellspacing="0">
            <tbody>
              <tr>
                <td class="td-title">政府负责人姓名</td>
                <td class="td-title-bind">
                  <div
                    class="cell"
                    v-if="showDetail"
                    v-text="manageInfo.GOVERNMENT_CHARGE_PERSON_NAME"
                  ></div>
                  <el-input
                    v-model="manageInfo.GOVERNMENT_CHARGE_PERSON_NAME"
                    placeholder="请输入内容"
                    size="mini"
                    v-if="!showDetail"
                  ></el-input>
                </td>
                <td class="td-title">政府负责人联系电话</td>
                <td class="td-title-bind">
                  <div
                    class="cell"
                    v-if="showDetail"
                    v-text="manageInfo.GOVERNMENT_CHARGE_PERSON_MOBILE"
                  ></div>
                  <el-input
                    v-model="manageInfo.GOVERNMENT_CHARGE_PERSON_MOBILE"
                    v-if="!showDetail"
                    placeholder="请输入内容"
                    size="mini"
                  ></el-input>
                </td>
              </tr>
              <tr>
                <td class="td-title">运行管理部门名称</td>
                <td>
                  <div class="cell" v-if="showDetail" v-text="manageInfo.MANAGE_UNIT_NAME"></div>
                  <el-input
                    v-model="manageInfo.MANAGE_UNIT_NAME"
                    v-if="!showDetail"
                    placeholder="请输入内容"
                    size="mini"
                  ></el-input>
                </td>
                <td class="td-title">运行管理部门地址</td>
                <td>
                  <div class="cell" v-if="showDetail" v-text="manageInfo.MANAGE_UNIT_ADDRESS"></div>
                  <el-input
                    v-model="manageInfo.MANAGE_UNIT_ADDRESS"
                    v-if="!showDetail"
                    placeholder="请输入内容"
                    size="mini"
                  ></el-input>
                </td>
              </tr>
              <tr>
                <td class="td-title">运行管理部门责任人姓名</td>
                <td class="td-title-bind">
                  <div
                    class="cell"
                    v-if="showDetail"
                    v-text="manageInfo.MANAGE_UNIT_CHARGE_PERSON_NAME"
                  ></div>
                  <el-input
                    v-model="manageInfo.MANAGE_UNIT_CHARGE_PERSON_NAME"
                    v-if="!showDetail"
                    placeholder="请输入内容"
                    size="mini"
                  ></el-input>
                </td>
                <td class="td-title">运行管理部门责任人联系电话</td>
                <td class="td-title-bind">
                  <div
                    class="cell"
                    v-if="showDetail"
                    v-text="manageInfo.MANAGE_UNIT_CHARGE_PERSON_MOBILE"
                  ></div>
                  <el-input
                    v-model="manageInfo.MANAGE_UNIT_CHARGE_PERSON_MOBILE"
                    v-if="!showDetail"
                    placeholder="请输入内容"
                    size="mini"
                  ></el-input>
                </td>
              </tr>
              <tr>
                <td class="td-title">运行管理部门明确书面材料</td>
                <td>
                  <div
                    class="cell blue cursor"
                    v-if="showDetail"
                    v-text="manageInfo.CLEAR_TITLE"
                    @click="openPdf(baseUrl+manageInfo.CLEAR_RELATIVE_URL)"
                  ></div>

                  <upload-file
                    v-if="!showDetail"
                    :test="fileClassName"
                    @successFile="getUploadSmFile"
                    :fileType="fileTypeName"
                  ></upload-file>
                </td>
                <td class="td-title">运行管理部门职责明确材料</td>
                <td>
                  <div
                    class="cell blue cursor"
                    v-if="showDetail"
                    v-text="manageInfo.DUTY_TITLE"
                    @click="openPdf(baseUrl+manageInfo.DUTY_RELATIVE_URL)"
                  ></div>
                  <upload-file
                    v-if="!showDetail"
                    :test="fileClassName"
                    @successFile="getUploadMqFile"
                    :fileType="fileTypeName"
                  ></upload-file>
                </td>
              </tr>
              <tr>
                <td class="td-title">运行管理部门负责人明确材料</td>
                <td class="td-title-bind">
                  <div
                    class="cell blue cursor"
                    v-if="showDetail"
                    v-text="manageInfo.PERSON_TITLE"
                    @click="openPdf(baseUrl+manageInfo.PERSON_RELATIVE_URL)"
                  ></div>
                  <upload-file
                    v-if="!showDetail"
                    :test="fileClassName"
                    @successFile="getUploadRmqFile"
                    :fileType="fileTypeName"
                  ></upload-file>
                </td>
                <td class="td-title">行业监管部门名称</td>
                <td class="td-title-bind">
                  <div class="cell" v-if="showDetail" v-text="manageInfo.INDUSTRY_DEPARTMENT_NAME"></div>
                  <el-input
                    v-model="manageInfo.INDUSTRY_DEPARTMENT_NAME"
                    v-if="!showDetail"
                    placeholder="请输入内容"
                    size="mini"
                  ></el-input>
                </td>
              </tr>
              <tr>
                <td class="td-title">行业监管部门责任人姓名</td>
                <td>
                  <div
                    class="cell"
                    v-if="showDetail"
                    v-text="manageInfo.INDUSTRY_DEPARTMENT_CHARGER_NAME"
                  ></div>
                  <el-input
                    v-model="manageInfo.INDUSTRY_DEPARTMENT_CHARGER_NAME"
                    v-if="!showDetail"
                    placeholder="请输入内容"
                    size="mini"
                  ></el-input>
                </td>
                <td class="td-title">行业监管部门责任人联系电话</td>
                <td>
                  <div
                    class="cell"
                    v-if="showDetail"
                    v-text="manageInfo.INDUSTRY_DEPARTMENT_CHARGER_MOBILE"
                  ></div>
                  <el-input
                    v-model="manageInfo.INDUSTRY_DEPARTMENT_CHARGER_MOBILE"
                    v-if="!showDetail"
                    placeholder="请输入内容"
                    size="mini"
                  ></el-input>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="homePage-box m-t-10">
          <div class="button-box">
            <el-button type="success" size="mini" @click="addPerson" v-if="userType&&auth.indexOf(2)>-1">
              <span class="fa fa-plus m-r-5"></span>新增
            </el-button>
            <!-- <el-button type="primary" size="mini">
              <span class="fa fa-download m-r-5"></span>导出
            </el-button> -->
          </div>
        </div>
        <div class="homePage-box m-t-10">
          <titleStyle :title="'管理人员表'"></titleStyle>
        </div>
        <div class="homePage-box m-t-10">
          <el-table
            :data="personData"
            stripe
            header-row-class-name="with_bac"
            border
            size="mini"
            style="width: 100%"
          >
            <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
            <el-table-column prop="TRUE_NAME" label="姓名" align="center"></el-table-column>
            <el-table-column prop="MOBILE" label="联系方式" align="center"></el-table-column>
            <el-table-column prop="POST" label="岗位" align="center"></el-table-column>
            <el-table-column prop="TITLE" label="职称" align="center"></el-table-column>
            <el-table-column prop="POSITION" label="职务" align="center"></el-table-column>
            <el-table-column label="操作" align="center" v-if="userType">
              <template slot-scope="scope">
                <el-button @click="editPerson(scope.row)" v-show="auth.indexOf(4)>-1" type="text warning" size="mini">
                  <strong>编辑</strong>
                </el-button>
                <el-button @click="deletePerson(scope.row)" v-show="auth.indexOf(8)>-1" type="text danger" size="mini">
                  <strong>删除</strong>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-dialog :title="personTitle" :visible.sync="dialogPerson" width="500px">
      <el-form :model="form" ref="form" :rules="rules" size="mini" label-position="right" novalidate>
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="TRUE_NAME">
          <el-input v-model="form.TRUE_NAME" placeholder="请输入姓名" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth" prop="MOBILE">
          <el-input v-model="form.MOBILE" placeholder="请输入联系方式" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="岗位" :label-width="formLabelWidth">
          <el-input v-model="form.POST" placeholder="请输入岗位" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="职称" :label-width="formLabelWidth">
          <el-input v-model="form.TITLE" placeholder="请输入职称" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="职务" :label-width="formLabelWidth">
          <el-input v-model="form.POSITION" placeholder="请输入职务" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPerson = false" size="small">取 消</el-button>
        <el-button type="primary" @click="onSubmit" size="small">保 存</el-button>
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
  props: { code: { type: String },auth:{type:Array}},
  data() {
    return {
      fileTypeName: ".pdf",
      input: "",
      personTitle:"新增人员",
      personData: [],
      dialogPerson: false,
      formLabelWidth: "100px",
      testCode: "",
      testManageCode: "",
      fileClassName: "SupplementInfo",
      showDetail: true,
      form: {
        TRUE_NAME: "",
        POSITION: "",
        MANAGE_UNIT_CODE: "",
        MOBILE: "",
        TITLE: "",
        POST: ""
      },
      rules: {
        TRUE_NAME: [{ required: true, message: "请填写姓名", trigger: "blur" }],
        MOBILE: [{ required: true, message: "请填写联系方式", trigger: "blur" }]
      },
      baseUrl: "",
      manageInfo: { MANAGE_UNIT_CODE: "" },
      userType:'',// 权限
    };
  },
  created() {
    let type = getUserInfo().USER_TYPE ==9?true:false;// true 是监管 false 运管
    this.userType = type;
    this.baseUrl = getUserInfo().baseFileUrl;
    this.testCode = this.code;
    this.manageInfo.PROJECT_CODE = this.code;
    this.searchManageInfo();
    this.getPersonData();
  },
  methods: {
    //获取上传文件信息
    getUploadSmFile(file) {
      console.log("书面文件材料", file);
      this.manageInfo.clearFileId = file.fileID;
    },
    getUploadMqFile(file) {
      console.log("明确材料", file);
      this.manageInfo.personFileId = file.fileID;
    },
    getUploadRmqFile(file) {
      console.log("人明确材料", file);
      this.manageInfo.dutyFileId = file.fileID;
    },

    searchManageInfo() {
      // 获取机构基础信息
      $http({
        url: "ProjectInfoSuppleMent/GetProjectSupplementInfos",
        method: "post",
        data: {
          projectCode: this.testCode
        }
      }).then(res => {
        if (res.message != null) {
          this.manageInfo = res.message;
          this.form.MANAGE_UNIT_CODE = res.message.MANAGE_UNIT_CODE;
          this.manageInfo.MANAGE_UNIT_CODE = res.message.MANAGE_UNIT_CODE;
          this.manageInfo.clearFileId = res.message.CLEAR_FILE_ID;
          this.manageInfo.dutyFileId  = res.message.DUTY_FILE_ID;
          this.manageInfo.personFileId = res.message.PERSON_FILE_ID;
          console.log("基础信息", res);
        }
      });
    },
    saveManageInfo() {
      console.log(this.manageInfo.MANAGE_UNIT_CODE);
      // 保存机构基础信息
      // this.baseInfo.ADMIN_DIV_CODE = this.baseInfo.ADCD;
      // this.baseInfo.HAS_CREATED_STANDARD =
      // this.baseInfo.HAS_CREATED_STANDARD == "是" ? 1 : 0;
      // this.baseInfo.IS_REPORTED = this.baseInfo.IS_REPORTED == "是" ? 1 : 0;
      // this.baseInfo.IS_SHOWN_PANORAMA =
      // this.baseInfo.IS_SHOWN_PANORAMA == "是" ? 1 : 0;
      if (this.manageInfo.MANAGE_UNIT_CODE) {
        $http({
          url: "ProjectInfoSuppleMent/UpdateProjectSupplementInfo",
          method: "post",
          data: this.manageInfo
        })
          .then(res => {
            if (res.status == 0) {
              this.searchManageInfo();
            }
            this.$message({
              type: "success",
              message: "更新完成"
            });
          })
          .catch(err => {
            this.$message({
              type: "error",
              message: err
            });
          });
      } else {
        this.manageInfo.clearFileId = ' ';
        this.manageInfo.dutyFileId = ' ';
        this.manageInfo.personFileId = ' ';
        $http({
          url: "ProjectInfoSuppleMent/AddProjectSupplementInfo",
          method: "post",
          data: this.manageInfo
        })
          .then(res => {
            if (res.status == 0) {
              this.searchManageInfo();
            }
            this.$message({
              type: "success",
              message: "更新完成"
            });
          })
          .catch(err => {
            this.$message({
              type: "error",
              message: err
            });
          });
      }
    },
    editTable() {
      // 管理机构编辑 or 保存
      if (this.showDetail == false) {
        this.saveManageInfo();
      }

      this.showDetail = !this.showDetail;
    },
    getPersonData() {
      // 查询人员列表
      $http({
        url: "ProjectInfoSuppleMent/ListProjectSupplementPersons",
        method: "post",
        data: {
          projectCode: this.testCode,
          pageSize: 10,
          pageNumber: this.currentPage
        }
      }).then(res => {
        this.personData = res.message.rows;
        // this.total = res.message.total;
        console.log(res);
      });
    },
    editPerson(data) {
      // 编辑人员
      console.log(data);
    },
    addPerson() {
      this.personTitle = `新增人员`;
      this.dialogPerson = true;
      this.form = {
        TRUE_NAME: "",
        POSITION: "",
        MANAGE_UNIT_CODE: this.manageInfo.MANAGE_UNIT_CODE,
        MOBILE: "",
        TITLE: "",
        POST: ""
      };
    },
    savePerson() {
      // 保存人员
      
          if (this.form.PERSON_ID) {
            $http({
              url: "ProjectInfoSuppleMent/UpdateProjectSupplementPerson",
              method: "post",
              data: this.form
            })
              .then(res => {
                this.dialogPerson = false;
                this.$message({
                  type: "success",
                  message: "编辑成功"
                });
                this.getPersonData();
                console.log(res);
              })
              .catch(res => {
                console.log(res);
                this.$message.error(res.errmsg);
              });
          } else {
            $http({
              url: "ProjectInfoSuppleMent/AddProjectSupplementPerson",
              method: "post",
              data: this.form
            })
              .then(res => {
                this.dialogPerson = false;
                this.$message({
                  type: "success",
                  message: "新增成功"
                });
                this.getPersonData();
                console.log(res);
              })
              .catch(res => {
                console.log(res);
                this.$message.error(res);
              });
          }
        
    },
    onSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
      // this.$confirm("确认提交吗？")
      //   .then(_ => {
          
          this.savePerson();
        // })
        // .catch(_ => {});
        }
      });
    },
    searchPerson(id) {
      $http({
        url: "ProjectInfoSuppleMent/GetProjectSupplementPersons",
        method: "post",
        data: { personId: id }
      })
        .then(res => {
          this.form = res.message;
          this.dialogPerson = true;
          console.log(res);
        })
        .catch(res => {
          this.$message.error(res);
        });
    },
    editPerson(data) {
      // 点击编辑按钮
      this.personTitle = '编辑人员';
      this.searchPerson(data.PERSON_ID);
      console.log(data);
    },
    deletePerson(data) {
      // 点击删除
      this.$confirm("确认删除吗？")
        .then(_ => {
          this.confDelPerson(data.MANAGE_UNIT_CODE, data.PERSON_ID);
        })
        .catch(_ => {});
    },
    confDelPerson(code, id) {
      // 确定删除
      $http({
        url: "ProjectInfoSuppleMent/DeleteProjectSupplementPerson",
        method: "post",
        data: { PERSON_ID: id, MANAGE_UNIT_CODE: code }
      })
        .then(res => {
          this.dialogVisible = false;
          this.$message({
            type: "success",
            message: "删除完成"
          });
          this.getPersonData();
        })
        .catch(res => {
          console.log(res);
          this.$message.error(res.errmsg);
        });
    },
    openPdf(url) {
      window.open(url);
    }
  }
};
</script>
<style lang="less" scoped>
.table {
  font-size: 13px;
  width: 100%;
  border-color: #d8e1e8;
  border: solid 10px #d8e1e8;
  border-collapse: collapse;
  td {
    width: 25%;
    text-align: center;
  }
  .td-title-bind {
    background-color: #f5f8fa;
  }
  .td-title {
    padding: 10px;
    background-color: #fcfcfc;
    font-weight: 600;
    .el-input {
      width: 100%;
    }
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
.cursor {
  cursor: pointer;
}
.span-time{
  font-size: 13px;
  position: absolute;
      right: 17px;
    top: 10px;
}
</style>


