import axios from 'axios'
import { curlize } from '../lib/print-curl'

const ctx: Worker = self as any

curlize(axios)

ctx.onmessage = async event => {
  const { reqType, url, params } = JSON.parse(event.data) as any
  let result

  try {
    if (reqType === 'post') {
      result = await axios.post(url, params)
    } else if (reqType === 'get') {
      result = await axios.get(url, params)
    }
  } catch (err) {
    throw err
  }

  ctx.postMessage(JSON.stringify(result))
}
