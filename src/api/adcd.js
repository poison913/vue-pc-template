/**
 * 公司：定川信息技术有限公司
 * 部门：软件开发研究所前端组
 * 作者： 陈凯歌 创建时间： 2019/1/17.
 * 描述：如：公共方法、项目管理控制器
 * 修改人：-- 修改时间：--.
 */
import request from '@/utils/requestDC'

export function getAdcd(adcd) {
  return request({
    url: 'Adcd/ListSubAdcd',
    method: 'post',
    data: {
      parentAdcd: adcd
    }
  })
}
