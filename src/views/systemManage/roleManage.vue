/* 作者：陈博文  开发日期：2019-04-01
   页面描述：角色管理
   修改人员：****  修改日期：****
 */
<template>
  <div v-loading="loading">
    <el-row class="role-manage">
      <el-col :span="4">
        <el-row class="button-row-right">
          <el-button type="success" size="mini" @click="addRole" v-if="permission.add">
            <span class="fa fa-plus m-r-5"></span>添加角色
          </el-button>
        </el-row>
        <el-tree
          :data="roleList"
          show-checkbox
          node-key="id"
          :props="roleProps"
          @check-change="handleCheckChange"
          :check-strictly="true"
          default-expand-all
          :check-on-click-node="true"
          :render-content="renderContent"
          ref="roleTree"
        ></el-tree>
        <!-- @check="handleCheck" -->
      </el-col>
      <el-col :span="4">
        <el-row class="button-row-right">
          <el-button type="primary" @click="bindAuth" size="mini" v-if="permission.update">
            <span class="fa fa-check m-r-5"></span>绑定权限
          </el-button>
        </el-row>
        <div class="grid-content">
          <el-tree
            :data="authList"
            show-checkbox
            node-key="id"
            :default-expanded-keys="['100']"
            ref="authTree"
          ></el-tree>
        </div>
      </el-col>
      <el-col :span="16">
        <tree-table ref="recTree" :list.sync="authTableData" @handlerExpand="handlerExpand"></tree-table>
      </el-col>
    </el-row>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="500px"
      v-loading="modalLoading"
    >
      <el-form :model="form" :rules="rules" ref="roleForm" size="mini" novalidate>
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="ROLE_NAME">
          <el-input v-model="form.ROLE_NAME" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否用于流程" :label-width="formLabelWidth" prop="IS_USEFLOW">
          <el-select v-model="form.IS_USEFLOW" clearable placeholder="请选择">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色等级" :label-width="formLabelWidth" prop="ROLE_LEVEL">
          <el-select v-model="form.ROLE_LEVEL" clearable placeholder="请选择">
            <el-option
              v-for="item in roleLevelList"
              :key="item.ROLE_LEVEL"
              :label="item.LEVEL_NAME"
              :value="item.ROLE_LEVEL"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色排序" :label-width="formLabelWidth" prop="ORDER_ID">
          <el-input-number v-model="form.ORDER_ID" :step="1" :precision="0" label="角色排序"></el-input-number>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="DESCRIPTION">
          <el-input type="textarea" :rows="3" v-model="form.DESCRIPTION"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="saveEdit" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import treeTable from "@/components/TreeTable/tree-table.vue";
