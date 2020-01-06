<template>
  <div :class="tdClass">
    <span class="before-line" v-if="root !== 0 && nodes !== 1" :style="{'left':model.bLeft + 'px'}"></span>
    <table>
      <tr>
        <td :colspan="colSpan">
          <table>
            <tr class="leve" :class="levelClass">
              <!-- <td class="td0">{{model.index}}</td> -->
              <td class="td1">
                <div class="td-title">
                  <span
                    v-if="model.children.length > 0"
                    class="tree-close"
                    :class="{'tree-open':model.isExpand}"
                    @click="handlerExpand(model)"
                  ></span>
                  <a class="ellipsis" @click="handlerExpand(model)">
                    <i class="t-icon m-dep"></i>
                    <span :title="model.name">{{model.name}}</span>
                  </a>
                </div>
              </td>
              <!-- 浏览 -->
              <td class="td2">
                <i class="fa fa-check-circle text-success" v-if="model.look"></i>
                <i class="fa fa-minus-circle text-success" v-else-if="model.look===null"></i>
                <i class="fa fa-times-circle text-info" v-else></i>
              </td>
              <!-- 添加 -->
              <td class="td2">
                <i class="fa fa-check-circle text-success" v-if="model.add"></i>
                <i class="fa fa-minus-circle text-success" v-else-if="model.add===null"></i>
                <i class="fa fa-times-circle text-info" v-else></i>
              </td>
              <!-- 编辑 -->
              <td class="td2">
                <i class="fa fa-check-circle text-success" v-if="model.edit"></i>
                <i class="fa fa-minus-circle text-success" v-else-if="model.edit===null"></i>
                <i class="fa fa-times-circle text-info" v-else></i>
              </td>
              <!-- 删除 -->
              <td class="td2">
                <i class="fa fa-check-circle text-success" v-if="model.del"></i>
                <i class="fa fa-minus-circle text-success" v-else-if="model.del===null"></i>
                <i class="fa fa-times-circle text-info" v-else></i>
              </td>
              <!-- 导出 -->
              <td class="td2">
                <i class="fa fa-check-circle text-success" v-if="model.exp"></i>
                <i class="fa fa-minus-circle text-success" v-else-if="model.exp===null"></i>
                <i class="fa fa-times-circle text-info" v-else></i>
              </td>
              <!-- 审核 -->
              <!-- <td class="td2">
                <i class="text-success" v-if="model.audit"></i>
                <i class="text-info" v-else-if="model.audit===null"></i>
                <i class="text-info" v-else></i>
              </td> -->
              <!-- 上报 -->
              <td class="td2">
                <i class="fa fa-check-circle text-success" v-if="model.upload"></i>
                <i class="fa fa-minus-circle text-success" v-else-if="model.upload===null"></i>
                <i class="fa fa-times-circle text-info" v-else></i>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <div v-show="model.isExpand" class="other-node" :class="otherNodeClass">
      <tree-item
        v-for="(m, i) in model.children"
        :key="String('child_node'+i)"
        :num="i"
        :root="1"
        @handlerExpand="handlerExpand"
        :nodes.sync="model.children.length"
        :trees.sync="trees"
        :model.sync="m"
      ></tree-item>
    </div>
  </div>
</template>

<script>
export default {
  name: "treeItem",
  props: ["model", "num", "nodes", "root", "trees"],
  data() {
    return {
      parentNodeModel: null
    };
  },
  computed: {
    colSpan() {
      return this.root === 0 ? "" : 6;
    },
    tdClass() {
      return this.root === 0 ? "td-border" : "not-border";
    },
    levelClass() {
      return this.model ? "leve-" + this.model.level : "";
    },
    otherNodeClass() {
      return this.model ? "other-node-" + this.model.level : "";
    }
  },
  watch: {
    // 'model': {
    // 	handler() {
    // 		console.log('对象变化', this.model.isExpand)
    // 	},
    // 	deep: true
    // }
  },
  methods: {
    getParentNode(m) {
      // 查找点击的子节点
      var recurFunc = (data, list) => {
        data.forEach(l => {
          if (l.id === m.id) this.parentNodeModel = list;
          if (l.children) {
            recurFunc(l.children, l);
          }
        });
      };
      recurFunc(this.trees, this.trees);
    },
    handlerExpand(m) {
      this.$emit("handlerExpand", m);
    }
  },
  filters: {
    formatDate: function(date) {
      // 后期自己格式化
      return date; //Utility.formatDate(date, 'yyyy/MM/dd')
    }
  }
};
</script>
