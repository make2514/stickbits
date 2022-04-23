export function post(apiName, token, options) {
  return fetch(`http://localhost:3001/api/${apiName}`, {
    method: 'post',
    headers: {
      Authorization: `bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  }).then(res => res.json());
}

export function put(apiName, token, options) {
  return fetch(`http://localhost:3001/api/${apiName}`, {
    method: 'put',
    headers: {
      Authorization: `bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  }).then(res => res.json());
}

export function get(apiName, token) {
  return fetch(`http://localhost:3001/api/${apiName}`, {
    method: 'get',
    headers: {
      Authorization: `bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
}

export function deleteAPI(apiName, token, options) {
  return fetch(`http://localhost:3001/api/${apiName}`, {
    method: 'delete',
    headers: {
      Authorization: `bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });
}
