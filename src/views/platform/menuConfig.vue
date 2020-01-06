/* 作者：陈博文  开发日期：2019-04-01
   页面描述：系统模块权限管理
   修改人员：****  修改日期：****
 */
<template>
  <div class="menu-config">
    <el-row>
      <el-col :span="5">
        <div class="menu-title">
          <span>系统模块权限列表</span>
          <el-button type="success" size="mini" class="btn-xs fr" @click="addMod">
            <span class="fa fa-plus m-r-5"></span>添加模块
          </el-button>
        </div>
        <el-tree
          :data="moduleList"
          show-checkbox
          node-key="id"
          :props="props"
          :check-strictly="true"
          :check-on-click-node="true"
          @check-change="handleCheckChange"
          :render-content="renderContent"
          default-expand-all
          v-loading="treeLoading"
          ref="moduleTree"
          id="moduleTree"
        ></el-tree>
      </el-col>
      <el-col :span="10" :offset="1" v-loading="detailLoading">
        <div class="menu-title m-b-10">【{{modName}}】模块信息</div>
        <el-form :model="form" :rules="rules" ref="moduleForm" size="mini" novalidate>
          <el-form-item label="分组" :label-width="formLabelWidth" prop="IS_APP">
            <el-select v-model="form.IS_APP" clearable placeholder="请选择分组">
              <el-option label="Web端" value="0"></el-option>
              <el-option label="App端" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模块名称" :label-width="formLabelWidth" prop="MODULE_NAME">
            <el-input v-model="form.MODULE_NAME" clearable></el-input>
          </el-form-item>
          <el-form-item label="权限编码" :label-width="formLabelWidth" prop="POWER_CODE">
            <el-input v-model="form.POWER_CODE" clearable></el-input>
          </el-form-item>
          <el-form-item label="模块地址" :label-width="formLabelWidth" prop="MODULE_URL">
            <el-input v-model="form.MODULE_URL" clearable></el-input>
          </el-form-item>
          <el-form-item label="模块图标" :label-width="formLabelWidth" prop="IMAGE_URL">
            <el-input v-model="form.IMAGE_URL" clearable></el-input>
          </el-form-item>
          <el-form-item label="上级模块" :label-width="formLabelWidth" prop="PARENT_MODULE_CODE">
            <div class="el-input el-input--mini">
              <div
                class="el-input__inner"
                @click="popTreeVisible=true"
                v-text="PARENT_MODULE"
                style="width:178px;"
              ></div>
              <el-popover
                placement="bottom-end"
                width="250"
                trigger="click"
                v-model="popTreeVisible"
              >
                <el-tree
                  :data="popTreeList"
                  show-checkbox
                  node-key="id"
                  :props="props"
                  :check-strictly="true"
                  :check-on-click-node="true"
                  @check-change="handleParentCheckChange"
                  default-expand-all
                  v-loading="treeLoading"
                  id="modPopTree"
                  ref="popTree"
                ></el-tree>
                <el-button type="success" slot="reference" size="mini">
                  <span class="fa fa-plus m-r-5"></span>选择
                </el-button>
              </el-popover>
            </div>
          </el-form-item>
          <el-form-item label="是否显示" :label-width="formLabelWidth" prop="IS_ENABLE">
            <el-radio-group v-model="form.IS_ENABLE">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序号" :label-width="formLabelWidth" prop="ORDER_ID">
            <el-input-number v-model="form.ORDER_ID" :step="1" :precision="0" label="排序号"></el-input-number>
          </el-form-item>
          <el-form-item label="模块描述" :label-width="formLabelWidth" prop="DESCRIPTION">
            <el-input type="textarea" :rows="3" v-model="form.DESCRIPTION"></el-input>
          </el-form-item>
          <div class="btn-row">
            <el-button @click="addCancel" size="mini" v-if="showCancelBtn">取消新增</el-button>
            <el-button type="primary" @click="saveEdit" size="mini">保 存</el-button>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import requestDC from "@/utils/requestDC";
