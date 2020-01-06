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
              <el-button type="danger" v-if="!showDetail" @click="cancelTable" size="mini">
                <span class="fa fa-quit m-r-5"></span>取消
              </el-button>
              <!-- <el-button type="primary" size="mini">
                <span class="fa fa-download m-r-5" @click="getPdf()"></span>导出
              </el-button> -->
            </div>
          </div>
          <div id="pdfDom">
          <div class="homePage-box">
            <titleStyle :title="'综合信息'"></titleStyle>
          </div>
          <div class="homePage-box m-t-10">
            <table class="table" border="1" cellspacing="0">
              <tbody>
                <tr>
                  <td class="td-title">工程名称</td>
                  <td class="td-title-bind">
                    <div class="cell" v-if="showDetail" v-text="baseInfo.RURAL_WATER_SUPPLY_NAME"></div>
                    <el-input
                      v-if="!showDetail"
                      v-model="baseInfo.RURAL_WATER_SUPPLY_NAME"
                      placeholder="请输入内容"
                      size="mini"
                    ></el-input>
                  </td>
                  <td class="td-title">编码</td>
                  <td class="td-title-bind">
                    <div class="cell" v-if="showDetail" v-text="baseInfo.SLPC_CODE"></div>
                    <el-input
                      v-if="!showDetail"
                      v-model="baseInfo.SLPC_CODE"
                      placeholder="请输入内容"
                      size="mini"
                    ></el-input>
                  </td>
                </tr>
                <tr>
                  <td class="td-title">所在地</td>
                  <td>
                    <div class="cell" v-if="showDetail" v-text="baseInfo.ADNM"></div>
                    <ThreeTrash
                      ref="select2"
                      :options="adcd2"
                      :init-adcd="initAdcd2"
                      @sendAdcd="getChildAdcd2"
                      v-model="baseInfo.ADMIN_DIV_CODE"
                      style="width:100%"
                      v-if="!showDetail"
                    />
                  </td>
                  <td class="td-title">所在乡镇代码</td>
                  <td>
                    <div class="cell" v-if="showDetail" v-text="baseInfo.ADCD"></div>
                    <el-input
                      v-if="!showDetail"
                      v-model="baseInfo.ADCD"
                      placeholder="请输入内容"
                      size="mini"
                    ></el-input>
                  </td>
                </tr>
                <tr>
                  <td class="td-title">工程所在地经<span v-if="showDetail">纬</span>度</td>
                  <td class="td-title-bind">
                    <div class="cell" v-if="showDetail" v-text="baseInfo.LONGITUDE+','+baseInfo.LATITUDE"></div>
                    <el-input
                      v-if="!showDetail"
                      v-model="baseInfo.LONGITUDE"
                      placeholder="请输入内容"
                      size="mini"
                    ></el-input>
                  </td>
                  <td class="td-title">
                    <span v-if="showDetail">所在县</span>
                    <span v-if="!showDetail">工程所在地纬度</span>
                  </td>
                  <td class="td-title-bind">
                    <div class="cell" v-if="showDetail" v-text="baseInfo.COUNTY_NAME"></div>
                    <el-input
                      v-if="!showDetail"
                      v-model="baseInfo.LATITUDE"
                      placeholder="请输入内容"
                      size="mini"
                    ></el-input>
                  </td>
                </tr>
                <tr>
                  <td class="td-title">设计供水人口（人）</td>
                  <td>
                    <div class="cell" v-if="showDetail" v-text="baseInfo.DESGIN_SUPPLY_POPULATION"></div>
                    <el-input
                      v-if="!showDetail"
                      v-model="baseInfo.DESGIN_SUPPLY_POPULATION"
                      placeholder="请输入内容"
                      size="mini"
                    ></el-input>
                  </td>
                  <td class="td-title">工程类型</td>
                  <td>
                    <div
                      class="cell"
                      v-if="showDetail"
                      v-text="baseInfo.PROJECT_TYPE_BY_SCALE_NAME"
                    ></div>
                    <el-select
                      class="width-100"
                      v-if="!showDetail"
                      v-model="baseInfo.PROJECT_TYPE_BY_SCALE"
                      clearable
                      size="mini"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in projectTypeOptions"
                        :key="item.CODE"
                        :label="item.NAME"
                        :value="item.CODE"
                      ></el-option>
                    </el-select>
                  </td>
                </tr>
                <tr>
                  <td class="td-title">供水类型</td>
                  <td class="td-title-bind">
                    <div
                      class="cell"
                      v-if="showDetail"
                      v-text="baseInfo.PROJECT_TYPE_BY_SUPPLY_TYPE_NAME"
                    ></div>
                    <el-select
                      class="width-100"
                      v-if="!showDetail"
                      v-model="baseInfo.PROJECT_TYPE_BY_SUPPLY_TYPE"
                      clearable
                      size="mini"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in waterTypeOptions"
                        :key="item.CODE"
                        :label="item.NAME"
                        :value="item.CODE"
                      ></el-option>
                    </el-select>
                  </td>
                  <td class="td-title">供应村落数量</td>
                  <td class="td-title-bind">
                    <div class="cell" v-if="showDetail" v-text="baseInfo.DESGIN_SUPPLY_VILLAGES"></div>
                    <el-input
                      v-if="!showDetail"
                      v-model="baseInfo.DESGIN_SUPPLY_VILLAGES"
                      placeholder="请输入内容"
                      size="mini"
                      disabled
                    ></el-input>
                  </td>
                </tr>
                
                <tr>
                  <td class="td-title">水源地名称</td>
                  <td>
                    <div class="cell" v-if="showDetail" v-text="baseInfo.WATER_SOURCE_NAME"></div>
                    <el-input
                      v-if="!showDetail"
                      v-model="baseInfo.WATER_SOURCE_NAME"
                      placeholder="请输入内容"
                      size="mini"
                    ></el-input>
                  </td>
                  <td class="td-title">水源地类型</td>
                  <td>
                    <div class="cell" v-if="showDetail" v-text="baseInfo.WATER_SOURCE_TYPE_NAME"></div>
                    <el-select
                      class="width-100"
                      v-if="!showDetail"
                      v-model="baseInfo.WATER_SOURCE_TYPE"
                      clearable
                      size="mini"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in waterSourceOptions"
                        :key="item.CODE"
                        :label="item.NAME"
                        :value="item.CODE"
                      ></el-option>
                    </el-select>
                  </td>
                </tr>
                <tr>
                  <td class="td-title">水源地经度</td>
                  <td class="td-title-bind">
                    <div class="cell" v-if="showDetail" v-text="baseInfo.WATER_SOURCE_LONGITUDE"></div>
                    <el-input
                      v-if="!showDetail"
                      v-model="baseInfo.WATER_SOURCE_LONGITUDE"
                      placeholder="请输入内容"
                      size="mini"
                    ></el-input>
                  </td>
                  <td class="td-title">水源地纬度</td>
                  <td class="td-title-bind">
                    <div class="cell" v-if="showDetail" v-text="baseInfo.WATER_SOURCE_LATITUDE"></div>
                    <el-input
                      v-if="!showDetail"
                      v-model="baseInfo.WATER_SOURCE_LATITUDE"
                      placeholder="请输入内容"
                      size="mini"
                    ></el-input>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        
        <!-- <div class="homePage-box m-t-10">
          <div class="button-box">
            <el-button type="primary" size="mini">编辑</el-button>
            <el-button type="primary" size="mini">导出</el-button>
          </div>
        </div>-->
        <div class="homePage-box m-t-10">
          <titleStyle :title="'特征指标'"></titleStyle>
        </div>
        <div class="homePage-box m-t-10">
          <table class="table" border="1" cellspacing="0">
            <tbody>
              <tr>
                <td class="td-title">供水企业个数（个）</td>
                <td class="td-title-bind">
                  <div class="cell" v-if="showDetail" v-text="baseInfo.SUPPLY_COMPANY_COUNT"></div>
                  <el-input
                    v-if="!showDetail"
                    v-model="baseInfo.SUPPLY_COMPANY_COUNT"
                    placeholder="请输入内容"
                    size="mini"
                  ></el-input>
                </td>
                <td class="td-title">供水事业单位个数（个）</td>
                <td>
                  <div
                    class="cell"
                    v-if="showDetail"
                    v-text="baseInfo.SUPPLY_GOV_INSTITUTION_COUNT"
                  ></div>
                  <el-input
                    class="width-100"
                    v-if="!showDetail"
                    v-model="baseInfo.SUPPLY_GOV_INSTITUTION_COUNT"
                    placeholder="请输入内容"
                    size="mini"
                  ></el-input>
                </td>
              </tr>
              <tr>
                <td class="td-title">设计供水规模（m3/d）</td>
                <td class="td-title-bind">
                  <div class="cell" v-if="showDetail" v-text="baseInfo.DESIGN_SUPPLY_SCALE"></div>
                  <el-input
                    v-if="!showDetail"
                    v-model="baseInfo.DESIGN_SUPPLY_SCALE"
                    placeholder="请输入内容"
                    size="mini"
                  ></el-input>
                </td>
                <td class="td-title">完工时间</td>
                <td>
                  <div class="cell" v-if="showDetail" v-text="baseInfo.COMPLETE_TIME"></div>
                  <el-date-picker
                    v-model="baseInfo.COMPLETE_TIME"
                    type="date"
                    style="width:100%;"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    v-if="!showDetail"
                    size="mini"
                  ></el-date-picker>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
        <div class="homePage-box m-t-10">
          <div class="button-box">
            <el-button type="success" @click="addPerson" size="mini" v-if="userType&&auth.indexOf(2)>-1">
              <span class="fa fa-plus m-r-5"></span>新增
            </el-button>
            <!-- <el-button type="primary" size="mini">
              <span class="fa fa-download m-r-5"></span>导出
            </el-button> -->
          </div>
        </div>
        <div class="homePage-box m-t-10">
          <titleStyle :title="'供应村人口覆盖情况'"></titleStyle>
        </div>
        <div class="homePage-box m-t-10">
          <el-table
            :data="personData"
            border
            stripe
            header-row-class-name="with_bac"
            size="mini"
            style="width: 100%"
          >
            <el-table-column prop="SUPPLY_VILLAGES_NAME" label="供应村名称" align="center"></el-table-column>
            <el-table-column prop="SUPPLY_POPULATION" label="供应村人口（人）" align="center"></el-table-column>
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
    <el-dialog title="新增供应村人口覆盖情况" :visible.sync="dialogVisible" width="500px">
      <el-form ref="form" :model="form" :rules="formRules" label-width="150px">
        <el-form-item label="供应村名称" prop="SUPPLY_VILLAGE_CODE">
          <el-select
            v-model="form.SUPPLY_VILLAGE_CODE"
            placeholder="请选择供应村"
            clearable
            filterable
            size="mini"
          >
            <el-option
              v-for="item in valList"
              :key="item.index"
              :label="item.ADMIN_DIV_NAME"
              :value="item.ADMIN_DIV_CODE"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应村人口（人）" prop="SUPPLY_POPULATION">
          <el-input v-model="form.SUPPLY_POPULATION" size="mini" style="width:185.4px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="onSubmit">确定</el-button>
          <el-button size="mini" @click="cencelPerson">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import titleStyle from "@/components/Title/index"; //标题栏组件
