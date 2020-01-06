<template>
  <el-select style="width:220px" v-model="userList" multiple placeholder="请选择">
    <el-option v-for="item in options" :key="item.USER_CODE" :label="item.TRUE_NAME" :value="item.USER_CODE">
    </el-option>
  </el-select>
</template>

<script>
  import {
    ListPlaceUser
  } from '@/api/matterManage'
  import Emitter from '@/mixins/emitter'
  export default {
    mixins: [Emitter],
    data() {
      return {
        options: [],
        userList: []
      }
    },
    methods: {
      getListPlaceUser() {
        return new Promise((resolve, reject) => {
          ListPlaceUser({
            pageNumber: 1,
            pageSize: 10000,
            userLevel: 0,
            trueName: ''
          }).then(response => {
            let data = response.message.rows;
            this.options = data;
          }).catch(error => {
            reject(error);
          })
        })
      }
    },
    created() {
      this.getListPlaceUser()
    },
    watch: {
      userList: {
        handler (val,oldval){
          this.dispatch('provinceIncomplete', 'on-message3', val);
        },
        immediate: true
      }
    }
  }

</script>

<style scoped>

</style>
