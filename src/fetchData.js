const token = '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';

function fetchData({ url }) {
  return fetch(url,{
    method: "GET",
    headers: {
      Authorization: `token ${token} ` 
    }
  })
}

export { fetchData }
