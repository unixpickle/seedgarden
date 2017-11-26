class TorrentClient {
  constructor() {
    this.onChange = () => false;

    this._downloads = null;
    this._gettingList = false;
    this._getList();

    setInterval(() => this._getList(), TorrentClient.REFRESH_INTERVAL);
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
    const addURL = '/api/add?url=' + encodeURIComponent(magnetURL);
    _callBackendAPI(addURL).then(() => this._getList());
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
      setTimeout(this.onChange, 0);
    }).catch((e) => {
      this._gettingList = false;
      // TODO: maybe handle error here...
      console.trace(e);
    });
  }

  _actionsPending() {
    return this._downloads && this._downloads.find((x) => x.actionPending);
  }

  _torrentCall(call, hash) {
    for (let i = 0; i < this._downloads.length; ++i) {
      const dl = this._downloads[i];
      if (dl.hash == hash && !dl.actionPending) {
        dl.actionPending = true;
        _callBackendAPI('/api/'+call+'?hash=' + encodeURIComponent(hash)).then(() => {
          dl.actionPending = false;
          setTimeout(this.onChange, 0);
          this._getList();
        }).catch(() => {
          dl.actionPending = false;
        });
        setTimeout(this.onChange, 0);
      }
    }
  }

  static get REFRESH_INTERVAL() {
    return 5000;
  }
}
