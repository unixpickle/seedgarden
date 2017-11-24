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
function DownloadInfo(props) {
  const dl = props.download;
  return React.createElement(
    'div',
    { className: 'download-info' },
    React.createElement(
      'table',
      { className: 'download-info-table' },
      React.createElement(
        'tbody',
        null,
        React.createElement(
          'tr',
          null,
          React.createElement(
            'td',
            null,
            'Name'
          ),
          React.createElement(
            'td',
            null,
            dl.name
          )
        ),
        React.createElement(
          'tr',
          null,
          React.createElement(
            'td',
            null,
            'Progress'
          ),
          React.createElement(
            'td',
            null,
            (100 * dl.completedBytes / dl.sizeBytes).toFixed(2) + '%'
          )
        ),
        React.createElement(
          'tr',
          null,
          React.createElement(
            'td',
            null,
            'Size'
          ),
          React.createElement(
            'td',
            null,
            formatSize(dl.sizeBytes)
          )
        ),
        React.createElement(
          'tr',
          null,
          React.createElement(
            'td',
            null,
            'Completed'
          ),
          React.createElement(
            'td',
            null,
            formatSize(dl.completedBytes)
          )
        ),
        React.createElement(
          'tr',
          null,
          React.createElement(
            'td',
            null,
            'DL Rate'
          ),
          React.createElement(
            'td',
            null,
            formatRate(dl.downloadRate)
          )
        ),
        React.createElement(
          'tr',
          null,
          React.createElement(
            'td',
            null,
            'UL Rate'
          ),
          React.createElement(
            'td',
            null,
            formatRate(dl.uploadRate)
          )
        ),
        React.createElement(
          'tr',
          null,
          React.createElement(
            'td',
            null,
            'Uploaded'
          ),
          React.createElement(
            'td',
            null,
            formatSize(dl.uploadTotal)
          )
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'download-actions' + (dl.actionPending ? ' download-frozen' : '') },
      React.createElement(
        'button',
        { className: 'download-action-button' },
        dl.active ? 'Stop' : 'Start'
      ),
      React.createElement(
        'button',
        { className: 'download-delete-button' },
        'Delete'
      )
    )
  );
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
      'div',
      { id: 'no-downloads' },
      React.createElement(
        'h1',
        null,
        'No Downloads'
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
    'ol',
    { id: 'downloads' },
    list
  );
}

function DownloadEntry(props) {
  return React.createElement(
    'li',
    { className: 'download' + (props.actionPending ? ' download-frozen' : ''),
      onClick: props.onClick },
    React.createElement('div', { className: 'download-state-' + (props.download.active ? 'active' : 'inactive') }),
    React.createElement(
      'label',
      { className: 'download-name' },
      props.download.name
    ),
    React.createElement(
      'div',
      { className: 'download-stats' },
      React.createElement(
        'label',
        { className: 'download-size' },
        formatSize(props.download.sizeBytes)
      ),
      React.createElement(
        'label',
        { className: 'download-upload' },
        formatSize(props.download.uploadTotal)
      ),
      props.download.active && React.createElement(
        'label',
        { className: 'download-rate' },
        formatRate(props.download.downloadRate)
      )
    )
  );
}
function Loader(props) {
  return React.createElement(
    'div',
    { className: 'loader' },
    'Loading'
  );
}

function LoaderPane(props) {
  return React.createElement(
    'div',
    { className: 'loader-pane' },
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

  showDownload(hash) {
    const stateDict = { currentSearch: null, currentDownloadHash: hash };
    this.setState(stateDict);
    this.pushHistoryState(stateDict);
  }

  pushHistoryState(state) {
    history.pushState({}, window.title, '#' + JSON.stringify(state));
  }

  render() {
    return React.createElement(
      'div',
      null,
      this.contentPane(),
      React.createElement(TopBar, { search: this.state.currentSearch,
        onSearchChange: s => this.setState({ currentSearch: s }) })
    );
  }

  contentPane() {
    if (!this.state.downloads) {
      return React.createElement(LoaderPane, null);
    }if (this.state.currentSearch) {
      return React.createElement(Search, { downloads: this.state.downloads,
        query: this.state.currentSearch });
    } else if (this.state.currentDownloadHash) {
      const result = this.state.downloads.find(x => {
        return x.hash === this.state.currentDownloadHash;
      });
      if (result) {
        return React.createElement(DownloadInfo, { download: result });
      } else {
        return React.createElement(
          'div',
          { className: 'error-pane' },
          'Download does not exist.'
        );
      }
    } else {
      return React.createElement(DownloadList, { downloads: this.state.downloads,
        onClick: hash => this.showDownload(hash) });
    }
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
    const downloads = filterDownloads(this.props.downloads, this.props.query);
    let downloadElems = downloads.map((d, i) => {
      return React.createElement(SearchListing, { onClick: () => this.props.onClickDownload(d.hash),
        key: 'dl-' + i, name: d.name });
    });
    if (downloadElems.length == 0) {
      downloadElems = React.createElement(SearchEmpty, { key: 'dl-empty' });
    }
    let bayElems = React.createElement(SearchLoading, { key: 'bay-loading' });
    if (this.state.bayResults) {
      bayElems = this.state.bayResults.map((r, i) => {
        return React.createElement(SearchListing, { onClick: () => this.props.onClickBay(r.id),
          key: 'bay-' + i, name: r.name });
      });
      if (bayElems.length === 0) {
        bayElems = React.createElement(SearchEmpty, { key: 'bay-empty' });
      }
    } else if (this.state.bayError) {
      bayElems = React.createElement(SearchError, { key: 'bay-error', message: this.state.bayError });
    }
    return React.createElement(
      'ol',
      { className: 'search-results' },
      React.createElement(SearchHeading, { key: 'heading-1', text: 'In the client' }),
      downloadElems,
      React.createElement(SearchHeading, { key: 'heading-2', text: 'On the bay' }),
      bayElems
    );
  }

  bayCallback(error, results) {
    this.baySearch = null;
    this.setState({ bayResults: results, bayLoading: false, bayError: error });
  }
}

function SearchHeading(props) {
  return React.createElement(
    'div',
    { className: 'search-heading' },
    props.text
  );
}

function SearchListing(props) {
  return React.createElement(
    'div',
    { className: 'search-listing', onClick: props.onClick },
    props.name
  );
}

function SearchEmpty() {
  return React.createElement(
    'div',
    { className: 'search-empty' },
    'No results'
  );
}

function SearchLoading() {
  return React.createElement(
    'div',
    { className: 'search-loading' },
    React.createElement(Loader, null)
  );
}

function SearchError(props) {
  return React.createElement(
    'div',
    { className: 'search-error' },
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
      'div',
      { className: 'top-bar' + (this.search ? ' topbar-searching' : '') },
      React.createElement(
        'button',
        { className: 'add-button', onClick: this.props.onAdd },
        'Add Magnet URL'
      ),
      React.createElement('input', { className: 'search-box',
        onFocus: () => this.setState({ searchFocused: true }),
        onBlur: () => this.setState({ searchFocused: false }),
        onChange: e => this.props.onSearchChange(e.target.value),
        value: this.props.search || '',
        placeholder: 'Search' })
    );
  }
}