import ThreeTrash from "@/components/select"; //行政区划下拉框
import $http from "@/utils/requestDC";
import { getUserInfo } from "@/utils/auth";
import { getAdcd } from "@/api/adcd";
export default {
  components: { titleStyle, ThreeTrash },
  props: { code: { type: String },
  auth:{type:Array} },
  data() {
    const userInfo = getUserInfo();
    return {
      htmlTitle: "页面导出PDF文件名",
      adcd2: [
        {
          ADCD: userInfo.ADCD, //顶级政区编码
          ADMIN_DIV_NAME: userInfo.ADMIN_DIV_NAME, //顶级政区名
          children: [], //固定传空
          level: 1, //顶级所在位置，固定为1
          isClear: false //是否可清除值
        } // 初始化传入当前行政区划的顶级
      ],
      initAdcd2: {
        adcd: userInfo.ADCD, //选择绑定的值
        level: 1, //绑定值所在政区的级别
        step: 3 //允许选择的最大级别
      },
      form: {
        SUPPLY_POPULATION: "",
        SUPPLY_VILLAGE_CODE: "",
        RURAL_WATER_SUPPLY_ID: ""
      },
      formRules: {
        SUPPLY_VILLAGE_CODE: [
          { required: true, message: "请选择供应村", trigger: "blur" }
        ],
        SUPPLY_POPULATION: [
          { required: true, message: "请输入供应村人口（人）", trigger: "blur" }
        ]
      },
      showDetail: true,
      testCode: "",
      currentPage: 1,
      errTitle: "",
      dialogVisible: false,
      baseInfo: {},
      personData: [],
      waterTypeOptions: [], // 供水类型
      projectTypeOptions: [], // 工程类型
      waterSourceOptions: [], // 水源类型
      valList: [], // 供应村
      userType: ""
    };
  },
  created() {
    console.log('this.auth',this.auth)
    let type = getUserInfo().USER_TYPE == 9 ? true : false; // true 是监管 false 运管
    this.userType = type;
    this.testCode = this.code;
    this.getWaterType();
    this.getProjectType();
    this.getSouceType();
  },
  mounted() {
    this.searchBaseInfo();
    this.getPersonData();
  },
  methods: {
    //获取枚举
    getWaterType() {
      // 供水类型
      $http({
        url: "Enumerate/EnumsProjectTypeBySupply",
        method: "post",
        data: {}
      }).then(res => {
        this.waterTypeOptions = res.message;
        console.log("type", res);
      });
    },
    getProjectType() {
      // 工程类型
      $http({
        url: "Enumerate/EnumsProjectTypeByScale",
        method: "post",
        data: {}
      }).then(res => {
        this.projectTypeOptions = res.message;
        console.log("type", res);
      });
    },
    getSouceType() {
      // 水源类型
      $http({
        url: "Enumerate/EnumsProjectTypeByWaterSource",
        method: "post",
        data: {}
      }).then(res => {
        this.waterSourceOptions = res.message;
        console.log("type", res);
      });
    },
    getChildAdcd2: function(adcd) {
      const Num = adcd.length;
      //console.log("来自子页面的" + adcd[Num - 1]); //定义了sendAdcd接收组件的值
      if (Num > 0) this.prjForm.ADMIN_DIV_CODE = adcd[Num - 1];
    },
    searchBaseInfo() {
      $http({
        url: "ProjectInfo/GetProjectRuralWaterSupplyBaseInfos",
        method: "post",
        data: {
          projectCode: this.testCode
        }
      }).then(res => {
        this.baseInfo = res.message;
        this.getVillInfo(this.baseInfo.ADCD);
        if (res.message.ADCD.length == 9) {
          this.initAdcd2.level = 2;
        }
        this.initAdcd2.adcd = res.message.ADCD;
        // this.adcd2.ADCD = res.message.CITY_CODE;

        // this.initAdcd2.ADCD = res.message.CITY_CODE;
        // this.adcd2.ADMIN_DIV_NAME = res.message.CITY_Name;
        console.log("基础信息", res);
      });
    },
    saveBaseInfo() {
      this.baseInfo.ADMIN_DIV_CODE = this.baseInfo.ADCD;
      this.baseInfo.HAS_CREATED_STANDARD =
        this.baseInfo.HAS_CREATED_STANDARD == "是" ? 1 : 0;
      this.baseInfo.IS_REPORTED = this.baseInfo.IS_REPORTED == "是" ? 1 : 0;
      this.baseInfo.IS_SHOWN_PANORAMA =
        this.baseInfo.IS_SHOWN_PANORAMA == "是" ? 1 : 0;
      $http({
        url: "ProjectInfo/UpdateProjectRuralWaterSupplyBaseInfos",
        method: "post",
        data: this.baseInfo
      }).then(res => {
        if (res.status == 0) {
          this.searchBaseInfo();
        } else {
          alert(res.message);
        }

        console.log("更新完成", res);
      });
    },
    getPersonData() {
      // 查询人员列表
      $http({
        url: "ProjectInfo/ListProjectSupplyVillagesInfos",
        method: "post",
        data: {
          projectCode: this.testCode,
          // pageSize: 10,
          // pageNumber: this.currentPage
        }
      }).then(res => {
        this.personData = res.message;
        // this.total = res.message.total;
        console.log(res);
      });
    },
    editTable() {
      // 编辑 or 保存
      if (this.showDetail == false) {
        this.saveBaseInfo();
      }
      this.showDetail = !this.showDetail;
    },
    cancelTable() {
      this.showDetail = !this.showDetail;
    },
    addPerson() {
      // 打开模态框
      this.form = {
        SUPPLY_POPULATION: "",
        SUPPLY_VILLAGE_CODE: "",
        RURAL_WATER_SUPPLY_ID: this.baseInfo.RURAL_WATER_SUPPLY_ID
      };
      this.dialogVisible = true;
    },
    getVillInfo(code = "") {
      getAdcd(code).then(res => {
        this.valList = res.message;
        console.log("行政村", res);
      });
    },
    cencelPerson() {
      this.dialogVisible = false;
    },
    savePerson() {
      // 保存 村人口
      if (this.form.ID) {
        $http({
          url: "ProjectInfo/UpdateProjectSupplyVillagesInfos",
          method: "post",
          data: this.form
        })
          .then(res => {
            this.dialogVisible = false;
            this.getPersonData();
            console.log(res);
          })
          .catch(res => {
            console.log(res);
            this.$message.error(res);
          });
      } else {
        $http({
          url: "ProjectInfo/AddProjectSupplyVillagesInfos",
          method: "post",
          data: this.form
        })
          .then(res => {
            this.dialogVisible = false;
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
          this.$confirm("确认提交吗？")
            .then(_ => {
              this.savePerson();
            })
            .catch(_ => {});
        }
      });
    },
    editPerson(data) {
      // 点击编辑按钮
      this.form = data;
      this.dialogVisible = true;
      console.log(data);
    },
    deletePerson(data) {
      console.log(data);
      // 点击删除
      this.$confirm("确认删除吗？")
        .then(_ => {
          this.confDelPerson(data.ID, data.RURAL_WATER_SUPPLY_ID);
        })
        .catch(_ => {});
    },
    confDelPerson(id, Rid) {
      // 确定删除
      $http({
        url: "ProjectInfo/DeleteProjectSupplyVillagesInfos",
        method: "post",
        data: { ID: id, RURAL_WATER_SUPPLY_ID: Rid }
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
          this.$message.error(res);
        });
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
.width-100 {
  width: 100%;
}
</style>


