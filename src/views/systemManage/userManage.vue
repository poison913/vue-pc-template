/* 作者：陈博文  开发日期：2019-04-01
   页面描述：用户管理
   修改人员：****  修改日期：****
 */
<template>
  <div class="p-10">
    <el-row>
      <el-form :model="params" size="mini" class="search-row" inline>
        <el-form-item label="用户名">
          <el-input v-model="params.userName" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="params.trueName" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="getTableData">
            <span class="fa fa-search m-r-5"></span>查询
          </el-button>
        </el-form-item>
        <el-form-item class="right-btn">
          <el-button type="success" @click="addUser" v-if="permission.add">
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
        v-loading="tableLoading"
      >
        <el-table-column type="index" label="序号" :index="indexMethod" width="50" align="center"></el-table-column>
        <el-table-column prop="USER_NAME" label="用户名" width="150" align="center"></el-table-column>
        <el-table-column prop="TRUE_NAME" label="真实姓名" width="150" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.TRUE_NAME | spaceX}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="MOBILE" label="手机号码" width="150" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.MOBILE | spaceX}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="MAIL" label="邮箱" width="150" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.MAIL | spaceX}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="行政区划" width="100" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.ADMIN_DIV_NAME | spaceX}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户等级" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.USER_TYPE==0">省级</span>
            <span v-else-if="scope.row.USER_TYPE==1">市级</span>
            <span v-else-if="scope.row.USER_TYPE==2">县级</span>
            <span v-else>管理单位</span>
          </template>
        </el-table-column>
        <el-table-column prop="UNIT_NAME" label="工作单位" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.UNIT_NAME | spaceX}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ROLE_NAME" label="用户角色" width="100" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.ROLE_NAME | spaceX}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <a class="blue m-r-5" @click="handleEdit(scope.row)" v-if="permission.update">编辑</a>
            <a class="warning m-r-5" @click="resetPassword(scope.row)" v-if="permission.update">重置密码</a>
            <a class="danger" @click="handleDelete(scope.row)" v-if="permission.delete">删除</a>
            <span v-if="!permission.update && !permission.delete">-</span>
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
    </el-row>
    <!-- 编辑模态框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      top="10vh"
      width="500px"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="userForm"
        size="mini"
        novalidate
        v-loading="modalLoading"
      >
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="USER_NAME">
          <el-input v-model="form.USER_NAME" :disabled="userNameDisabled" clearable></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" :label-width="formLabelWidth" prop="TRUE_NAME">
          <el-input v-model="form.TRUE_NAME" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth" prop="MOBILE">
          <el-input v-model="form.MOBILE" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="MAIL">
          <el-input v-model="form.MAIL" clearable></el-input>
        </el-form-item>
        <el-form-item label="行政区划" :label-width="formLabelWidth" prop="ADMIN_DIV_CODE">
          <el-select v-model="form.ADMIN_DIV_CODE" clearable placeholder="请选择">
            <el-option
              v-for="item in userAdcdList"
              :key="item.ADMIN_DIV_CODE"
              :label="item.ADMIN_DIV_NAME"
              :value="item.ADMIN_DIV_CODE"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户等级" :label-width="formLabelWidth" prop="USER_TYPE">
          <el-select v-model="form.USER_TYPE" clearable placeholder="请选择" @change="getUnitList">
            <el-option
              v-for="item in typeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作单位" :label-width="formLabelWidth" prop="UNIT_CODE">
          <!-- 工作单位 -->
          <el-select
            v-model="form.UNIT_CODE"
            :disabled="form.USER_TYPE===''"
            clearable
            filterable
            placeholder="请选择"
            @change="getRoleList"
            :loading="unitLoading"
          >
            <el-option
              v-for="item in unitList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户角色" :label-width="formLabelWidth" prop="ROLE_CODE">
          <el-select
            v-model="form.ROLE_CODE"
            :disabled="form.USER_TYPE===''||form.UNIT_CODE===''"
            clearable
            placeholder="请选择"
            :loading="roleLoading"
          >
            <el-option
              v-for="item in roleList"
              :key="item.ROLE_CODE"
              :label="item.ROLE_NAME"
              :value="item.ROLE_CODE"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序号" :label-width="formLabelWidth" prop="ORDER_ID">
          <el-input-number v-model="form.ORDER_ID" :step="1" :precision="0" label="排序号"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="mini" :loading="modalLoading">取 消</el-button>
        <el-button type="primary" @click="saveEdit" size="mini" :loading="modalLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import ThreeTrash from "@/components/select";
