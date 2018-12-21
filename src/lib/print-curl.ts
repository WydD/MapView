import { AxiosRequestConfig, AxiosStatic } from 'axios'
import { LOG_COLOR_REQUEST } from '../state/constants'

function getHeaders(req: AxiosRequestConfig): string {
  return Object.entries(req.headers)
    .map(([key, value]) => {
      return `-H '${key}: ${value}'`
    })
    .join(' ')
    .trim()
}

function getMethod(req: AxiosRequestConfig) {
  return `-X ${req.method.toUpperCase()}`
}

function getBody(req: AxiosRequestConfig) {
  let data = typeof req.data === 'object' ? JSON.stringify(req.data) : req.data
  return data ? `--data '${data}'`.trim() : ''
}

function getUrl(req: AxiosRequestConfig) {
  return `'${req.url.trim()}'`
}

function generateCommand(req: AxiosRequestConfig) {
  return `curl ${getMethod(req)} ${getHeaders(req)} ${getBody(req)} ${getUrl(req)}`.trim()
}

export function curlize(axios: AxiosStatic) {
  axios.interceptors.request.use(req => {
    setTimeout(() => {
      let command = generateCommand(req)
      // console.log('%c curl', LOG_COLOR_REQUEST, { command })
    })
    return req
  })
}
