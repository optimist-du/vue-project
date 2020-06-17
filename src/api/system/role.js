import request from '@/utils/request'

export function pageQuery(params) {
  return request({
    url: '/role/pageQuery',
    method: 'post',
    params: params
  })
}

export function deleteInfo(params) {
    return request({
      url: '/role/delete',
      method: 'post',
      params: params
    })
}

export function save(params) {
    return request({
      url: '/role/save',
      method: 'post',
      data: params
    })
}

export function detail(params) {
    return request({
      url: '/role/detail',
      method: 'post',
      params: params
    })
}

export function queryAll(params) {
    return request({
      url: '/role/queryAll',
      method: 'post',
      params: params
    })
  }