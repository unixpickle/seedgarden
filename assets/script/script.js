class BayInfo extends React.Component {
  constructor() {
    super();
    self.state = {
      loading: true,
      name: null,
      magnetURL: null,
      error: null
    };
    // TODO: make request here.
  }

  componentWillUnmount() {
    // TODO: cancel pending requests here.
  }

  render() {
    // TODO: show loading/error/info.
    // TODO: callback for adding magnet link.
  }
}
function DownloadInfo() {
  // TODO: page with info for download.
  // TODO: callbacks for start, stop, delete.
  // TODO: sub-component for file browser.
}
function DownloadList(props) {
  if (!props.downloads) {
    return React.createElement("div", { id: "no-downloads" });
  }
  let list = [];
  props.downloads.forEach(dl => {
    list.push(React.createElement(DownloadEntry, { download: dl,
      key: dl.hash,
      onClick: () => props.onClick(dl.hash),
      onStop: () => props.onStop(dl.hash),
      onStart: () => props.onStart(dl.hash) }));
  });
  return React.createElement(
    "ol",
    { id: "downloads" },
    list
  );
  // TODO: list of downloads.

  // TODO: flag on download indicating that an action is
  // currently pending for it.

  // TODO: callbacks for pause/resume/delete.
}

function DownloadEntry(props) {
  return React.createElement(
    "li",
    { "class": 'download' + (props.actionPending ? ' download-frozen' : ''),
      onClick: props.onClick },
    React.createElement(
      "label",
      { "class": "download-name" },
      props.download.name
    ),
    React.createElement(
      "div",
      { "class": "download-stats" },
      React.createElement(
        "label",
        { "class": "download-size" },
        humanSize(props.download.sizeBytes)
      ),
      props.download.active && React.createElement(
        "label",
        { "class": "download-rate" },
        humanSize(props.download.sizeBytes) + '/sec'
      ),
      React.createElement(
        "label",
        { "class": "download-upload" },
        humanSize(props.download.uploadTotal)
      )
    ),
    props.download.active ? React.createElement(
      "button",
      { "class": "download-stop-button",
        onClick: e => {
          e.stopPropagation();props.onStop();
        } },
      "Stop"
    ) : React.createElement(
      "button",
      { "class": "download-start-button",
        onClick: e => {
          e.stopPropagation();props.onStart();
        } },
      "Start"
    )
  );
}

function humanSize(bytes) {
  const suffixes = [' KB', ' MB', ' GB', ' TB'];
  suffixes.forEach((suffix, idx) => {
    const size = bytes / Math.pow(10, 3 * idx + 3);
    if (size < 10) {
      return size.toFixed(2) + suffix;
    } else if (size < 100) {
      return size.toFixed(1) + suffix;
    } else {
      return Math.round(size) + suffix;
    }
  });
  return bytes + ' bytes';
}
function Loader(props) {
  return React.createElement(
    "div",
    { className: "loader" },
    "Loading"
  );
}
class Root extends React.Component {
  constructor() {
    super();
    this.state = initialStateFromHash();
    window.onpopstate = () => this.handlePopState();
    this.client = new TorrentClient();
    this.client.onChange = () => this.setState({ downloads: this.client.downloads() });
  }

  handlePopState() {
    this.setState(rootStateFromHash());
  }

  render() {
    return React.createElement(
      "div",
      { "class": "root" },
      React.createElement(TopBar, { search: this.state.currentSearch,
        onSearchChange: s => this.setState({ currentSearch: s }) }),
      this.state.currentSearch && React.createElement(Search, { downloads: this.state.downloads, query: this.state.currentSearch }),
      React.createElement(DownloadList, { downloads: this.state.downloads,
        onClick: hash => console.log('click hash', hash),
        onStart: hash => this.client.startTorrent(hash),
        onStop: hash => this.client.stopTorrent(hash) })
    );
    if (this.state.currentSearch) {
      // TODO: search UI here.
      // This may be an overlay.
    }
    if (this.state.currentDownloadHash) {
      // TODO: download info here.
    } else if (this.state.currentPirateBayID) {
      // TODO: torrent info here.
    } else if (this.state.downloads) {
      // TODO: list of torrents here.
    } else {}
      // TODO: loading screen here.

      // TODO: add button here.
  }
}

