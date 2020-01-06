/**
 * 公司：定川信息技术有限公司
 * 部门：软件开发研究所前端组
 * 作者： 张浩 创建时间： 2019/3/4.
 * 描述：事项督办模块
 * 修改人：-- 修改时间：--.
 */
import request from '@/utils/requestDC'
import store from '../store'


let userType = +store.getters.userInfo.USER_TYPE; //1、2、3监管 9运管
let trueUrl = '';
if(userType === 9){//运管
  trueUrl = 'ProjectSupervision';
}else{//监管
  trueUrl = 'SuperviseProSupervision';
}

//获取列表数据
export function getTableData(tableData) {
  return request({
    url: `${trueUrl}/ListSupervisoryItems`,
    method: 'post',
    data: tableData
  })
}

//获取工程类型
export function projectType(pTObj) {
  return request({
    url: 'Enumerate/EnumsProjectTypeByScale',
    method: 'post',
    data: pTObj
  })
}

//根据当前用户获取乡镇区划数据
/* 省级   省和市
   市级  当前市和县
   县级  当前县和乡镇 */
export function listMyAdcd (){
  return request({
    url: 'User/ListMyAdcd',
    method: 'post'
  })
}

//获取用户列表
export function ListPlaceUser (userObj){
  return request({
    url: `SuperviseProSupervision/ListPlaceUser`,
    method: 'post',
    data: userObj
  })
}

//获取督办详情
export function GetSupervisionDetail (detailObj){
  return request({
    url: `${trueUrl}/GetSupervisionDetail`,
    method: 'post',
    data: detailObj
  })
}

//添加督办任务
export function AddSupervisionTask (addObj){
  return request({
    url: `${trueUrl}/AddSupervisionTask`,
    method: 'post',
    data: addObj
  })
}

//督办任务历史记录
export function ListSuperviseTasktHistory (hObj){
  return request({
    url: `${trueUrl}/ListSuperviseTasktHistory`,
    method: 'post',
    data: hObj
  })
}

//添加督办反馈
export function AddSupervisionFeedback (fbAddObj){
  return request({
    url: `${trueUrl}/AddSupervisionFeedback`,
    method: 'post',
    data: fbAddObj
  })
}