export default {
  data() {
    return {
      moduleList: [],
      popTreeList: [],
      props: {
        children: "children"
      },
      treeLoading: false,
      modName: "",
      formLabelWidth: "80px",
      PARENT_MODULE: "",
      form: {
        MODULE_NAME: "",
        MODULE_ID: "",
        MODULE_URL: "",
        IS_APP: "",
        ORDER_ID: 1,
        POWER_CODE: "",
        DESCRIPTION: "",
        IS_ENABLE: "1"
      },
      rules: {
        MODULE_NAME: [
          { required: true, message: "请输入模块名称", trigger: "blur" }
        ],
        MODULE_URL: [
          { required: true, message: "请输入模块地址", trigger: "blur" }
        ],
        IS_APP: [
          { required: true, message: "请选择客户端类型", trigger: "blur" }
        ],
        POWER_CODE: [
          { required: true, message: "请输入权限编码", trigger: "blur" }
        ],
        ORDER_ID: [
          {
            required: true,
            message: "请选择排序号",
            trigger: ["blur", "change"]
          }
        ]
      },
      detailLoading: false,
      popTreeVisible: false,
      showCancelBtn: false,
      checkedKeys: []
    };
  },
  mounted() {
    this.getTreeData();
    this.setTreeHeight();
  },
  methods: {
    setTreeHeight() {
      document.getElementById("moduleTree").style.height =
        document.documentElement.clientHeight - 105 + "px";
    },
    getTreeData() {
      this.treeLoading = true;
      this.detailLoading = true;
      requestDC({
        url: "Menu/ListMods",
        method: "post",
        data: {
          isApp: -1,
          modName: ""
        }
      })
        .then(res => {
          setTimeout(() => {
            this.treeLoading = false;
          }, 300);
          if (res.message.length > 0) {
            res.message.forEach(function(item) {
              if (item.tag == 1) {
                item.disabled = true;
              }
            });
          }
          this.moduleList = res.message;
          this.popTreeList = res.message;
          this.$nextTick(() => {
            if (this.moduleList.length > 0) {
              this.$refs.moduleTree.setChecked(
                this.moduleList[0].children[0],
                true
              );
            }
          });
        })
        .catch(error => {
          setTimeout(() => {
            this.treeLoading = false;
          }, 300);
          this.$message({
            type: "error",
            message: error
          });
        });
    },
    //树加上操作按钮
    renderContent(h, { node, data, store }) {
      if (data.tag != 1) {
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
    //删除
    remove(node, data) {
      event.stopPropagation();
      this.$confirm("此操作将永久删除该模块, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          requestDC({
            url: "Menu/DeleteMod",
            method: "post",
            data: {
              modId: data.id
            }
          })
            .then(res => {
              this.getTreeData();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            })
            .catch(error => {
              this.$message({
                type: "error",
                message: error
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
    getModuleDetail(code) {
      this.popTreeVisible = false;
      this.detailLoading = true;
      this.showCancelBtn = false;
      requestDC({
        url: "Menu/GetMod",
        method: "post",
        data: {
          modId: code
        }
      })
        .then(res => {
          setTimeout(() => {
            this.detailLoading = false;
          }, 300);
          this.form.MODULE_NAME = res.message.MODULE_NAME;
          this.form.MODULE_ID = res.message.MODULE_ID;
          this.form.MODULE_URL = res.message.MODULE_URL;
          this.form.IMAGE_URL = res.message.IMAGE_URL;
          this.form.IS_APP = res.message.IS_APP;
          this.form.ORDER_ID = res.message.ORDER_ID;
          this.form.POWER_CODE = res.message.POWER_CODE;
          this.form.DESCRIPTION = res.message.DESCRIPTION;
          this.form.IS_ENABLE = res.message.IS_ENABLE;
          //有上级模块时选中
          this.form.PARENT_MODULE_CODE = res.message.PARENT_MODULE_CODE;
          if (this.form.PARENT_MODULE_CODE) {
            this.$nextTick(_ => {
              this.$refs.popTree.setChecked(this.form.PARENT_MODULE_CODE, true);
            });
            this.PARENT_MODULE = this.$refs.moduleTree.getNode(
              this.form.PARENT_MODULE_CODE
            ).label;
          } else {
            //否则清空树的选择
            this.$nextTick(_ => {
              if (this.$refs.popTree.getCheckedKeys().length > 0) {
                this.$refs.popTree.setChecked(
                  this.$refs.popTree.getCheckedKeys()[0]
                );
              }
            });
            this.PARENT_MODULE = "";
          }
          this.$nextTick(() => {
            this.$refs.moduleForm.clearValidate();
          });
        })
        .catch(error => {
          setTimeout(() => {
            this.detailLoading = false;
          }, 300);
          this.$message({
            type: "error",
            message: error
          });
        });
    },
    handleCheckChange(data, checked, node) {
      if (checked) {
        this.getModuleDetail(data.id);
        this.modName = data.label;
        this.$refs.moduleTree.setCheckedNodes([data]);
      }
    },
    //选择上级模块的变化
    handleParentCheckChange(data, checked, node) {
      if (checked) {
        this.PARENT_MODULE = data.label;
        this.form.PARENT_MODULE_CODE = data.id;
        this.$refs.popTree.setCheckedNodes([data]);
      } else {
        if (this.$refs.popTree.getCheckedNodes().length === 0) {
          this.PARENT_MODULE = "";
          this.form.PARENT_MODULE_CODE = "";
        }
      }
    },
    saveEdit() {
      if (this.form.MODULE_ID === this.form.PARENT_MODULE_CODE) {
        this.$message({
            type: "error",
            message: "上级模块不可选择当前模块本身！"
          });
          return;
      }
      this.$refs["moduleForm"].validate(valid => {
        if (!valid) {
          return false;
        } else {
          this.detailLoading = true;
          let url;
          if (this.form.MODULE_ID) {
            url = "Menu/UpdateMod";
          } else {
            url = "Menu/AddMod";
          }
          requestDC({
            url: url,
            method: "post",
            data: this.form
          })
            .then(res => {
              setTimeout(() => {
                this.detailLoading = false;
              }, 300);
              this.$message({
                type: "success",
                message: "保存成功！"
              });
              this.getTreeData();
            })
            .catch(error => {
              setTimeout(() => {
                this.detailLoading = false;
              }, 300);
              this.$message({
                type: "error",
                message: error
              });
            });
        }
      });
    },
    addMod() {
      this.form = {
        MODULE_NAME: "",
        MODULE_ID: "",
        MODULE_URL: "",
        IMAGE_URL: "",
        IS_APP: "",
        ORDER_ID: 1,
        POWER_CODE: "",
        DESCRIPTION: "",
        IS_ENABLE: "1"
      };
      this.modName = "添加";
      this.PARENT_MODULE = "";
      this.form.PARENT_MODULE_CODE = "";
      this.showCancelBtn = true;
      this.checkedKeys = this.$refs.moduleTree.getCheckedKeys();
      this.$refs.moduleTree.setChecked(this.checkedKeys[0]);
    },
    addCancel() {
      this.$refs.moduleTree.setChecked(this.checkedKeys[0], true);
      this.showCancelBtn = false;
    }
  }
};
</script>

<style lang="less">
.menu-config {
  padding: 10px;
  .el-tree {
    font-size: 14px;
  }
  .el-col + .el-col {
    padding-left: 20px;
  }
  .menu-title {
    position: relative;
    width: 100%;
    height: 25px;
    margin-bottom: 10px;
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
  .btn-row {
    text-align: center;
  }
  .parent-box {
    position: relative;
    .el-select-dropdown {
      position: absolute;
      min-width: 50%;
      position: absolute;
      top: 28px;
      left: 0;
      transform-origin: center top;
      z-index: 2081;
    }
  }
  div.el-input__inner {
    width: 178px;
    margin-right: 5px;
    vertical-align: bottom;
    cursor: pointer;
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
      max-width: calc(~"100% - 22px");
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .text-danger {
    color: #f56c6c;
  }
  .btn-xs {
    padding: 4px 11px;
  }
  .fr {
    float: right;
  }
}
#modPopTree {
  height: 300px;
  margin: 0 -10px;
  overflow-y: auto;
}
</style>