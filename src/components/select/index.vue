<!--Vue三级联动组件，作者：陈凯歌，开发日期：2019-01-17-->
<template>
  <el-cascader
    :options="options"
    :props="props"
    v-model="selected"
    change-on-select
    @change="handleChange"
    size="mini"
    :clearable="isClear"
  />
</template>

<script>
import { getAdcd } from "@/api/adcd";

export default {
  name: "ThreeTrash",
  props: {
    initAdcd: {
      type: Object,
      default: {}
    },
    options: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      // options: [{ Admin_Div_Code: '33', Admin_Div_Name: '浙江省', children: [] }],
      props: {
        value: "ADCD",
        label: "ADMIN_DIV_NAME"
      },
      selected: [],
      isClear: false,
      trashStep: 1 //级联级数，根据prop传入后存在这个字段内
    };
  },
  created: function() {
    //console.log(this.adcd);
    // 完成创建后先判断一下传入的adcd，用来锁定对应的级别
    // this.getLocalAdcd(this.adcd)
  },
  mounted() {
    this.$nextTick(_ => {
      this.trashStep = this.initAdcd.step; //父级传入的级联的级数
      this.isClear = this.options[0].isClear ? true : false;
      this.initAdcd.isLock === undefined
        ? (this.initAdcd.isLock = true)
        : (this.initAdcd.isLock = this.initAdcd.isLock);
      this.getInitAdcd(
        this.options[0].ADCD,
        this.initAdcd.adcd,
        this.initAdcd.level,
        this.initAdcd.step
      );
    });
  },
  methods: {
    //重置组件方法
    initBuildThree: function() {
      this.getInitAdcd(
        this.options[0].ADCD,
        this.initAdcd.adcd,
        this.initAdcd.level,
        this.initAdcd.step
      ); //重新刷新组件
    },
    handleChange: function(val, e) {
      console.log(val);
      const Num = val.length;
      if (val.length && val.length < this.initAdcd.step) {
        this.getLocalAdcd(val[Num - 1], Num);
      }
      // if (val[0].length < 6) { this.getLocalAdcd(val[Num - 1]) }
      this.$emit("sendAdcd", val);
    },
    handleItemChange: function(val) {
      console.log(val);
      if (val[0].length == 2) {
        this.getLocalAdcd(this.adcd);
      }
    },
    // 根据props传入的adcd获取行政区划
    getLocalAdcd: function(adcd, Num) {
      getAdcd(adcd).then(response => {
        console.log(response.message);
        if (Num === 1) {
          if (this.trashStep > 2) {
            //只有当联动等级大于2时才显示第二级的右箭头并添加children
            response.message.forEach((list, i) => {
              list.children = [];
            });
          }
          this.options[0].children = response.message;
        } else if (Num === 2) {
          //如果传入的step为3代表为3级联动不需要为第三级加children，如果是4则代表需要为第三级加children
          if (this.trashStep > 3) {
            response.message.forEach((list, i) => {
              list.children = [];
            });
          }
          if (this.trashStep > 2) {
            this.options[0].children.forEach((list, i) => {
              if (list.ADCD === adcd) {
                list.children = response.message;
              }
            });
          }
        } else if (Num === 3) {
          console.log(this.options[0].children);
          let fatherArry = this.options[0].children; //第二级数组
          for (let i = 0; i < fatherArry.length; i++) {
            for (let j = 0; j < fatherArry[i].children.length; j++) {
              if (fatherArry[i].children[j].ADCD === adcd) {
                fatherArry[i].children[j].children = response.message;
                break; //跳出循环
              }
            }
          }
        }
      });
    },
    // 初始化行政区划
    getInitAdcd: function(adcd, initAdcd, level, step) {
      //debugger
      getAdcd(adcd).then(response => {
        if (step > 2) {
          //只有当联动等级大于2时才显示第二级的右箭头并添加children
          response.message.forEach((list, i) => {
            list.children = [];
          });
        }
        this.options[0].children = response.message;
        if (level === 1) {
          this.selected = [initAdcd];
        } else if (level === 2) {
          let Num = 0;
          this.options[0].children.forEach((list, i) => {
            if (list.ADCD !== initAdcd) {
              list.disabled = this.initAdcd.isLock;
            } else {
              Num = i;
            }
          });
          this.options[0].disabled = this.initAdcd.isLock; // 一级和二级均锁定
          this.selected = [this.options[0].ADCD, initAdcd];
          this.getLocalAdcd(initAdcd, 2);
        } else if (level === 3) {
          let secAdcd = "";
          let Num = 0;
          this.options[0].disabled = this.initAdcd.isLock;
          this.options[0].children.forEach((list, i) => {
            list.disabled = this.initAdcd.isLock;
            if (initAdcd.indexOf(list.ADCD) > -1) {
              secAdcd = list.ADCD;
              Num = i;
            }
          });
          this.getThreeAdcd(secAdcd, Num, this.initAdcd);
        } else if (level === 4) {
          let secAdcd = "";
          let Num = 0;
          this.options[0].disabled = this.initAdcd.isLock;
          this.options[0].children.forEach((list, i) => {
            item.disabled = this.initAdcd.isLock;
            if (initAdcd.indexOf(list.ADCD) > -1) {
              secAdcd = list.ADCD;
              Num = i;
            }
          });
          this.getFourAdcd(secAdcd, Num, this.initAdcd);
        }
      });
    },
    getThreeAdcd: function(secAdcd, Num, initAdcd) {
      getAdcd(secAdcd).then(response => {
        let indexNum = 0;
        response.message.forEach((item, i) => {
          if (initAdcd.adcd !== item.ADCD) {
            item.disabled = this.initAdcd.isLock;
          } else {
            indexNum = i;
          }
          if (initAdcd.step === 4) {
            item.children = [];
          }
        });
        this.options[0].children[Num].children = response.message;
        this.selected = [this.options[0].ADCD, secAdcd, initAdcd.adcd];
        //如果存在第四级需要继续请求第四级的列表
        if (initAdcd.step === 4) {
          getAdcd(initAdcd.adcd).then(res => {
            this.options[0].children[Num].children[indexNum].children =
              res.message;
          });
        }
      });
    },
    getFourAdcd(secAdcd, Num, initAdcd) {
      getAdcd(secAdcd).then(response => {
        let indexNum = 0;
        response.message.forEach((item, i) => {
          item.disabled = this.initAdcd.isLock; //第三级全部禁用
          if (initAdcd.adcd.indexOf(item.ADCD) > -1) {
            indexNum = i;
          }
          if (initAdcd.step === 4) {
            item.children = [];
          }
        });
        this.options[0].children[Num].children = response.message;
        //如果存在第四级需要继续请求第四级的列表
        if (initAdcd.step === 4) {
          getAdcd(this.options[0].children[Num].children[indexNum].ADCD).then(
            res => {
              for (let obj of res.message) {
                obj.disabled = this.initAdcd.isLock; //全部禁用
              }
              this.options[0].children[Num].children[indexNum].children =
                res.message;
              this.selected = [
                this.options[0].ADCD,
                secAdcd,
                this.options[0].children[Num].children[indexNum].ADCD,
                initAdcd.adcd
              ];
            }
          );
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
