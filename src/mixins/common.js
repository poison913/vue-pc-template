//获取最大值
export function getMax(array) {
    let max = array[0];
    for (let obj of array) {
        if (obj > array[0]) {
            max = obj;
        }
    }
    return max;
}
//根据当前页面的路径查找对应的module_id
export function findParentID(url) {
    console.log(`url`,url)
    let menu = localStorage.getItem('userModule');
    menu = eval('(' + menu + ')').menu;
    console.log(`menu`,menu)
    let module_id = '';
    for (let obj of menu) {
        if (obj.subs.length > 0) {
            if(obj.MODULE_URL == url && url=='/supMap'){
                //综合信息单独判断
                module_id = obj.MODULE_ID;   
                break;     
             }else{
                for (let item of obj.subs) {
                    if (item.MODULE_URL === url) {
                        module_id = obj.MODULE_ID;
                        break;
                    }
                }

             }
           
        } else {
            if (obj.MODULE_URL === url) {
                module_id = obj.MODULE_ID;
                break;
            }
        }
    }
    return module_id;
}
//根据localstroage里储存的module来判断是否具备相关权限
export function judgeAuth(name) {
    if (localStorage.getItem('userModule')) {
        let auth_power = eval('(' + localStorage.getItem('userModule') + ')').auth;
        let authHas = [];
        for (let obj of auth_power) {
            if (obj.indexOf(name) !== -1) {
                const valueArray = obj.split('_');
                authHas.push(Number(valueArray[1]));
            }
        }
        return authHas;
    } else {
        return false;
    }

}