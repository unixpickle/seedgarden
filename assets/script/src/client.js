const REFRESH_INTERVAL = 5000;
const BAY_SEARCH_DELAY = 1000;

class TorrentClient {
  constructor() {
    this.onChange = () => false;

    this._downloads = null;
    this._gettingList = false;
    this._getList();

    setInterval(() => this._getList(), REFRESH_INTERVAL);
  }

  downloads() {
    if (!this._downloads) {
      return null;
    }
    return this._downloads.map((obj) => Object.assign({}, obj));
  }

  deleteTorrent(hash) {
    this._torrentCall('delete', hash);
  }

  startTorrent(hash) {
    this._torrentCall('start', hash);
  }

  stopTorrent(hash) {
    this._torrentCall('stop', hash);
  }

  addTorrent(magnetURL) {
    _callBackendAPI('/api/add?url=' + encodeURIComponent(magnetURL));
  }

  _getList() {
    if (this._gettingList || this._actionsPending()) {
      return;
    }
    this._gettingList = true;
    _callBackendAPI('/api/downloads').then((data) => {
      this._gettingList = false;
      if (this._actionsPending()) {
        return;
      }
      this._downloads = data.map((x) => {
        x.active = (x.state != 0);
        x.actionPending = false;
        return x;
      });
      this.onChange();
    }).catch((e) => {
      this._gettingList = false;
      // TODO: maybe handle error here...
      console.log(e);
    });
  }

  _actionsPending() {
    return this._downloads && this._downloads.find((x) => x.actionPending);
  }

  _torrentCall(call, hash) {
    for (let i = 0; i < this._downloads.length; ++i) {
      let dl = this._downloads[i];
      if (dl.hash == hash && !dl.actionPending) {
        dl.actionPending = true;
        _callBackendAPI('/api/'+call+'?hash=' + encodeURIComponent(hash)).then(() => {
          dl.actionPending = false;
          this.onChange();
          this._getList();
        }).catch(() => {
          dl.actionPending = false;
        });
      }
    }
  }
}

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
    }, BAY_SEARCH_DELAY);
  }

  cancel() {
    if (this._callTimeout) {
      clearTimeout(this._callTimeout);
    }
    this._cb = (x, y) => null;
  }
}

class BayLookup {
  constructor(id, cb) {
    this._cb = cb;
    _callBackendAPI('/api/baylookup?id=' + encodeURIComponent(id)).then((obj) => {
      this._cb(null, obj);
    }).catch((err) => {
      this._cb(err, null);
    });
  }

  cancel() {
    this._cb = (x, y) => null;
  }
}

function _callBackendAPI(url) {
  return fetch(url).then((resp) => {
    if (!resp.ok) {
      throw Error('request failed');
    }
    return resp.json();
  }).then((obj) => {
    if (obj.hasOwnProperty('error')) {
      throw Error(obj['error']);
    }
    return _lowercaseObj(obj);
  });
}

function _lowercaseObj(obj) {
  if (Array.isArray(obj)) {
    return obj.map(_lowercaseObj);
  }
  let result = {};
  Object.keys(obj).forEach((k) => {
    if (k == 'ID') {
      result.id = obj[k];
    } else {
      result[k[0].toLowerCase() + k.substr(1)] = obj[k];
    }
  });
  return result;
}
