import Cookies from 'js-cookie'
import { sysConfig } from '@/json/sysConfig';

const TokenKey = 'token'+sysConfig().cookiePath;
const UserInfoKey = 'userInfo'+sysConfig().cookiePath;

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setUserInfo(userInfo) {
  return Cookies.set(UserInfoKey, userInfo)
}

export function getUserInfo() {
  return eval('(' + Cookies.get(UserInfoKey) + ')')
}

export function removeUserInfo() {
  return Cookies.remove(UserInfoKey)
}

export function setUserInfo7(userInfo) {
  //let nowDate=new Date(new Date().getTime() + 15 * 60 * 1000);
  //debugger，这里使用userInfo内存入的cookie有效期的值
  //debugger
  let newExpires = new Date(userInfo.expires);
  return Cookies.set(UserInfoKey, userInfo, { expires: newExpires })
}
