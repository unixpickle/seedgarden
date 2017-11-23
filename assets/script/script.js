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
  let list = [];
  props.downloads.forEach(dl => {
    list.push(React.createElement(DownloadEntry, { download: dl,
      key: dl.hash,
      onClick: () => props.onClick(dl.hash) }));
  });
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
        humanSize(props.download.sizeBytes)
      ),
      React.createElement(
        "label",
        { className: "download-upload" },
        humanSize(props.download.uploadTotal)
      ),
      props.download.active && React.createElement(
        "label",
        { className: "download-rate" },
        humanSize(props.download.downloadRate) + '/sec'
      )
    )
  );
}

function humanSize(bytes) {
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
    let elements = [];
    if (this.state.currentSearch && this.state.downloads) {
      elements.push(React.createElement(Search, { downloads: this.state.downloads,
        query: this.state.currentSearch }));
    } else if (this.state.downloads) {
      elements.push(React.createElement(DownloadList, { downloads: this.state.downloads,
        onClick: hash => console.log('click hash', hash) }));
    } else {
      elements.push(React.createElement(LoaderPane, null));
    }
    elements.push(React.createElement(TopBar, { search: this.state.currentSearch,
      onSearchChange: s => this.setState({ currentSearch: s }) }));
    elements.unshift({});
    elements.unshift('div');
    return React.createElement.apply(React, elements);
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
      { className: "search-results" },
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
      { className: 'top-bar' + (this.search ? ' topbar-searching' : '') },
      React.createElement(
        "button",
        { className: "add-button", onClick: this.props.onAdd },
        "Add Magnet URL"
      ),
      React.createElement("input", { className: "search-box",
        onFocus: () => this.setState({ searchFocused: true }),
        onBlur: () => this.setState({ searchFocused: false }),
        onChange: e => this.props.onSearchChange(e.target.value),
        value: this.props.search || '',
        placeholder: "Search" })
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
