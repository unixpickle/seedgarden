class TorrentClient {
  constructor() {
    this._downloads = null;
    this.onChange = () => false;

    setTimeout(() => {
      this._downloads = [];
      for (let i = 0; i < 10; ++i) {
        const size = Math.round(100 + Math.random() * 1e8);
        const completed = Math.floor(Math.random() * size);
        this._downloads.push({
          hash: '' + Math.random(),
          directory: '/foo/' + Math.random(),
          basePath: '/foo/' + Math.random(),
          completedBytes: completed,
          sizeBytes: size,
          name: 'Ubuntu version ' + Math.random(),
          uploadRate: 1e5,
          downloadRate: 1e6,
          uploadTotal: Math.floor(completed/2),
          downloadTotal: completed,
          active: (Math.random() < 0.5),
          actionPending: false
        });
      }
      this.onChange();
    }, 1000);
  }

  downloads() {
    return this._downloads.map((obj) => Object.assign({}, obj));
  }

  deleteTorrent(hash) {
    this._doCall('delete', hash);
  }

  startTorrent(hash) {
    this._doCall('start', hash);
  }

  stopTorrent(hash) {
    this._doCall('stop', hash);
  }

  _doCall(call, hash) {
    for (let i = 0; i < this._downloads.length; ++i) {
      let dl = this._downloads[i];
      if (dl.hash == hash && !dl.actionPending) {
        dl.actionPending = true;
        if (call === 'delete') {
          setTimeout(() => {
            this._downloads = this._downloads.filter((x) => x.hash != hash);
            this.onChange();
          }, 1000);
        } else if (call === 'start' || call === 'stop') {
          setTimeout(() => {
            dl.actionPending = false;
            dl.active = (call === 'start');
            this.onChange();
          }, 1000);
        }
        this.onChange();
      }
    }
  }
}

class BaySearch {
  constructor(query, cb) {
    this.query = query;
    // TODO: real request here.
    this._timeout = setTimeout(() => {
      cb(null, [
        {name: 'Adobe Photoshop', id: '123123123'},
        {name: 'Windows 10', id: '321321321'}
      ]);
      this._timeout = null;
    }, 1000);
  }

  cancel() {
    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }
  }
}

class BayLookup {
  constructor(query, cb) {
    this.query = query;
    // TODO: real request here.
    this._timeout = setTimeout(() => {
      cb(null, {
        name: 'Some torrent',
        magnetURL: 'https://foo.com',
        seeds: 10,
        leachers: 11
      });
      this._timeout = null;
    }, 1000);
  }

  cancel() {
    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }
  }
}
