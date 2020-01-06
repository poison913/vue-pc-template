# 树形表格
## 使用方法
<tree-table ref="recTree" :list.sync="authTableData" @handlerExpand="handlerExpand"></tree-table>

### :list.sync  传入主要数据，数据格式
```  
[
  {id: "a", 
  name: "a", 
  children: [
    {id: "a", name: "a"}
    ]
  }
]
```

### @handlerExpand="handlerExpand"  展开时触发
methods中添加方法
```
handlerExpand(m) {
  m.isExpand = !m.isExpand;
}
```