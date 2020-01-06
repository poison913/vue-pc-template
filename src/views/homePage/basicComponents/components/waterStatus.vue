<template>
  <div>
    <el-col :span="24">
      <!-- <div class="three-gray-box m-t-10" v-for="(item,index) in testData" :key="index">
        <h5 class="h5-less-margin">{{item.name}}</h5>
        <h5 class="h5-less-margin blue">{{item.value}}</h5>
      </div> -->
      <div class="three-gray-box m-t-10">
        <h5 class="h5-less-margin">最近一个月不合格</h5>
        <h5
          class="h5-less-margin blue"
        >{{monitorInfo.monthNotQualified}}次</h5>
      </div>
      <div class="three-gray-box m-t-10">
        <h5 class="h5-less-margin">本季度监测不合格</h5>
        <h5 class="h5-less-margin blue">{{monitorInfo.quarterNotQualified}}次</h5>
      </div>
      <div class="three-gray-box m-t-10">
        <h5 class="h5-less-margin">本年检测不合格</h5>
        <h5
          class="h5-less-margin blue"
        >{{monitorInfo.yearNotQualified}}次</h5>
      </div>
      <div class="three-gray-box m-t-10">
        <h5 class="h5-less-margin">本年累计监测</h5>
        <h5 class="h5-less-margin blue">{{monitorInfo.yearAllCount}}次</h5>
      </div>
    </el-col>
    <el-col :span="24">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="日常检查" name="first"></el-tab-pane>
        <el-tab-pane label="季度监测" name="second"></el-tab-pane>
      </el-tabs>
      <el-table class="m-t-10" :data="tableData" ref="table"   :height='tableHh'  stripe header-row-class-name="with_bac" border size="mini" style="width: 100%">
        <el-table-column type="index" width="120" label="序号" align="center"></el-table-column>
        <el-table-column prop="COLLECTION_TIME" label="检测时间" align="center"></el-table-column>
        <el-table-column prop="MONITOR_RESULT_NAME" label="最近监测结果" align="center"></el-table-column>
        <el-table-column prop="DISINFECT_TIME" label="操作" align="center">
            <template slot-scope="scope">
                <a class="warning" @click="getDetail(scope.row.MONITOR_MAIN_CODE)" type="text warning" size="small">
                    <strong>查看详情</strong>
                </a>
            </template>
        </el-table-column>
      </el-table>
      <div class="block pull-right">
          <el-pagination
            class="m-t-10"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
    </el-col>
    <!-- 详情模态框 -->
    <el-dialog title="水质详细信息" :visible.sync="resultdialog">
      <el-row :gutter="10">
        <el-col :span="24">
          <span class="demonstration">工程名称：{{projectInfo.basicInfo.PROJECT_NAME}}</span>
        </el-col>
        <el-col :span="12" class="m-t-10">
          <span class="demonstration">水质结果：{{projectInfo.basicInfo.MONITOR_RESULT=='1'?'合格':'不合格'}}</span>
        </el-col>
        <el-col :span="12" class="m-t-10">
          <span class="demonstration">水样采集时间：{{projectInfo.basicInfo.COLLECTION_TIME}}</span>
        </el-col>
        <el-col :span="24" class="m-t-10">
          <el-table 
          :data="projectInfo.indexResult" 
          border 
          size="mini" 
          height="380"
          stripe
           header-row-class-name="with_bac"
          style="width: 100%">
            <el-table-column prop="INDEX_NAME" label="类型" align="center"></el-table-column>
            <el-table-column prop="MONITOR_RESULT" label="检测值" align="center"></el-table-column>
            <el-table-column prop="INDEX_STANDARD_VALUE" label="标准值" align="center"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import $http from "@/utils/requestDC"; //http请求
export default {
  data() {
    return {
      activeName: "first",
      tableLoading:true,
      currentPage:1,
      monitorInfo:{},
      type:1,
      resultdialog:false,
      total:0,
      tableHh:0,
      projectInfo: { basicInfo: {} },
      tableData: [],
      pageSize:10,
    };
  },
  props: { code: { type: String },tableH: { type: String }  },
  created() {
    this.getStatistics();
    this.getListData();
  },
  mounted(){
      this.$nextTick(() => {
            console.log('窗口高度',this.$refs.table.$el.offsetTop)
             this.tableHh = window.innerHeight - this.$refs.table.$el.offsetTop -220;
      })
  },
  methods: {
    //index索引方法
    indexMethod(index) {
      //debugger
      return index + (this.currentPage) * this.pageSize + 1;
    },
    getStatistics() {
      //监测次数统计
      $http({
        url: "ProjectSynthesize/CountTapWaterQualitMonitor",
        method: "post", 
        data: { projectCode: this.code }
      }).then(res => {
        if (res.message.length != 0) {
          this.monitorInfo = res.message[0];
        }
        console.log("供水统计", res);
      });
    },
    getListData() {
      this.tableLoading = true;
      //获取水质监测列表
      $http({
        url: "ProjectSynthesize/ListWaterQualityMonitorMain",
        method: "post",
        data: {
          beginDate: this.$moment().startOf('year').format('YYYY-MM-DD'),
          endDate: this.$moment().format("YYYY-MM-DD"),
          monitorType: this.type,
          projectCode: this.code,
          pageSize: this.pageSize,
          pageNumber: this.currentPage
        }
      }).then(res => {
        setTimeout(() => {
          this.tableLoading = false;
        }, 300);
        this.tableData = res.message.rows;
        console.log(res.message)
        this.total = res.message.total;
      });
    },
    handleClick(tab, event) {
        if(tab.name=='second'){
            this.type = 2;
            this.getListData()
        }else{
            this.type = 1;
            this.getListData()
        }
    },
    getDetail(code) {
      // 查看详情
      $http({
        url: "WaterQuality/GetWaterQualityIndex",
        method: "post",
        data: {
          monitorMainCode: code
        }
      })
        .then(res => {
          this.projectInfo = res.message;
          this.resultdialog = true;
        })
        .catch(res => {
          this.$message({
            type: "error",
            message: res
          });
        });
    },
    handleSizeChange(val) {
      // 分页
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getListData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getListData();
      console.log(`当前页: ${val}`);
    },
  }
};
</script>
<style lang="less" scoped>
.three-gray-box {
  background: #f8f8f8;
  border-radius: 3px;
  width: 23%;
  float: left;
  margin-right: 1%;
  padding: 10px;
  h5 {
    line-height: 24px;
    text-align: center;
  }
}
</style>

