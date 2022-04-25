let apiPath = 'http://localhost:3001/api';
if (process.env.NODE_ENV === 'production') {
  apiPath = process.env.BACKEND_PRODUCTION_PATH;
}

export function post(apiName, options, token) {
  if (!token) {
    return fetch(`${apiPath}/${apiName}`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    }).then(res => res.json());
  }

  return fetch(`${apiPath}/${apiName}`, {
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
  return fetch(`${apiPath}/${apiName}`, {
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
  return fetch(`${apiPath}/${apiName}`, {
    method: 'get',
    headers: {
      Authorization: `bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
}

export function deleteAPI(apiName, token, options) {
  return fetch(`${apiPath}/${apiName}`, {
    method: 'delete',
    headers: {
      Authorization: `bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });
}
