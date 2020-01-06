/* 作者：陈博文  开发日期：2019-04-01
   页面描述：平台管理
   修改人员：****  修改日期：****
 */
<template>
  <div id="platformConfig">
    <el-row>
      <el-form :model="params" size="mini" class="search-row" inline>
        <el-form-item label="行政区划" label-width="80px">
          <ThreeTrash
            :options="adcd"
            :init-adcd="initAdcd"
            @sendAdcd="getChildAdcd"
            v-model="params.adcd"
            class="simpleSelect"
          />
        </el-form-item>
        <!-- <el-form-item label="管理单位类型" label-width="100px">
          <el-input v-model="unitType" autocomplete="off" clearable></el-input>
        </el-form-item>-->
        <el-form-item label="平台名称" label-width="80px">
          <el-input v-model="params.supplementName" autocomplete="off" clearable></el-input>
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
        v-loading="tableLoading"
      >
        <el-table-column type="index" label="序号" :index="indexMethod" width="50" align="center"></el-table-column>
        <el-table-column prop="PLATFORM_NAME" label="平台名称" align="center"></el-table-column>
        <el-table-column prop="SUPPLEMENT_NAME" label="平台管理单位" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.SUPPLEMENT_NAME | spaceX}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ADMIN_USER_NAME" label="管理员用户名" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.ADMIN_USER_NAME | spaceX}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ADMIN_DIV_NAME" label="行政区划" width="100" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.ADMIN_DIV_NAME | spaceX}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="PROJECT_COUNT" label="已关联的工程数量" width="150" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.PROJECT_COUNT | spaceX}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <a class="success m-r-5" @click="handleRelate(scope.row)">关联</a>
            <a class="blue m-r-5" @click="handleEdit(scope.row)">编辑</a>
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
      width="600px"
      v-loading="modalLoading"
      @close="hideADCD"
    >
      <el-form :model="form" :rules="rules" ref="editForm" size="mini" novalidate>
        <el-form-item label="管理单位名称" label-width="110px" prop="SUPPLEMENT_NAME">
          <el-input v-model="form.SUPPLEMENT_NAME" clearable></el-input>
        </el-form-item>
        <el-form-item label="平台名称" label-width="110px" prop="PLATFORM_NAME">
          <el-input v-model="form.PLATFORM_NAME" clearable></el-input>
        </el-form-item>
        <el-form-item label="行政区划" label-width="110px" prop="ADCD">
          <ThreeTrash
            :options="adcd"
            :init-adcd="initFormAdcd"
            @sendAdcd="getFormAdcd"
            v-model="form.ADCD"
            v-if="showAdcd"
            class="simpleSelect"
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item label="管理员用户名" label-width="110px" prop="ADMIN_USER_NAME" v-show="isAdd">
          <el-input v-model="form.ADMIN_USER_NAME" :required="isAdd" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系人" label-width="110px" prop="LINKMAN">
          <el-input v-model="form.LINKMAN" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系人手机" label-width="110px" prop="MOBILE">
          <el-input v-model="form.MOBILE" clearable></el-input>
        </el-form-item>
        <el-form-item label="平台经度" label-width="110px" prop="LONGITUDE">
          <el-input v-model="form.LONGITUDE" clearable></el-input>
        </el-form-item>
        <el-form-item label="平台纬度" label-width="110px" prop="LATITUDE">
          <el-input v-model="form.LATITUDE" clearable></el-input>
        </el-form-item>
        <el-form-item label="登录跳转页面" label-width="110px" prop="INTERFACE_URL">
          <el-input v-model="form.INTERFACE_URL" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="saveEdit" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 管理单位工程关联 -->
    <el-dialog
      title="管理单位工程关联"
      :visible.sync="relatedDialog"
      :close-on-click-modal="false"
      width="600px"
      v-loading="modalLoading"
      @close="hideADCD"
      top="5vh"
    >
      <el-form :model="relateForm" ref="relateForm" size="mini" novalidate>
        <el-form-item label="管理单位名称" label-width="110px" prop="SUPPLEMENT_NAME">
          <!-- <el-input v-model="relateForm.SUPPLEMENT_NAME" disabled></el-input> -->
          <div class="el-input el-input--mini" v-text="relateForm.SUPPLEMENT_NAME"></div>
        </el-form-item>
        <el-form-item label="行政区划" label-width="110px" prop="ADCD">
          <ThreeTrash
            :options="adcd"
            :init-adcd="initRelateAdcd"
            @sendAdcd="getRelateAdcd"
            v-model="relateForm.ADCD"
            v-if="showAdcd"
            class="simpleSelect"
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item label="是否直属工程" label-width="110px" prop="isDirectlyUnder">
          <el-radio-group v-model="relateForm.isDirectlyUnder">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
          <span class="p-l-10">工程为该平台直接管理选择“是”，否则选“否”</span>
        </el-form-item>
        <el-form-item label="是否重复关联" label-width="110px" prop="isDuplicate">
          <el-radio-group v-model="relateForm.isDuplicate" @change="radioChange">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
          <span class="p-l-10">排除已关联的工程(不再考虑已关联的工程)</span>
        </el-form-item>
      </el-form>
      <el-transfer
        filterable
        :titles="['未关联工程', '已关联工程']"
        :filter-method="filterMethod"
        filter-placeholder="请输入工程名称"
        v-model="transferSelected"
        :data="transferData"
        ref="transfer"
        :props="transferProps"
        @change="handleTransferChange"
        v-loading="transferLoading"
      ></el-transfer>
    </el-dialog>
  </div>
