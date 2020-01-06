<template>
  <el-scrollbar wrap-class="scrollbar-wrapper" class="water-sidebar" style="width:100px!important">
    <el-menu
      :show-timeout="200"
      :default-active="this.$route.fullPath"
      active-text-color="#ffa700"
      router
      :collapse="isCollapse"
      class="el-menu-vertical-demo nys-menu"
      mode="vertical"
      text-color="#fff"
    >
      <el-menu-item
        class="left-navs-item"
        v-bind:index="item.redirect"
        v-for="item in routes1"
        v-bind:key="item.name"
      >
        <template slot="title">
          <!-- <font-awesome-icon :icon="item.icon" class="left-navs-icon"/> -->
          <span :class="'left-navs-icon fa fa-'+item.icon"></span>
          <br>
          <span class="left-navs-name">{{item.name}}</span>
        </template>
      </el-menu-item>
      <!-- <sidebar-item
        v-for="route in routes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />-->
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import SidebarItem from "./SidebarItem";
import { findParentID } from "@/mixins/common";
//import ResizeMixin from "../../mixin/ResizeHandler";

export default {
  components: { SidebarItem },
  //mixins: [ResizeMixin],
  /* data(){
    return{
      routes1:[]
    }
  }, */
  /* created(){
      let finalRoutes = [];
      for (let obj of this.$router.options.routes) {
        if (obj.id) {
          if (obj.id === localStorage.getItem("indexID")) {
            finalRoutes.push(obj);
          }
        }
      }
      debugger
      this.routes1=finalRoutes;
  }, */
  data() {
    return {
      routes1: []
    };
  },
  methods: {
    goSub(url) {
      this.$router.push({ path: url || "/" });
    },
    refleshUrl() {
      //debugger
      // 从localstorage中取到当前用户的模块数据，跟一级的对比，生成二级菜单栏
      let finalRoutes = {
        scrollBehavior: this.$router.options.scrollBehavior,
        routes: []
      };
      let routersFromLocalstorage = eval(
        "(" + localStorage.getItem("userModule") + ")"
      );
      let secNavLists = []; //先找到服务返回的二级菜单目录
      let nowPath = "";
      for (let obj of routersFromLocalstorage.menu) {
        /* if (obj.id) {
          if (obj.id === localStorage.getItem("indexID")) {
            finalRoutes.routes.push(obj);
          }
        } */
        if (obj.subs.length > 0) {
          if (
            obj.subs[0].PARENT_MODULE_CODE === localStorage.getItem("indexID")
          ) {
            secNavLists = obj.subs;
            nowPath = obj.subs[0].MODULE_URL;
            break;
          }
        } else {
          nowPath = obj.MODULE_URL;
        }
      }
      //从本地router表中去匹配一下，取到跟当前二级数组一致的router绑定
      //debugger;
      function createComparisonFunctionByProperty(propertyName) {
        //根据指定属性名的值，按照升序排序
        return function(object1, object2) {
          var value1 = parseFloat(object1[propertyName]);
          var value2 = parseFloat(object2[propertyName]);
          if (value1 < value2) {
            return -1;
          } else if (value1 > value2) {
            return 1;
          } else {
            return 0;
          }
        };
      }
      if (secNavLists.length > 0) {
        console.log(`secNavLists`,secNavLists)
        for (let obj of this.$router.options.routes) {
          for (let item of secNavLists) {
            if (obj.redirect === item.MODULE_URL) {
              obj.ORDER_ID = item.ORDER_ID;
              finalRoutes.routes.push(obj);
            }
          }
        }
      }
      if (finalRoutes.routes.length > 0) {
        finalRoutes.routes.sort(createComparisonFunctionByProperty("ORDER_ID")); //服务返回的数组要根据order_id重新排序，按照升序排列
      }
      //debugger;
      // if (finalRoutes.routes.length > 0) {
      //   finalRoutes.routes[0].className = "active";
      // }
      //debugger
      this.routes1 = finalRoutes.routes;
      console.log(`secNavLists`,secNavLists)
      if (this.routes1.length == 0) {
        //没有二级子菜单，隐藏左侧的sidebar
        this.$emit("sideBarHide", true);
      } else {
        this.$emit("sideBarHide", false);
      }
      this.routes1.forEach(item =>{
        console.log(item.name)
      })
      //同时跳转页面到第一个
      //this.$router.push({ path: nowPath || "/" });
    }
  },
  watch: {
    $route(to, from) {
      //debugger
      const newIndexID = findParentID(to.path); //查找父id
      localStorage.setItem("indexID", newIndexID);
      this.$emit('emitHeaderActive',true);//告诉layout图层刷新顶部导航的选中
      this.refleshUrl();
    }
  },
  created() {
    /* let finalRoutes = {
      scrollBehavior: this.$router.options.scrollBehavior,
      routes: []
    };
    for (let obj of this.$router.options.routes) {
      if (obj.id) {
        if (obj.id === localStorage.getItem("indexID")) {
          finalRoutes.routes.push(obj);
        }
      }
    }
    this.routes1 = finalRoutes.routes; */
  },
  mounted() {
    this.$nextTick(_ => {
      this.refleshUrl();
    });
    //刷新时也要重新加载左侧菜单
    /* this.$nextTick(function() {
      for (let obj of this.routes1) {
        if (this.$router.redirect === obj.redirect) {
          obj.className = "active";
        } else {
          obj.className = "";
        }
      }
      //debugger
    }); */
  },
  computed: {
    ...mapGetters(["sidebar", "indexID"]),
    /* ...mapGetters(["sidebar", "indexID"]),
    ...mapState("app", ["indexID"]), */

    /* created () {
      let finalRoutes = [];
      for (let obj of this.$router.options.routes) {
        if (obj.id) {
          if (obj.id === localStorage.getItem("indexID")) {
            finalRoutes.push(obj);
          }
        }
      }
      debugger
      this.routes1=finalRoutes;
    }, */
    routes() {
      debugger;
      //console.log(this.indexID);
      let finalRoutes = {
        scrollBehavior: this.$router.options.scrollBehavior,
        routes: []
      };
      for (let obj of this.$router.options.routes) {
        if (obj.id) {
          if (obj.id === localStorage.getItem("indexID")) {
            finalRoutes.routes.push(obj);
          }
        }
      }
      //finalRoutes=this.$router.options.routes;
      return finalRoutes.routes;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
<style lang="less" scoped>
.el-menu-vertical-demo {
  background-image: -moz-linear-gradient(
    0deg,
    rgb(255, 0, 0) 0%,
    rgb(25, 197, 228) 0%,
    rgb(18, 139, 189) 26%,
    rgb(11, 81, 150) 100%
  );
  background-image: -webkit-linear-gradient(
    90deg,
    rgb(255, 0, 0) 0%,
    rgb(25, 197, 228) 0%,
    rgb(18, 139, 189) 26%,
    rgb(11, 81, 150) 100%
  );
  background-image: linear-gradient(
    0deg,
    rgb(255, 0, 0) 0%,
    rgb(25, 197, 228) 0%,
    rgb(18, 139, 189) 26%,
    rgb(11, 81, 150) 100%
  );
  background-image: -ms-linear-gradient(
    90deg,
    rgb(255, 0, 0) 0%,
    rgb(25, 197, 228) 0%,
    rgb(18, 139, 189) 26%,
    rgb(11, 81, 150) 100%
  );
  .left-navs-item {
    font-size: 12px !important;
    padding-left: 10px !important;
    line-height: 28px !important;
    text-align: center;
    .left-navs-icon {
      font-size: 14px;
    }
    .left-navs-name {
      width: 100%;
    }
    &.is-active {
      background: rgba(0, 0, 0, 0.3) !important;
      border-left: 3px solid #ffa700;
    }
    &:hover,
    &:focus {
      background: rgba(0, 0, 0, 0.3);
    }
    &.active {
      background: rgba(0, 0, 0, 0.3);
      color: #ff9d00 !important;
    }
  }
  .water-sidebar {
    &.sidebar-container {
      width: 100px !important;
    }
  }
}
</style>

