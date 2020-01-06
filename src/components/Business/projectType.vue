<template>
  <el-select style="width:160px" v-model="selected" clearable placeholder="请选择管理单位类型" class="handle-select mr10">
    <el-option v-for="item in GCLX" :key="item.CODE" :label="item.NAME" :value="item.NAME"></el-option>
  </el-select>
</template>

<script>
  import {
    projectType
  } from '@/api/matterManage'
  import Emitter from '@/mixins/emitter'
  export default {
    mixins: [ Emitter ],
    data() {
      return {
        GCLX: [],
        selected: ''
      }
    },
    methods: {
      getProjectTypes() {
        return new Promise((resolve, reject) => {
          projectType({}).then(response => {
            let data = response.message;
            if (Array.isArray(data) && data.length > 0) {
              this.GCLX = data;
              resolve();
            } else {
              throw new Error('暂无工程类型数据！');
            }
          }).catch(error => {
            reject(error);
          })
        })
      }
    },
    created() {
      this.getProjectTypes();
    },
    watch: {
      selected: {
        handler (val,oldval){
          this.dispatch('provinceIncomplete', 'on-message2', val);
        },
        immediate: true
      }
    }
  }

</script>

<style scoped>

</style>
