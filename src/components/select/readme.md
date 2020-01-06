## 三四级下拉组件调用说明:
 ```
      adcd: [
        {
          ADCD: userInfos.ADCD, //顶级政区编码
          ADMIN_DIV_NAME: userInfos.ADMIN_DIV_NAME, //顶级政区名
          children: [], //固定传空
          level: 1, //顶级所在位置，固定为1
          isClear: false,//是否可清除值显示清除按钮
          isLock:boolen,//是否锁定联动下拉，默认不穿值就是锁定，例如杭州市限定只能在杭州市内选择，传false，则会解除锁定；
        } // 初始化传入当前行政区划的顶级
      ],
      initAdcd: {
        adcd: userInfos.ADCD, //选择绑定的值
        level: 1, //绑定值所在政区的级别，对话框编辑时，level要动态的和第一级的adcd对比传入对应的level
        step: 1 //代表几级联动
      },
      //父组件调用联动组件重新刷新：
      this.$refs[trashName].initBuildThree();//重新初始化联动组件，注意prop值传入，推荐在vue父组件初始化时，将initADCD作为常量，传入子组件的prop新增变量传入
      //如果你比较懒，也可以使用v-if来动态销毁重建三级联动组件来达到重置三级联动组件的目的
      //父组件获取三级联动的最小值方法，接受子组件的$emit事件
      <ThreeTrash @sendAdcd="getEvent">
      getEvent(adcd){
          const Num = adcd.length;
          if (Num >= 1) this.adcdSel = adcd[Num - 1];
      }
      //接收到的adcd是一个数组

```