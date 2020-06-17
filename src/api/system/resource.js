import request from '@/utils/request'

export function pageQuery(params) {
  return request({
    url: '/resource/pageQuery',
    method: 'post',
    data: params
  })
}

export function deleteInfo(params) {
    return request({
      url: '/resource/delete',
      method: 'post',
      params: params
    })
}

export function save(params) {
    return request({
      url: '/resource/save',
      method: 'post',
      data: params
    })
}

export function detail(params) {
    return request({
      url: '/resource/detail',
      method: 'post',
      params: params
    })
}

export function getTree(params) {
    return request({
      url: '/resource/getTree',
      method: 'post',
      data: params
    })
}
