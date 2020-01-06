<template>
  <div class="homePage-container">
    <el-row :gutter="10">
      <el-col>
        首页
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "supHomePage",
  data() {
    return {
      test:''
    }
  },
  watch: {},
  computed: {},
  mounted() {}
};
</script>
<style lang="less" scoped>
.homePage-container {
  padding: 10px;
  font-family: "microsoft yahei";
}
.homePage-box {
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 10px;
  background: #fff;
  float: left;
  width: 100%;
  .three-gray-box {
    background: #f8f8f8;
    border-radius: 3px;
    width: 32%;
    float: left;
    margin-right: 1%;
    padding: 10px;
    h5 {
      line-height: 24px;
      text-align: center;
    }
  }
  .homepage-paragraf {
    text-indent: 2em;
    line-height: 23px;
    font-weight: 400;
    font-size: 0.9em;
    margin: 0;
    text-align: justify;
  }
}
.box-three-labels {
  height: 40px;
  padding: 5px;
  .box-item {
    height: 30px;
    width: 30%;
    margin-right: 3%;
    line-height: 30px;
    border-radius: 20px;
    color: #fff;
    text-align: center;
    float: left;
    &.green {
      background: #4dd29b;
    }
    &.yellow {
      background: #ffd000;
    }
    &.red {
      background: #ff000d;
    }
  }
}
.box-three {
  background: #f5f5f5;
  border-radius: 3px;
  padding: 10px;
  &.green {
    .img {
      background: url("../../assets/green.png");
      height: 54px;
      width: 40px;
      margin: 0 auto;
    }
    .title {
      color: #4dd29b;
      font-size: 1.2em;
      text-align: center;
      font-weight: 600;
    }
  }
  &.yellow {
    .img {
      background: url("../../assets/yellow.png");
      height: 54px;
      width: 40px;
      margin: 0 auto;
    }
    .title {
      color: #ffd000;
      font-size: 1.2em;
      text-align: center;
      font-weight: 600;
    }
  }
  &.red {
    .img {
      background: url("../../assets/red.png");
      height: 54px;
      width: 40px;
      margin: 0 auto;
    }
    .title {
      color: #ff0000;
      font-size: 1.2em;
      text-align: center;
      font-weight: 600;
    }
  }
  .title-label {
    color: #fff;
    background: lighten(#0062ff, 20%);
    border-radius: 3px;
    padding: 0 4px;
  }
}
.two-box {
  padding: 10px;
  border-radius: 3px;
  text-align: center;
  color: #333;
  line-height: 24px;
  background: #f5f5f5;
  height: 92px;
  .green {
    height: 50px;
    width: 50px;
    border-radius: 30px;
    background: #3ec53e;
    text-align: center;
    vertical-align: center;
    line-height: 50px;
    color: #fff;
    font-weight: 600;
    float: left;
    margin: 10px 0 0 0;
    font-size: 14px;
  }
  .greenNum {
    color: #3ec53e;
    font-size: 14px;
    font-weight: 600;
    line-height: 72px;
  }
  .red {
    height: 50px;
    width: 50px;
    border-radius: 30px;
    background: #e70c0c;
    text-align: center;
    vertical-align: center;
    line-height: 50px;
    color: #fff;
    font-weight: 600;
    float: left;
    margin: 10px 0 0 0;
    font-size: 14px;
  }
  .redNum {
    color: #e70c0c;
    font-size: 14px;
    font-weight: 600;
    line-height: 72px;
  }
  .right-name {
    line-height: 40px;
  }
  /*   &.green {
    background: #4dd29b;
  }
  &.red {
    background: #ff000d;
  } */
}
</style>