import requestDC from "@/utils/requestDC";
import { getUserInfo } from "@/utils/auth";
export default {
  data() {
    //手机号验证
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号码不能为空"));
      }
      setTimeout(() => {
        if (!/^\d+$/.test(value)) {
          callback(new Error("手机号码必须为数字值"));
        } else {
          if (!/^1\d{10}$/.test(value)) {
            callback(new Error("请输入正确的手机号码"));
          } else {
            callback();
          }
        }
      }, 100);
    };
    return {
      //表格查询参数
      params: {
        userName: "",
        trueName: ""
      },
      form: {
        USER_NAME: "",
        TRUE_NAME: "",
        MOBILE: "",
        MAIL: "",
        ADMIN_DIV_CODE: "",
        USER_TYPE: "",
        UNIT_CODE: "",
        ROLE_CODE: "",
        ORDER_ID: 1000
      }, //默认表单
      rules: {
        USER_NAME: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        TRUE_NAME: [
          { required: true, message: "请输入真实姓名", trigger: "blur" }
        ],
        MOBILE: [{ required: true, validator: checkPhone, trigger: "blur" }],
        MAIL: [
          // { required: true, message: "请输入电子邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }
        ],
        ADMIN_DIV_CODE: [
          { required: true, message: "请选择行政区划", trigger: "blur" }
        ],
        USER_TYPE: [
          { required: true, message: "请选择角色等级", trigger: "blur" }
        ],
        UNIT_CODE: [
          { required: true, message: "请选择工作单位", trigger: "blur" }
        ],
        ROLE_CODE: [
          { required: true, message: "请选择用户角色", trigger: "blur" }
        ],
        ORDER_ID: [
          {
            required: true,
            message: "请选择排序号",
            trigger: ["blur", "change"]
          }
        ]
      },
      tableData: [],
      pageSize: 20,
      currentPage: 1,
      tableLoading: true,
      totalDataCount: 1,
      formLabelWidth: "80px",
      dialogFormVisible: false,
      modalLoading: false, //表单弹窗加载状态
      userAdcdList: [], //行政区划枚举
      roleList: [], //用户角色枚举
      unitList: [], //单位枚举
      typeList: [], //用户类型枚举值，在typeListControl()中配置
      dialogTitle: "编辑用户", //弹窗标题变更
      userNameDisabled: false, //用户名禁用
      userInfo: {},
      unitLoading: false, //单位下拉框的加载和禁用
      unitDisabled: true,
      roleLoading: false, //角色下拉框的加载和禁用
      roleDisabled: true,
      auth: [], //权限数据
      permission: {} //权限功能
    };
  },
  components: {
    // ThreeTrash
  },
  created() {
    //通过权限数据判断权限
    this.auth = this.$route.meta.auth;
    this.permission.add = this.auth.indexOf(2) > -1;
    this.permission.update = this.auth.indexOf(4) > -1;
    this.permission.delete = this.auth.indexOf(8) > -1;
  },
  mounted() {
    this.userInfo = getUserInfo();
    this.getTableData();
    this.getUserAdcd();
    this.getRoleList();
    this.getUnitList();
    this.typeListControl();
  },
  methods: {
    //行政区划
    getUserAdcd() {
      requestDC({
        url: "User/ListMyAdcd",
        method: "post",
        data: {}
      })
        .then(res => {
          this.userAdcdList = res.message;
        })
        .catch(error => {
          this.$message({
            type: "error",
            message: error
          });
        });
    },
    //省市县获取单位
    getNormalUnitList(code) {
      requestDC({
        url: "User/ListMyDept",
        method: "post",
        data: {
          level: this.form.USER_TYPE
        }
      })
        .then(res => {
          this.unitLoading = false;
          if (res.message.length > 0) {
            res.message.forEach(function(item) {
              item.code = item.UNIT_CODE;
              item.name = item.UNIT_NAME;
            });
            this.unitList = res.message;
            if (code) {
              //有code时赋值
              this.$nextTick(() => {
                this.form.UNIT_CODE = code;
              });
            }
          }
        })
        .catch(error => {
          this.unitLoading = false;
        });
    },
    //管理平台单位
    getPlatformUnitList(code) {
      requestDC({
        url: "User/ListPlatformByNowUser",
        method: "post",
        data: {}
      })
        .then(res => {
          this.unitLoading = false;
          if (res.message.length > 0) {
            res.message.forEach(function(item) {
              item.code = item.SUPPLEMENT_CODE;
              item.name = item.SUPPLEMENT_NAME;
            });
          }
          this.unitList = res.message;
          if (code) {
            this.$nextTick(() => {
              this.form.UNIT_CODE = code;
            });
          }
        })
        .catch(error => {
          this.unitLoading = false;
          this.$message({
            type: "error",
            message: error
          });
        });
    },
    //获取单位枚举值
    getUnitList(val, code) {
      this.form.ROLE_CODE = "";
      this.form.UNIT_CODE = "";
      if (this.form.USER_TYPE !== "") {
        this.unitDisabled = false;
        this.unitLoading = true;
        //判断是否从【省市县】切换到【管理平台】
        if (this.form.USER_TYPE <= 2) {
          //省市县
          this.getNormalUnitList(code);
        } else {
          //管理平台
          this.getPlatformUnitList(code);
        }
      } else {
        this.unitDisabled = true;
        this.roleDisabled = true;
        this.roleList = [];
      }
    },
    //获取角色枚举值
    getRoleList(val, code) {
      let params = {};
      //单位或平台为空时，角色不可选
      if (!this.form.UNIT_CODE && !this.form.SUPPLEMENT_CODE) {
        this.form.ROLE_CODE = "";
        this.roleDisabled = true;
        this.roleList = [];
      } else {
        this.roleLoading = true;
        this.roleDisabled = false;
        //用户等级是管理平台时，需要传管理平台编码
        if (this.form.USER_TYPE == 9) {
          params = {
            supplementCode: this.form.SUPPLEMENT_CODE || this.form.UNIT_CODE
          };
        }
        this.requestRoleList(params, code);
      }
    },
    //请求角色枚举值
    requestRoleList(params, code) {
      requestDC({
        url: "Role/ListRoleByPlatform",
        method: "post",
        data: params
      })
        .then(res => {
          this.roleLoading = false;
          this.roleList = res.message;
          //有code时赋值
          if (code) {
            this.$nextTick(() => {
              this.form.ROLE_CODE = code;
            });
          }
        })
        .catch(error => {
          this.roleLoading = false;
        });
    },
    //列表数据，有event表示是点击按钮触发
    getTableData(event) {
      if (event) {
        this.currentPage = 1;
      }
      this.tableLoading = true;
      requestDC({
        url: "SuperviseUser/ListUsers",
        method: "post",
        data: {
          adcd: "",
          userName: this.params.userName,
          trueName: this.params.trueName,
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
      this.currentPage = 1;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.getTableData();
    },
    addUser() {
      this.form = {
        USER_NAME: "",
        TRUE_NAME: "",
        MOBILE: "",
        MAIL: "",
        ADMIN_DIV_CODE: "",
        USER_TYPE: "",
        UNIT_CODE: "",
        ROLE_CODE: "",
        ORDER_ID: 1000
      };
      this.dialogTitle = "添加用户";
      this.userNameDisabled = false;
      this.modalLoading = false;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["userForm"].clearValidate();
      });
    },
    //根据当前用户级别控制等级
    typeListControl() {
      if (this.userInfo.USER_TYPE == 0) {
        this.typeList = [{ code: 0, name: "省级" }, { code: 1, name: "市级" }];
      } else if (this.userInfo.USER_TYPE == 1) {
        this.typeList = [{ code: 1, name: "市级" }, { code: 2, name: "县级" }];
      } else if (this.userInfo.USER_TYPE == 2) {
        this.typeList = [
          { code: 2, name: "县级" },
          { code: 9, name: "管理平台" }
        ];
      }
    },
    //编辑时获取详情
    handleEdit(row) {
      this.dialogTitle = "编辑用户";
      requestDC({
        url: "SuperviseUser/GetUser",
        method: "post",
        data: {
          userCode: row.USER_CODE
        }
      })
        .then(res => {
          this.modalLoading = false;
          this.userNameDisabled = true;
          this.form = JSON.parse(JSON.stringify(res.message));
          //等级是管理平台时，把平台赋值给单位
          if (res.message.USER_TYPE == 9) {
            this.form.UNIT_CODE = res.message.SUPPLEMENT_CODE;
          }
          this.getUnitList("", this.form.UNIT_CODE);
          this.dialogFormVisible = true;
          this.getRoleList("", res.message.ROLE_CODE);
          this.$nextTick(() => {
            this.$refs["userForm"].clearValidate();
          });
        })
        .catch(error => {
          this.dialogFormVisible = false;
        });
    },
    saveEdit() {
      this.$refs["userForm"].validate(valid => {
        if (!valid) {
          return false;
        } else {
          this.modalLoading = true;
          let url, msg;
          if (this.form.USER_CODE) {
            url = "SuperviseUser/UpdateUser";
            msg = "编辑用户成功！";
          } else {
            url = "SuperviseUser/AddUser";
            msg = "添加用户成功！";
          }
          requestDC({
            url: url,
            method: "post",
            data: this.form
          })
            .then(res => {
              this.modalLoading = false;
              this.currentPage = 1;
              this.getTableData();
              this.dialogFormVisible = false;
              this.$message({
                type: "success",
                message: msg
              });
            })
            .catch(error => {
              this.modalLoading = false;
            });
        }
      });
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          requestDC({
            url: "SuperviseUser/DeleteUser",
            method: "post",
            data: {
              userCode: row.USER_CODE
            }
          })
            .then(res => {
              this.currentPage = 1;
              this.getTableData();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    resetPassword(row) {
      this.$confirm("此操作将重置该用户密码, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          requestDC({
            url: "SuperviseUser/ResetPassword",
            method: "post",
            data: {
              userCode: row.USER_CODE
            }
          })
            .then(res => {
              this.$message({
                type: "success",
                message: "重置密码成功!"
              });
            })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消重置密码"
          });
        });
    },
    //index索引方法
    indexMethod(index) {
      return index + (this.currentPage - 1) * this.pageSize + 1;
    }
  }
};
</script>

<style lang="less" scoped>
.p-10 {
  padding: 10px;
}
table {
  .el-button--text.el-button--mini {
    padding: 0;
  }
}
.search-row {
  .el-input {
    width: 160px;
  }
}
.el-pagination {
  margin-top: 10px;
  text-align: right;
}
.right-btn {
  float: right;
}
</style>