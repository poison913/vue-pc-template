<template>
<div class="c">
  <el-select v-model="value"  placeholder="请选择" size="mini">
    <el-option 
    v-for="item in options" 
    :key="item.value" 
    :label="item.name" 
    :value="item.value">
    </el-option>
  </el-select>
  </div>
</template>
<script>
export default {
    name:'singleSelect',
    data(){
        return{
            value:''
        }
    },
    props:{
        test:{type:String},
        options:{
            type:Array,
            default:[]
        }
    },
    methods:{
        func(val,old){
            this.$emit('singleInput', val);
        }
    },
    watch:{
        value(val,oldval){
            this.$emit('testInput', val);
        }
    }
};
</script>
<style lang="less" scoped>
.c{
    display: inline-block;
}
</style>


