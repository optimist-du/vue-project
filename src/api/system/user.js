import request from '@/utils/request'

export function pageQuery(params) {
  return request({
    url: '/user/pageQuery',
    method: 'post',
    params: params
  })
}

export function deleteInfo(params) {
    return request({
      url: '/user/delete',
      method: 'post',
      params: params
    })
}

export function save(params) {
    return request({
      url: '/user/save',
      method: 'post',
      params: params
    })
}

export function detail(params) {
    return request({
      url: '/user/get',
      method: 'post',
      params: params
    })
}

export function updatePassword(params) {
  return request({
    url: '/user/updatePassword',
    method: 'post',
    params: params
  })
}

export function avatar(params) {
  return request({
    url: '/user/avatar',
    method: 'post',
    params: params
  })
}
