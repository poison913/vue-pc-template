<template>
  <el-cascader clearable placeholder="搜索：行政区划" :options="options" filterable change-on-select @change="handleClick"></el-cascader>
</template>

<script>
import {
    listMyAdcd
  } from '@/api/matterManage'
  import Emitter from '@/mixins/emitter'
  export default {
    mixins: [ Emitter ],
    name: 'myadcd',
    data() {
      return {
        options: []
      };
    },
    methods: {
      getListMyAdcd() {
        return new Promise((resolve, reject) => {
          listMyAdcd({}).then(response => {
            let data = response.message;
            if(Array.isArray(data) && data.length > 0){
              data.forEach(item => {
                delete item.children
                item.value = item.ADCD;
                item.label = item.ADMIN_DIV_NAME;
                if(item.ADCD.length == 2){
                  item.PADCD = null;
                }else if(item.ADCD.length == 4){
                  item.PADCD = item.ADCD.substring(0,2);
                }else if(item.ADCD.length == 6){
                  item.PADCD = item.ADCD.substring(0,4);
                }else{
                  item.PADCD = item.ADCD.substring(0,6);
                }
              });
              let map = {};
              data.forEach(item => {
                map[item.ADCD] = item;
              });
              let val = [];
              data.forEach(item => {
                let parent = map[item.PADCD];
                if(parent){
                  (parent.children || (parent.children = [])).push(item);
                }else{
                  val.push(item);
                }
              });
              this.options = val;
            }else{
              throw new Error('暂无行政区划数据！')
            }
            resolve()
          }).catch(error => {
            reject(error);
          })
        })
      },
      handleClick(select) {
        if(typeof select === 'undefined'){
          select = '';
        }else{
          if(Array.isArray(select) && select.length > 0){
            select = select[select.length - 1];
          }else{
            select = '';
          }
        }
        this.dispatch('provinceIncomplete', 'on-message', select);
      }
    },
    created (){
      this.getListMyAdcd();
    }
  }

</script>

<style scoped>

</style>