</template>

<script>
import requestDC from "@/utils/requestDC";
import ThreeTrash from "@/components/select";
// import PlatTranser from "./components/platTransfer";
import { getUserInfo } from "@/utils/auth";
export default {
  data() {
    //手机号校验
    const checkPhone = (rule, value, callback) => {
      if (value) {
        setTimeout(() => {
          if (!/^1\d{10}$/.test(value)) {
            callback(new Error("请输入正确的手机号码"));
          } else {
            callback();
          }
        }, 100);
      } else {
        callback();
      }
    };
    // 经度校验
    const checkLongitude = (rule, value, callback) => {
      if (value) {
        setTimeout(() => {
          if (!/^\d+(\.)?(\d+)?$/.test(value)) {
            callback(new Error("请输入正确的数字值"));
          } else if (value <= 118 || value >= 123) {
            callback(new Error("经度已超出浙江省范围"));
          } else {
            callback();
          }
        }, 100);
      } else {
        callback();
      }
    };
    // 纬度校验
    const checkLatitude = (rule, value, callback) => {
      if (value) {
        setTimeout(() => {
          if (!/^\d+(\.)?(\d+)?$/.test(value)) {
            callback(new Error("请输入正确的数字值"));
          } else if (value <= 27 || value >= 32) {
            callback(new Error("纬度已超出浙江省范围"));
          } else {
            callback();
          }
        }, 100);
      } else {
        callback();
      }
    };
    const userInfo = getUserInfo();
    let step = 2; //级联选择器的跨级数，根据用户的adcd来判断
    if (userInfo.ADCD.length === 2) step = 3;
    else step = 2;
    return {
      params: {
        adcd: "",
        supplementName: ""
      },
      tableData: [],
      totalDataCount: 0,
      pageSize: 20,
      currentPage: 1,
      tableLoading: false,
      dialogTitle: "",
      dialogFormVisible: false,
      modalLoading: false,
      isAdd: false,
      form: {
        SUPPLEMENT_NAME: "",
        PLATFORM_NAME: "",
        ADCD: userInfo.ADCD,
        LINKMAN: "",
        MOBILE: "",
        INTERFACE_URL: "",
        LONGITUDE: "",
        LATITUDE: ""
      },
      rules: {
        SUPPLEMENT_NAME: [
          { required: true, message: "请输入管理单位名称", trigger: "blur" }
        ],
        PLATFORM_NAME: [
          { required: true, message: "请输入平台名称", trigger: "blur" }
        ],
        MOBILE: [{ required: false, validator: checkPhone, trigger: "blur" }],
        LONGITUDE: [
          { required: false, validator: checkLongitude, trigger: "blur" }
        ],
        LATITUDE: [
          { required: false, validator: checkLatitude, trigger: "blur" }
        ],
        ADCD: [{ required: true, message: "请选择行政区划", trigger: "blur" }],
        ADMIN_USER_NAME: [
          { required: false, message: "请输入管理员用户名", trigger: "blur" }
        ]
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
        step: step, //允许选择的最大级别
        isLock: false
      },
      initFormAdcd: {
        adcd: "", //选择绑定的值
        level: 1, //绑定值所在政区的级别
        step: step, //允许选择的最大级别
        isLock: false
      },
      initRelateAdcd: {
        adcd: userInfo.ADCD, //选择绑定的值
        level: 1, //绑定值所在政区的级别
        step: step, //允许选择的最大级别
        isLock: false
      },
      showAdcd: false,
      userInfo: {},
      relatedDialog: false,
      relateForm: {
        ADCD: "",
        SUPPLEMENT_NAME: "",
        isDuplicate: "0",
        isDirectlyUnder: "1"
      },
      transferData: [],//所有选项
      transferSelected: [],//实际的已选项
      unSelectedList: [],//接口获取的未选部分
      selectedList: [],//接口获取的已选部分
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1;
      },
      transferProps: {
        key: "PROJECT_CODE",
        label: "PROJECT_NAME"
      },
      transferLoading: false
    };
  },
  components: { ThreeTrash },
  mounted() {
    this.userInfo = getUserInfo();
    this.getTableData();
  },
  methods: {
    hideADCD() {
      this.showAdcd = false;
    },
    getChildAdcd: function(adcd) {
      if (adcd.length >= 1) {
        this.params.adcd = adcd[adcd.length - 1];
      } else {
        this.params.adcd = "";
      }
    },
    getRelateAdcd: function(adcd) {
      if (adcd.length >= 1) {
        this.relateForm.ADCD = adcd[adcd.length - 1];
        this.handleRelate(this.relateForm, true);
      } else {
        this.relateForm.ADCD = "";
      }
    },
    getFormAdcd: function(adcd) {
      if (adcd.length >= 1) {
        this.form.ADCD = adcd[adcd.length - 1];
      } else {
        this.form.ADCD = "";
      }
    },
    stopLoading(loadingName) {
      setTimeout(() => {
        this[loadingName] = false;
      }, 300);
    },
    getTableData() {
      this.tableLoading = true;
      requestDC({
        url: "Platform/ListPlatform",
        method: "post",
        data: {
          adcd: this.params.adcd,
          supplementName: this.params.supplementName,
          unitType: "",
          pageSize: this.pageSize,
          pageNumber: this.currentPage
        }
      })
        .then(res => {
          this.stopLoading("tableLoading");
          this.tableData = res.message.rows;
          this.totalDataCount = res.message.total;
        })
        .catch(error => {
          this.stopLoading("modalLoading");
          this.$message({
            type: "error",
            message: error
          });
        });
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.dialogTitle = "添加平台";
      this.showAdcd = false;
      this.isAdd = true;
      this.rules.ADMIN_USER_NAME[0].required = true;
      this.form = {
        SUPPLEMENT_NAME: "",
        PLATFORM_NAME: "",
        ADCD: this.userInfo.ADCD,
        LINKMAN: "",
        MOBILE: "",
        INTERFACE_URL: "",
        LONGITUDE: "",
        LATITUDE: ""
      };
      this.initFormAdcd = {
        adcd: this.userInfo.ADCD,
        level: this.userInfo.ADCD.length / 2,
        step: 3, //允许选择的最大级别
        isLock: false
      };
      this.$nextTick(() => {
        this.showAdcd = true;
        this.$refs["editForm"].clearValidate();
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.getTableData();
    },
    handleEdit(row) {
      this.modalLoading = true;
      this.showAdcd = false;
      this.isAdd = false;
      this.rules.ADMIN_USER_NAME[0].required = false;
      requestDC({
        url: "Platform/GetPlatform",
        method: "post",
        data: {
          supplementCode: row.SUPPLEMENT_CODE
        }
      })
        .then(({ message }) => {
          this.dialogTitle = "编辑平台";
          this.dialogFormVisible = true;
          this.form = message;
          this.form = {
            SUPPLEMENT_NAME: message.SUPPLEMENT_NAME,
            SUPPLEMENT_CODE: message.SUPPLEMENT_CODE,
            PLATFORM_NAME: message.PLATFORM_NAME,
            ADCD: message.ADCD,
            LINKMAN: message.LINKMAN,
            MOBILE: message.MOBILE,
            INTERFACE_URL: message.INTERFACE_URL,
            LONGITUDE: message.LONGITUDE,
            LATITUDE: message.LATITUDE
          };
          if (message.ADCD) {
            this.initFormAdcd = {
              adcd: message.ADCD,
              level: message.ADCD.length / 2,
              step: 3, //允许选择的最大级别
              isLock: false
            };
          } else {
            this.initFormAdcd = {
              adcd: "",
              level: 1,
              step: 3, //允许选择的最大级别
              isLock: false
            };
          }
          this.$nextTick(_ => {
            this.$refs["editForm"].clearValidate();
          });
          this.showAdcd = true;
          this.stopLoading("modalLoading");
        })
        .catch(error => {
          this.stopLoading("modalLoading");
          this.$message({
            type: "error",
            message: error
          });
        });
    },
    saveEdit() {
      this.$refs["editForm"].validate(valid => {
        console.log(valid);
        if (!valid) {
          return false;
        } else {
          let url, msg;
          if (this.form.SUPPLEMENT_CODE) {
            url = "Platform/UpdatePlatform";
            msg = "编辑平台成功！";
          } else {
            url = "Platform/AddPlatform";
            msg = "添加平台成功！";
          }
          requestDC({
            url: url,
            method: "post",
            data: this.form
          })
            .then(res => {
              this.getTableData();
              this.dialogFormVisible = false;
              this.$message({
                type: "success",
                message: msg
              });
            })
            .catch(error => {
              this.$message({
                type: "error",
                message: error
              });
            });
        }
      });
    },
    //获取相关工程
    getRelatedProject(isSelected) {
      return new Promise((resolve, reject) => {
        requestDC({
          url: "Platform/ListProjectByPlatform",
          method: "post",
          data: {
            adcd: this.relateForm.ADCD,
            projectName: "",
            isDuplicate: this.relateForm.isDuplicate,
            isSelected: isSelected,
            supplementCode: this.relateForm.SUPPLEMENT_CODE
          }
        })
          .then(({ message }) => {
            if (message.length > 0) {
              message.forEach(item => {
                item.key = item.PROJECT_CODE;
                item.label = item.PROJECT_NAME;
              });
            }
            if (isSelected) {
              this.selectedList = message;
              this.transferSelected = [];
              if (message.length > 0) {
                message.forEach(item => {
                  item.key = item.PROJECT_CODE;
                  item.label = item.PROJECT_NAME;
                  this.transferSelected.push(item.PROJECT_CODE);
                });
              }
            } else {
              this.unSelectedList = message;
            }
            resolve();
          })
          .catch(error => {
            reject();
          });
      });
    },
    //打开关联模态框
    async handleRelate({ ADCD, SUPPLEMENT_CODE, SUPPLEMENT_NAME }, isRefresh) {
      this.transferLoading = true;
      try {
        this.relateForm = {
          SUPPLEMENT_NAME: SUPPLEMENT_NAME,
          SUPPLEMENT_CODE: SUPPLEMENT_CODE,
          ADCD: ADCD,
          isDirectlyUnder: isRefresh ? this.relateForm.isDirectlyUnder : "1",
          isDuplicate: isRefresh ? this.relateForm.isDuplicate : "0"
        };
        //获取已关联和未关联数据以后，再整合数据
        let [foo, bar] = await Promise.all([
          this.getRelatedProject(1),
          this.getRelatedProject(0)
        ]);
        this.transferData = this.unSelectedList.concat(this.selectedList);
        this.initRelateAdcd = {
          adcd: ADCD, //选择绑定的值
          level: ADCD.length / 2, //绑定值所在政区的级别
          step: 3, //允许选择的最大级别
          isLock: false
        };
        this.showAdcd = true;
        this.relatedDialog = true;
        setTimeout(() => {
          this.transferLoading = false;
        }, 300);
      } catch (error) {
        this.$message({
          type: "error",
          message: error
        });
      }
    },
    radioChange(val) {
      this.handleRelate(this.relateForm, true);
    },
    handleTransferChange(value, direction, movedKeys) {
      if (direction === "right") {
        requestDC({
          url: "Platform/SavePlatformProjectRelation",
          method: "post",
          data: {
            projectCodes: movedKeys.join(","),
            isDirectlyUnder: this.relateForm.isDirectlyUnder,
            supplementCode: this.relateForm.SUPPLEMENT_CODE
          }
        })
          .then(({ message }) => {
            this.$message({
              type: "success",
              message: "关联成功！"
            });
            this.getTableData();
            // this.relatedDialog = false;
          })
          .catch(error => {
            this.$message({
              type: "error",
              message: error
            });
          });
      } else {
        requestDC({
          url: "Platform/DeletePlatformProjectRelation",
          method: "post",
          data: {
            projectCodes: movedKeys.join(","),
            supplementCode: this.relateForm.SUPPLEMENT_CODE
          }
        })
          .then(({ message }) => {
            this.$message({
              type: "success",
              message: "取消关联成功！"
            });
            this.getTableData();
          })
          .catch(error => {
            this.$message({
              type: "error",
              message: error
            });
          });
      }
    },
    //index索引方法
    indexMethod(index) {
      return index + (this.currentPage - 1) * this.pageSize + 1;
    }
  }
};
</script>

<style lang="less" scoped>
#platformConfig {
  padding: 10px;
  .right-btn {
    float: right;
  }
  .el-pagination {
    margin-top: 10px;
    text-align: right;
  }
  .p-l-10 {
    padding-left: 10px;
  }
}
</style>
