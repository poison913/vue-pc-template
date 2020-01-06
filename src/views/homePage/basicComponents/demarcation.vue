<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="水源地保护范围" name="first">
        <div v-if="activeName =='first'">
          <water-view :code='code'  :auth='auth'></water-view>
        </div>
      </el-tab-pane>
      <el-tab-pane label="水厂管护范围" name="second">
        <div v-if="activeName =='second'">
            <factory-view :code='code' :auth='auth'> </factory-view> 
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import $http from "@/utils/requestDC";
import waterView from "./components/waterProject";
import factoryView from "./components/waterFactory";
export default {
  data() {
    return {
      activeName: "first",
    };
  },
  props: { code: { type: String }, auth:{type:Array}},
  components:{waterView,factoryView},
  mounted() {
    console.log(this.$route.params)
    if(this.$route.params.activeName){
      this.activeName = this.$route.params.activeName || "first";
    }
  },
  methods: {
     handleClick(tab, event) {
        console.log(tab, event);
      }
  }
};
</script>
<style scoped>
</style>

