class BayInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      info: null
    };
    this._lookup = null;
  }

  componentWillMount() {
    this._lookup = new BayLookup(props.id, this.bayCallback.bind(this));
  }

  componentWillUnmount() {
    this._lookup.cancel();
  }

  render() {
    if (this.state.loading) {
      return React.createElement(LoaderPane, null);
    } else if (this.state.error) {
      return React.createElement(
        "div",
        { className: "error-pane" },
        this.state.error
      );
    } else {
      return React.createElement(
        "div",
        { className: "bay-info" },
        React.createElement(
          "label",
          { className: "bay-info-name" },
          this.state.info.name
        ),
        React.createElement(
          "label",
          { className: "bay-info-seeders" },
          this.state.info.seeders
        ),
        React.createElement(
          "label",
          { className: "bay-info-leechers" },
          this.state.info.leechers
        ),
        React.createElement(
          "button",
          { className: "bay-info-add-button",
            onClick: () => this.props.onAdd(this.state.info.magnetURL) },
          "Add Torrent"
        )
      );
    }
  }

  bayCallback(error, info) {
    this.setState({ loading: false, error: error, info: info });
  }
}
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
    return this._downloads.map(obj => Object.assign({}, obj));
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
    _callBackendAPI('/api/downloads').then(data => {
      this._gettingList = false;
      if (this._actionsPending()) {
        return;
      }
      this._downloads = data.map(x => {
        x.active = x.state != 0;
        x.actionPending = false;
        return x;
      });
      setTimeout(this.onChange, 0);
    }).catch(e => {
      this._gettingList = false;
      // TODO: maybe handle error here...
      console.trace(e);
    });
  }

  _actionsPending() {
    return this._downloads && this._downloads.find(x => x.actionPending);
  }

  _torrentCall(call, hash) {
    for (let i = 0; i < this._downloads.length; ++i) {
      let dl = this._downloads[i];
      if (dl.hash == hash && !dl.actionPending) {
        dl.actionPending = true;
        _callBackendAPI('/api/' + call + '?hash=' + encodeURIComponent(hash)).then(() => {
          dl.actionPending = false;
          setTimeout(this.onChange, 0);
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
      _callBackendAPI('/api/baysearch?query=' + encodeURIComponent(query)).then(obj => {
        this._cb(null, obj);
      }).catch(err => {
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

class CancelableCall {
  constructor(url, cb) {
    this._cb = cb;
    _callBackendAPI(url).then(obj => {
      this._cb(null, obj);
    }).catch(err => {
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
  return fetch(url).then(resp => {
    if (!resp.ok) {
      return Promise.reject(new Error('request failed'));
    }
    return resp.json();
  }).then(obj => {
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
  let result = {};
  Object.keys(obj).forEach(k => {
    if (k == 'ID') {
      result.id = obj[k];
    } else {
      result[k[0].toLowerCase() + k.substr(1)] = obj[k];
    }
  });
  return result;
}
class DownloadInfo extends React.Component {
  constructor() {
    super();
    this.state = { filesLoading: true, filesError: null, files: null };
    this.fileReq = null;
  }

  componentWillMount() {
    this.fileReq = new ListFiles(this.props.download.hash, this.filesCallback.bind(this));
  }

  componentWillUnmount() {
    this.fileReq.cancel();
  }

  render() {
    const dl = this.props.download;
    return React.createElement(
      "div",
      { className: "download-info" },
      React.createElement(
        "table",
        { className: "download-info-table" },
        React.createElement(
          "tbody",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement(
              "td",
              null,
              "Name"
            ),
            React.createElement(
              "td",
              null,
              dl.name
            )
          ),
          React.createElement(
            "tr",
            null,
            React.createElement(
              "td",
              null,
              "Progress"
            ),
            React.createElement(
              "td",
              null,
              (100 * dl.completedBytes / dl.sizeBytes).toFixed(2) + '%'
            )
          ),
          React.createElement(
            "tr",
            null,
            React.createElement(
              "td",
              null,
              "Size"
            ),
            React.createElement(
              "td",
              null,
              formatSize(dl.sizeBytes)
            )
          ),
          React.createElement(
            "tr",
            null,
            React.createElement(
              "td",
              null,
              "Completed"
            ),
            React.createElement(
              "td",
              null,
              formatSize(dl.completedBytes)
            )
          ),
          React.createElement(
            "tr",
            null,
            React.createElement(
              "td",
              null,
              "DL Rate"
            ),
            React.createElement(
              "td",
              null,
              formatRate(dl.downloadRate)
            )
          ),
          React.createElement(
            "tr",
            null,
            React.createElement(
              "td",
              null,
              "UL Rate"
            ),
            React.createElement(
              "td",
              null,
              formatRate(dl.uploadRate)
            )
          ),
          React.createElement(
            "tr",
            null,
            React.createElement(
              "td",
              null,
              "Uploaded"
            ),
            React.createElement(
              "td",
              null,
              formatSize(dl.uploadTotal)
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: 'download-actions' + (dl.actionPending ? ' download-frozen' : '') },
        dl.active ? React.createElement(
          "button",
          { className: "download-action-button", onClick: this.props.onStop },
          "Stop"
        ) : React.createElement(
          "button",
          { className: "download-action-button", onClick: this.props.onStart },
          "Start"
        ),
        React.createElement(
          "button",
          { className: "download-delete-button", onClick: this.props.onDelete },
          "Delete"
        )
      ),
      this.filesElement()
    );
  }

  filesElement() {
    if (this.state.files) {
      return React.createElement(
        "div",
        { className: "download-files" },
        this.state.files.map(x => React.createElement(
          "a",
          { key: x.link, href: x.link },
          x.path
        ))
      );
    } else if (this.state.filesError) {
      return React.createElement(
        "div",
        { className: "download-files-error" },
        this.state.filesError
      );
    } else {
      return React.createElement(
        "div",
        { className: "download-files-loading" },
        React.createElement(Loader, null)
      );
    }
  }

  filesCallback(error, files) {
    this.setState({ filesLoading: false, filesError: error, files: files });
  }
}

function formatSize(bytes) {
  const suffixes = [' KB', ' MB', ' GB', ' TB'];
  for (let i = 0; i < suffixes.length; ++i) {
    const suffix = suffixes[i];
    const size = bytes / Math.pow(10, 3 * (i + 1));
    if (size < 10) {
      return size.toFixed(2) + suffix;
    } else if (size < 100) {
      return size.toFixed(1) + suffix;
    } else if (size < 1000) {
      return Math.round(size) + suffix;
    }
  }
  return bytes + ' bytes';
}

function formatRate(rate) {
  return formatSize(rate) + '/sec';
}
function DownloadList(props) {
  if (props.downloads.length === 0) {
    return React.createElement(
      "div",
      { id: "no-downloads" },
      React.createElement(
        "h1",
        null,
        "No Downloads"
      )
    );
  }
  let list = props.downloads.map(dl => {
    return React.createElement(DownloadEntry, { download: dl,
      key: dl.hash,
      onClick: () => props.onClick(dl.hash) });
  }).reverse();
  return React.createElement(
    "ol",
    { id: "downloads" },
    list
  );
}

function DownloadEntry(props) {
  return React.createElement(
    "li",
    { className: 'download' + (props.actionPending ? ' download-frozen' : ''),
      onClick: props.onClick },
    React.createElement("div", { className: 'download-state-' + (props.download.active ? 'active' : 'inactive') }),
    React.createElement(
      "label",
      { className: "download-name" },
      props.download.name
    ),
    React.createElement(
      "div",
      { className: "download-stats" },
      React.createElement(
        "label",
        { className: "download-size" },
        formatSize(props.download.sizeBytes)
      ),
      React.createElement(
        "label",
        { className: "download-upload" },
        formatSize(props.download.uploadTotal)
      ),
      props.download.active && React.createElement(
        "label",
        { className: "download-rate" },
        formatRate(props.download.downloadRate)
      )
    )
  );
}
function Loader(props) {
  return React.createElement(
    "div",
    { className: "loader" },
    "Loading"
  );
}

function LoaderPane(props) {
  return React.createElement(
    "div",
    { className: "loader-pane" },
    React.createElement(Loader, null)
  );
}
const STATE_KEYS = ['currentSearch', 'currentDownloadHash', 'currentBayID'];

class Root extends React.Component {
  constructor() {
    super();
    this.state = initialStateFromHash();
    window.onpopstate = () => this.handlePopState();
    this.client = null;
  }

  componentWillMount() {
    this.client = new TorrentClient();
    this.client.onChange = () => this.setState({ downloads: this.client.downloads() });
  }

  handlePopState() {
    this.setState(rootStateFromHash());
  }

  changeSearch(query) {
    const stateObj = {};
    STATE_KEYS.forEach(k => stateObj[k] = this.state[k]);
    stateObj.currentSearch = query;
    if (this.state.currentSearch && query) {
      history.replaceState({}, window.title, '#' + JSON.stringify(stateObj));
    } else {
      history.pushState({}, window.title, '#' + JSON.stringify(stateObj));
    }
    this.setState({ currentSearch: query });
  }

  showDownload(hash) {
    const update = { currentDownloadHash: hash };
    this.pushHistoryState(update);
    this.setState(Object.assign(emptyState(), update));
  }

  showBay(id) {
    const update = { currentBayID: id };
    this.pushHistoryState(update);
    this.setState(Object.assign(emptyState(), update));
  }

  exitPane() {
    this.setState(emptyState());
    this.pushHistoryState({});
  }

  deleteTorrent(hash) {
    this.client.deleteTorrent(hash);
    this.exitPane();
  }

  addURL() {
    const url = prompt('Magnet URL');
    if (url) {
      this.client.addTorrent(url);
    }
  }

  addFromBay(url) {
    this.client.addTorrent(url);
    this.exitPane();
  }

  pushHistoryState(state) {
    history.pushState({}, window.title, '#' + JSON.stringify(state));
  }

  render() {
    const canExit = this.state.currentSearch || this.state.currentDownloadHash || this.state.currentBayID;
    return React.createElement(
      "div",
      null,
      this.contentPane(),
      React.createElement(TopBar, { search: this.state.currentSearch,
        canExit: canExit,
        onExit: () => this.exitPane(),
        onSearchChange: s => this.changeSearch(s),
        onAdd: () => this.addURL() })
    );
  }

  contentPane() {
    if (!this.state.downloads) {
      return React.createElement(LoaderPane, null);
    }if (this.state.currentSearch) {
      return React.createElement(Search, { downloads: this.state.downloads,
        query: this.state.currentSearch,
        onClickDownload: hash => this.showDownload(hash),
        onClickBay: id => this.showBay(id) });
    } else if (this.state.currentDownloadHash) {
      const result = this.state.downloads.find(x => {
        return x.hash === this.state.currentDownloadHash;
      });
      if (result) {
        return React.createElement(DownloadInfo, { download: result,
          onStart: () => this.client.startTorrent(result.hash),
          onStop: () => this.client.stopTorrent(result.hash),
          onDelete: () => this.deleteTorrent(result.hash) });
      } else {
        return React.createElement(
          "div",
          { className: "error-pane" },
          "Download does not exist."
        );
      }
    } else if (this.state.currentBayID) {
      return React.createElement(BayInfo, { id: this.state.currentBayID,
        onAdd: u => this.addFromBay(u) });
    } else {
      return React.createElement(DownloadList, { downloads: this.state.downloads,
        onClick: hash => this.showDownload(hash) });
    }
  }
}

function initialStateFromHash() {
  let result = rootStateFromHash();
  result.downloads = null;
  return result;
}

function rootStateFromHash() {
  let result = emptyState();
  if (location.hash.length < 2) {
    return result;
  }
  try {
    Object.assign(result, JSON.parse(location.hash.substr(1)));
  } catch (e) {}
  return result;
}

function emptyState() {
  let result = {};
  STATE_KEYS.forEach(k => result[k] = null);
  return result;
}

window.addEventListener('load', function () {
  ReactDOM.render(React.createElement(Root, null), document.getElementById('content'));
});
class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bayResults: null,
      bayLoading: true,
      bayError: null
    };
    this.baySearch = null;
  }

  componentWillMount() {
    this.baySearch = new BaySearch(this.props.query, this.bayCallback.bind(this));
  }

  componentWillUnmount() {
    this.baySearch.cancel();
  }

  componentWillReceiveProps(props) {
    if (props.query !== this.baySearch.query) {
      this.baySearch.cancel();
      this.setState({ bayResults: null, bayLoading: true, bayError: null });
      this.baySearch = new BaySearch(props.query, this.bayCallback.bind(this));
    }
  }

  render() {
    const downloads = filterDownloads(this.props.downloads, this.props.query);
    let downloadElems = downloads.map((d, i) => {
      return React.createElement(SearchListing, { onClick: () => this.props.onClickDownload(d.hash),
        key: 'dl-' + i, name: d.name });
    }).reverse();
    if (downloadElems.length == 0) {
      downloadElems = React.createElement(SearchEmpty, { key: "dl-empty" });
    }
    let bayElems = React.createElement(SearchLoading, { key: "bay-loading" });
    console.log('yoooo', this.state.bayError);
    if (this.state.bayResults) {
      bayElems = this.state.bayResults.map((r, i) => {
        return React.createElement(SearchListing, { onClick: () => this.props.onClickBay(r.id),
          key: 'bay-' + i, name: r.name });
      });
      if (bayElems.length === 0) {
        bayElems = React.createElement(SearchEmpty, { key: "bay-empty" });
      }
    } else if (this.state.bayError) {
      bayElems = React.createElement(SearchError, { key: "bay-error", message: this.state.bayError });
    }
    return React.createElement(
      "ol",
      { className: "search-results" },
      React.createElement(SearchHeading, { key: "heading-1", text: "In the client" }),
      downloadElems,
      React.createElement(SearchHeading, { key: "heading-2", text: "On the bay" }),
      bayElems
    );
  }

  bayCallback(error, results) {
    error = error && error.toString();
    this.setState({ bayResults: results, bayLoading: false, bayError: error });
  }
}

function SearchHeading(props) {
  return React.createElement(
    "div",
    { className: "search-heading" },
    props.text
  );
}

function SearchListing(props) {
  return React.createElement(
    "div",
    { className: "search-listing", onClick: props.onClick },
    props.name
  );
}

function SearchEmpty() {
  return React.createElement(
    "div",
    { className: "search-empty" },
    "No results"
  );
}

function SearchLoading() {
  return React.createElement(
    "div",
    { className: "search-loading" },
    React.createElement(Loader, null)
  );
}

function SearchError(props) {
  return React.createElement(
    "div",
    { className: "search-error" },
    props.message
  );
}

function filterDownloads(downloads, query) {
  query = query.toLowerCase();
  return downloads.filter(x => x.name.toLowerCase().includes(query));
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
      { className: 'top-bar' + (this.search ? ' topbar-searching' : '') },
      this.props.canExit && React.createElement(
        "button",
        { className: "top-bar-exit-button", onClick: this.props.onExit },
        "Go Home"
      ),
      React.createElement(
        "button",
        { className: "top-bar-add-button", onClick: this.props.onAdd },
        "Add Magnet URL"
      ),
      React.createElement("input", { className: "top-bar-search-box",
        onFocus: () => this.setState({ searchFocused: true }),
        onBlur: () => this.setState({ searchFocused: false }),
        onChange: e => this.props.onSearchChange(e.target.value),
        value: this.props.search || '',
        placeholder: "Search" })
    );
  }
}
