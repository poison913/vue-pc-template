const mes={
    namespaced: true,//独立的命名空间
    state:{
        testMsg: '原始文本',
        childText:"子组件原始文本",
        indexID:''
    },
    getters:{
        getTestMsg:state=>{
            return state.testMsg+'来自getter'
        },
        getChildMsg:state=>{
            return state.childText+'来自getter'
        }
    },
    mutations:{//绝不允许异步操作
        changeTestMsg(state, str){
            state.testMsg = str;
        },
        changeChildText(state, str){
            state.childText = str;
        },
        changeIndexIDFromValue(state,str){
            debugger
            state.indexID=str;
        }
    },
    actions: {//可以包含异步操作
        changeFather({commit},str){
            return new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    commit('changeTestMsg',str);
                    resolve('success');
                },500)
            }).catch(error=>{
                reject(error)
            })
        },
        changeChild({commit},str){
            commit('changeChildText',str)
        },
        changeIndexID({commit},str){
            commit('changeIndexIDFromValue',str);
        }
    }
}
export default mes