import requestDC from "@/utils/requestDC";
export default {
  data() {
    return {
      roleList: [],//角色列表
      roleProps: {
        label: "ROLE_NAME"
      },
      authList: [],
      authTableData: [],
      dialogFormVisible: false, //模态框显隐
      form: {
        ROLE_NAME: "",
        IS_USEFLOW: "",
        DESCRIPTION: "",
        ROLE_LEVEL: "",
        ORDER_ID: 0
      },//角色表单
      rules: {
        ROLE_NAME: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        ROLE_LEVEL: [
          { required: true, message: "请选择角色等级", trigger: "blur" }
        ],
        ORDER_ID: [
          { required: true, message: "请输入排序号", trigger: "blur" }
        ],
        DESCRIPTION: []
      },
      formLabelWidth: "100px",
      listLoading: true,
      roleLevelList: [],//角色等级枚举
      loading: false,
      modalLoading: false,
      dialogTitle: "编辑角色",
      auth: [],
      permission: {}
    };
  },
  components: {
    treeTable
  },
  created() {
    this.auth = this.$route.meta.auth;
    this.permission.add = this.auth.indexOf(2) > -1;
    this.permission.update = this.auth.indexOf(4) > -1;
    this.permission.delete = this.auth.indexOf(8) > -1;
  },
  mounted() {
    this.getRoleLevelList();
    this.getRoleList();
  },
  methods: {
    //获取角色枚举值
    getRoleLevelList() {
      requestDC({
        url: "Role/ListRoleLevel",
        method: "post",
        data: {
          roleName: ""
        }
      })
        .then(res => {
          this.roleLevelList = res.message;
        })
    },
    //权限树
    getAuthTree(code) {
      return new Promise((resolve, reject) => {
        requestDC({
          url: "RoleAuth/ListModAuthByRole",
          method: "post",
          data: {
            roleCode: code
          }
        })
          .then(res => {
            let checkedList = res.message.check;
            this.authList = res.message.menu;
            this.$nextTick(() => {
              this.$refs.authTree.setCheckedKeys(checkedList);
              resolve();
            });
          })
          .catch(error => {
            reject();
          });
      });
    },
    //权限表格
    getAuthTable(code) {
      return new Promise((resolve, reject) => {
        requestDC({
          url: "RoleAuth/ListModAuthTreeGrid",
          method: "post",
          data: {
            roleCode: code
          }
        })
          .then(res => {
            this.authTableData = res.message;
            resolve();
          })
          .catch(error => {
            reject();
          });
      });
    },
    //获取权限列表
    async getAuth(code) {
      this.loading = true;
      try {
        if (code) {
          let [foo, bar] = await Promise.all([
            this.getAuthTable(code),
            this.getAuthTree(code)
          ]);
          setTimeout(() => {
            this.loading = false;
          }, 300);
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: error
        });
      }
    },
    //获取角色树
    getRoleList() {
      requestDC({
        url: "Role/ListRoles",
        method: "post",
        data: {
          roleName: ""
        }
      })
        .then(res => {
          if (res.message.length > 0) {
            res.message.forEach(item => {
              item.id = item.ROLE_CODE;
            });
          }
          this.roleList = res.message;
          //在dom生成以后触发选择角色
          this.$nextTick(() => {
            if (this.roleList.length > 0) {
              this.$refs.roleTree.setChecked(this.roleList[0], true);
            }
          });
        })
    },
    handleCheckChange(data, checked, node) {
      if (checked) {
        this.getAuth(data.ROLE_CODE);
        this.$refs.roleTree.setCheckedNodes([data]);
      }
    },
    //树加上操作按钮
    renderContent(h, { node, data, store }) {
      if (this.permission.update && this.permission.delete) {
        return (
          <span class="option-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button
                class="el-icon-edit-outline text-warning"
                size="mini"
                type="text"
                on-click={() => this.editRole(data)}
              />
              <el-button
                class="el-icon-delete text-danger"
                size="mini"
                type="text"
                on-click={() => this.remove(node, data)}
              />
            </span>
          </span>
        );
      } else if (this.permission.update) {
        return (
          <span class="option-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button
                class="el-icon-edit-outline text-warning"
                size="mini"
                type="text"
                on-click={() => this.editRole(data)}
              />
            </span>
          </span>
        );
      } else if (this.permission.delete) {
        return (
          <span class="option-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button
                class="el-icon-delete text-danger"
                size="mini"
                type="text"
                on-click={() => this.remove(node, data)}
              />
            </span>
          </span>
        );
      } else {
        return (
          <span class="option-tree-node">
            <span>{node.label}</span>
          </span>
        );
      }
    },
    //点击添加按钮
    addRole() {
      this.dialogFormVisible = true;
      this.form = {
        ROLE_NAME: "",
        IS_USEFLOW: "",
        DESCRIPTION: "",
        ROLE_LEVEL: "",
        ORDER_ID: 0
      };
      this.dialogTitle = "添加角色";
      this.$nextTick(_ => {
        this.$refs["roleForm"].clearValidate();
      });
    },
    //获取角色详情
    editRole(data) {
      event.stopPropagation();
      requestDC({
        url: "Role/GetRole",
        method: "post",
        data: {
          roleCode: data.ROLE_CODE
        }
      })
        .then(res => {
          this.dialogTitle = "编辑角色";
          this.dialogFormVisible = true;
          this.form = res.message;
          this.$nextTick(() => {
            this.$refs.roleForm.clearValidate();
          });
        })
    },
    //保存 编辑 或 添加
    saveEdit() {
      this.$refs["roleForm"].validate(valid => {
        if (!valid) {
          return false;
        } else {
          this.modalLoading = true;
          let url;
          if (this.form.ROLE_CODE) {
            url = "Role/UpdateRole";
          } else {
            url = "Role/AddRole";
          }
          requestDC({
            url: url,
            method: "post",
            data: this.form
          })
            .then(res => {
              setTimeout(() => {
                this.modalLoading = false;
              }, 300);
              this.dialogFormVisible = false;
              this.getRoleList();
              this.$message({
                message: "操作成功！",
                type: "success"
              });
            })
        }
      });
    },
    //删除
    remove(node, data) {
      event.stopPropagation();
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          requestDC({
            url: "Role/DeleteRole",
            method: "post",
            data: {
              roleCode: data.ROLE_CODE
            }
          })
            .then(res => {
              this.getRoleList();
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
    //保存权限
    bindAuth() {
      let role = this.$refs.roleTree.getCheckedKeys();
      if (!role.length) {
        this.$message({
          type: "warning",
          message: "请先选择一个角色！"
        });
      } else {
        let checkedNodes = this.$refs.authTree.getCheckedNodes();
        let halfCheckedNodes = this.$refs.authTree.getHalfCheckedNodes();
        let finalList = "";
        for (let i in checkedNodes) {
          if (checkedNodes[i].tag !== "1") {
            finalList = finalList + checkedNodes[i].id + ";";
          }
        }
        for (let i in halfCheckedNodes) {
          if (halfCheckedNodes[i].tag !== "1") {
            finalList = finalList + halfCheckedNodes[i].id + ";";
          }
        }
        this.requestBindAuth(role, finalList);
      }
    },
    //发送绑定权限的请求
    requestBindAuth (role, finalList) {
      requestDC({
          url: "RoleAuth/SaveModAuthByRole",
          method: "post",
          data: {
            roleCode: role[0],
            authCodes: finalList
          }
        }).then(res => {
          if (res.status === 0) {
            this.getAuthTree(role[0]);
            this.getAuthTable(role[0]);
            this.$message({
              type: "success",
              message: "权限绑定成功！"
            });
          }
        });
    },
    //树形表格展开收缩
    handlerExpand(m) {
      m.isExpand = !m.isExpand;
    }
  }
};
</script>

<style lang="less">
.role-manage {
  .el-col {
    padding: 10px;
  }
  .el-table__expanded-cell[class*="cell"] {
    padding: 0;
  }
  .option-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    width: calc(~"100% - 38px");
    .el-button {
      font-size: 14px;
    }
    & > span:first-child {
      max-width: calc(~"100% - 42px");
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .button-row-right {
    height: 28px;
    margin-bottom: 10px;
    text-align: right;
  }
  .el-tree {
    font-size: 14px;
  }
  .text-success {
    color: #4cae4c;
  }
  .text-warning {
    color: #fcce00;
  }
  .text-danger {
    color: #e72c26;
  }
}
</style>