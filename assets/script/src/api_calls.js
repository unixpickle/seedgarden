class BaySearch {
  constructor(query, cb) {
    this.query = query;
    this._cb = cb;
    // Delay the request so that we don't spam the bay
    // while the user types out a search query.
    this._callTimeout = setTimeout(() => {
      this._callTimeout = null;
      _callBackendAPI('/api/baysearch?query=' + encodeURIComponent(query)).then((obj) => {
        this._cb(null, obj);
      }).catch((err) => {
        this._cb(err, null);
      });
    }, BaySearch.DELAY);
  }

  cancel() {
    if (this._callTimeout) {
      clearTimeout(this._callTimeout);
    }
    this._cb = (x, y) => null;
  }

  static get DELAY() {
    return 1000;
  }
}

class CancelableCall {
  constructor(url, cb) {
    this._cb = cb;
    _callBackendAPI(url).then((obj) => {
      this._cb(null, obj);
    }).catch((err) => {
      this._cb(err, null);
    });
  }

  cancel() {
    this._cb = (x, y) => null;
  }
}

class BayLookup extends CancelableCall {
  constructor(id, cb) {
    super('/api/baylookup?id=' + encodeURIComponent(id), cb);
  }
}

class ListFiles extends CancelableCall {
  constructor(hash, cb) {
    super('/api/files?hash=' + encodeURIComponent(hash), cb);
  }
}

function _callBackendAPI(url) {
  return fetch(url).catch((err) => {
    if (err instanceof TypeError) {
      return Promise.reject('connection failed');
    } else {
      return Promise.reject(err);
    }
  }).then((resp) => {
    if (!resp.ok) {
      return Promise.reject(new Error('request failed'));
    }
    return resp.json();
  }).then((obj) => {
    if (obj.hasOwnProperty('error')) {
      return Promise.reject(obj['error']);
    }
    return _lowercaseObj(obj);
  });
}

function _lowercaseObj(obj) {
  if (Array.isArray(obj)) {
    return obj.map(_lowercaseObj);
  }
  const result = {};
  Object.keys(obj).forEach((k) => {
    if (k == 'ID') {
      result.id = obj[k];
    } else {
      result[k[0].toLowerCase() + k.substr(1)] = obj[k];
    }
  });
  return result;
}
