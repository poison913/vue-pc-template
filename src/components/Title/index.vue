<template>
   <div class="box-title">{{title}}
     <slot name="btn"></slot>
   </div>
</template>

<script>
export default {
  name:'titleStyle',
  components:{},
  props:{
    title:{
      type:String,
      default:''
    }
  },
  data(){
    return {
    }
  },
  watch:{},
  computed:{},
  methods:{},
  created(){},
  mounted(){}
}
</script>
<style lang="less" scoped>
   .box-title{
     border-left:5px;
     border-left-style: solid;
     height:24px;
     line-height: 24px;
     font-size: 14px;
     font-weight: 400;
     border-color:rgb(84, 117, 206);
     padding-left: 5px;
   }
</style>