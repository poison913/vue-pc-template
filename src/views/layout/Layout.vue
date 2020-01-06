<template>
  <div class="app-wrapper"><!-- :class="classObj" -->
    <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/> -->
    <sidebar
      @sideBarHide="showorHideLeft"
      @emitHeaderActive="shiftHeaderActive"
      v-show="sidebarShow"
      ref="mySidebar"
      class="sidebar-container"
    />
    <Header @pathShift="refleshLeft" ref="header"/>
    <div class="main-container" :class="homePageClass" style="margin-left:0">
      <!-- <navbar/> -->
      <app-main/>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from "./components";
import Header from "./components/Header";
//import ResizeMixin from "./mixin/ResizeHandler";

export default {
  name: "Layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Header
  },
 // mixins: [ResizeMixin],
  data() {
    return {
      sidebarShow: true, //默认显示左侧菜单
      homePageClass: "" //默认为空的homepageclass
    };
  },
  mounted() {
    //debugger
    /* if (
      this.$route.fullPath === "/homePage" ||
      this.$route.fullPath === "/supHomePage"
    ) {
      //首页不显示左侧菜单
      this.sidebarShow = false;
      this.homePageClass = "left-none";
    } else {
      this.sidebarShow = true;
      this.homePageClass = "";
    } */
  },
  watch: {
    $route: {
      handler: function(route) {
        //debugger
        /* if (
          route.fullPath === "/homePage" ||
          this.$route.fullPath === "/supHomePage"
        ) {
          this.sidebarShow = false;
          this.homePageClass = "left-none";
        } else {
          this.sidebarShow = true;
          this.homePageClass = "";
        } */
      }
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("CloseSideBar", { withoutAnimation: false });
    },
    refleshLeft() {
      //调用子组件刷新左侧菜单
      this.$refs.mySidebar.refleshUrl();
    },
    showorHideLeft(bool) {
      //debugger
      if (bool) {
        this.sidebarShow = false;
        this.homePageClass = "";
      } else {
        this.sidebarShow = true;
        this.homePageClass = "left-none";
      }
    },
    shiftHeaderActive(){
      //此时调用子组件header刷新其顶部的样式
      this.$refs.header.refleshTopActive();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  min-width: 1200px;
  overflow-x: auto;
  //overflow-y: auto;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.main-container {
  &.left-none {
    margin-left: 100px !important;
  }
}
</style>
