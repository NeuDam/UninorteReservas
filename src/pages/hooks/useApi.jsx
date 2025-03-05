import React from 'react'

async function useApi({url, method, body}) {


  const BASE_URL = 'https://api-reservas.neudam.dev'
  // const BASE_URL = 'http://127.0.0.1:8000'
  const API_URL = `${BASE_URL}${url}`

  let headers = {}
  let response
  let status_code

  if (method === 'POST' ) {
    headers = {
      'Content-Type': 'application/json'
    }
    const res = await fetch(API_URL, {
      method: method,
      body: JSON.stringify(body),
      headers: headers
    })
    status_code = res.status
    response = await res.json()
  }
  else{
    const res = fetch(API_URL, {
      method: method,
    })
    status_code = res.status
    response = await res.json()
  }

  return {status: status_code, data: response}
}

export default useApi
