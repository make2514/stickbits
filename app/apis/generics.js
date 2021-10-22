export function post(apiName, options) {
  return fetch(`http://localhost:3001/api/${apiName}`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  }).then(res => res.json());
}
