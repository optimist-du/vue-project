import request from '@/utils/request'

export function pageQuery(params) {
  return request({
    url: '/wisdom/dict/pageQuery',
    method: 'post',
    params: params
  })
}

export function deleteInfo(params) {
    return request({
      url: '/wisdom/dict/delete',
      method: 'post',
      params: params
    })
}

export function save(params) {
    return request({
      url: '/wisdom/dict/save',
      method: 'post',
      params: params
    })
}

export function detail(params) {
    return request({
      url: '/wisdom/dict/detail',
      method: 'post',
      params: params
    })
}

export function queryByGroupName(params) {
  return request({
    url: '/wisdom/dict/queryByGroupName',
    method: 'post',
    params: params
  })
}

export function queryGroupName() {
  return request({
    url: '/wisdom/dict/queryGroupName',
    method: 'post'
  })
}
