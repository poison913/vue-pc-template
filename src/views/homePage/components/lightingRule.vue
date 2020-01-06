/*作者: 陈凯歌 开发日期: 2019/04/16
 页面描述：亮灯规则的表格   修改人员：****  修改日期：****  */

<template>
  <el-row :gutter="10">
    <el-col :span="24">
      <el-table
        :data="tableData"
        :span-method="arraySpanMethod"
        border
        stripe
        header-row-class-name="with_bac"
        style="100%"
      >
        <el-table-column prop="key1" label="工程状态"></el-table-column>
        <el-table-column prop="key2" label="监管事项"></el-table-column>
        <el-table-column prop="key3" label="具体内容"></el-table-column>
        <el-table-column prop="key4" label="红灯规则(显示状态)"></el-table-column>
        <el-table-column prop="key5" label="黄灯规则(显示状态)"></el-table-column>
        <el-table-column prop="key6" label="绿灯规则(显示状态)"></el-table-column>
      </el-table>
    </el-col>
    <el-col :span="24" class="m-t-10">
        <el-button @click="download()" type="primary" class="pull-right" size="small"><i class="fa fa-download m-r-5"></i>下载</el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "lightingRule",
  data() {
    return {
      tableData: [
        {
          key1: "运行状态",
          key2: "供水状态",
          key3: "是否正在供水",
          key4: "/",
          key5: "停止供水(停供中)",
          key6: "正在供水（供水中）"
        },
        {
          key1: "水质状态",
          key2: "水质是否合格",
          key3: "水质不合格（不合格）",
          key4: "/",
          key5: "水质合格（合格）"
        },
        {
          key1: "管理动态",
          key2: "水质日常检测",
          key3: "Ⅰ～Ⅲ型水厂是否按规定开展出厂水水质日常检测",
          key4: "超过1天未检测（逾期未检测）",
          key5: "1天内未检测（待检测）",
          key6: "已完成检测（已检测）"
        },
        {
          key1: "水质季度检测",
          key2: "Ⅰ～Ⅲ型水厂是否按规定开展出厂水水质季度检测",
          key3: "超过90天未检测（逾期未检测）",
          key4: "超过80天未检测（待检测）",
          key5: "80天以内未检测（进行中）或已完成检测（已检测）"
        },
        {
          key1: "Ⅳ型水厂出厂水检测",
          key2: "Ⅳ型水厂是否按规定开展出厂水丰枯期水质检测",
          key3:
            "10月1日-4月30日期间未进行水质检测（5月1日开始判断）或5月1日-9月30日期间未进行水质检测（10月1日开始判断）（逾期未检测）",
          key4:
            "4月1-30日未完成枯水期水质检测或9月1-30日未完成丰水期水质检测（待检测）",
          key5:
            "4月1日前未完成枯水期水质检测9月1日前未完成丰水期水质检测（进行中）或4月30日前已完成水质检测（已检测）"
        },
        {
          key1: "工程隐患",
          key2: "是否按计划开展隐患治理",
          key3: "有逾期未治理工程隐患（逾期未治理）",
          key4: "在（计划治理完成时间-隐患发现时间）*20%的天数内（待治理）",
          key5:
            "计划期内已完成治理（已治理）或在（计划治理完成时间-隐患发现时间）*80%的天数内（治理中）"
        }
      ]
    };
  },

  components: {},

  created() {},

  mounted() {},

  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      //console.log(row, column, rowIndex, columnIndex)
      //debugger
      if (rowIndex === 0) {
        if (columnIndex === 0) {
          return { rowspan: 2, colspan: 1 };
        }
      }
      if (rowIndex === 2) {
        if (columnIndex === 0) {
          return { rowspan: 4, colspan: 1 };
        }
      }
    },
    //下载文件
    download(){
        window.open('https://web.dcyun.com:38006/Files/Template/亮灯规则.pdf');
    }
  }
};
</script>
<style lang='less' scoped>
</style>