import request from '@/utils/request'

export function saveUserRoles(params) {
  return request({
    url: '/userRole/saveUserRoles',
    method: 'post',
    data: params
  })
}

export function queryByUserId(params) {
    return request({
      url: '/userRole/queryByUserId',
      method: 'post',
      params: params
    })
}

export function getRoleIdsByUserId(params) {
    return request({
      url: '/userRole/getRoleIdsByUserId',
      method: 'post',
      params: params
    })
}

