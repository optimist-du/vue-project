import request from '@/utils/request'

export function imgUpload(params) {
  return request({
    url: '/upload',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}