function initialStateFromHash() {
  let result = rootStateFromHash();
  ['currentSearch', 'currentDownloadHash', 'currentPirateBayID', 'downloads'].forEach(k => {
    if (!result.hasOwnProperty(k)) {
      result[k] = null;
    }
  });
  return result;
}

function rootStateFromHash() {
  let result = {};
  if (location.hash.length < 2) {
    return result;
  }
  try {
    let parsed = JSON.parse(location.hash.substr(1));
    Object.keys(parsed).forEach(k => result[k] = parsed[k]);
  } catch (e) {}
  return result;
}

window.addEventListener('load', function () {
  ReactDOM.render(React.createElement(Root, null), document.getElementById('content'));
});
class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      downloads: filterDownloads(this.props.downloads, this.props.query),
      bayResults: null,
      bayLoading: true,
      bayError: null
    };
    this.baySearch = new BaySearch(this.props.query);
    this.baySearch.start((error, results) => this.bayCallback(error, results));
  }

  componentWillUnmount() {
    if (this.baySearch) {
      this.baySearch.cancel();
    }
  }

  render() {
    return React.createElement(
      "div",
      { "class": "search-results" },
      "Some results here!"
    );
    // TODO: two sections:
    //  - current downloads
    //  - search results from a website

    // TODO: deal with "no results" in both sections.
    // TODO: deal with null results in both sections,
    // which either indicates loading or error.

    // TODO: callback for showing download or bay result.

    // TODO: support rendering in full screen or as a
    // dropdown.
  }

  bayCallback(error, results) {
    this.baySearch = null;
    this.setState({ bayResults: results, bayLoading: false, bayError: error });
  }
}

class BaySearch {
  constructor(query) {
    this.query = query;
    this._timeout = null;
  }

  start(cb) {
    // TODO: real request here.
    this._timeout = setTimeout(() => {
      cb('Failed to search the bay', null);
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

function filterDownloads(downloads, query) {
  if (!downloads) {
    return null;
  }
  // TODO: match the query against downloads.
  return downloads;
}

window.addEventListener('load', function () {
  ReactDOM.render(React.createElement(Root, null), document.getElementById('content'));
});
class TopBar extends React.Component {
  constructor() {
    super();
    this.state = { searchFocused: false };
  }

  render() {
    return React.createElement(
      "div",
      { "class": 'topbar' + (this.search ? ' topbar-searching' : '') },
      React.createElement(
        "button",
        { "class": "add-button", onClick: this.props.onAdd },
        "Add Magnet URL"
      ),
      React.createElement("input", { "class": "search-box",
        onFocus: () => this.setState({ searchFocused: true }),
        onBlur: () => this.setState({ searchFocused: false }),
        onChange: e => this.props.onSearchChange(e.target.value),
        value: this.props.search || '' }),
      this.props.search && React.createElement(
        "button",
        { "class": "clear-button", onClick: () => this.props.onSearchChange('') },
        "Clear Search"
      )
    );
  }
}
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
          uploadTotal: Math.floor(completed / 2),
          downloadTotal: completed,
          active: Math.random() < 0.5,
          actionPending: false
        });
      }
      this.onChange();
    }, 1000);
  }

  downloads() {
    return this._downloads.map(obj => Object.assign({}, obj));
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
            this._downloads = this._downloads.filter(x => x.hash != hash);
            this.onChange();
          }, 1000);
        } else if (call === 'start' || call === 'stop') {
          setTimeout(() => {
            dl.actionPending = false;
            dl.active = call === 'start';
            this.onChange();
          }, 1000);
        }
        this.onChange();
      }
    }
  }
}