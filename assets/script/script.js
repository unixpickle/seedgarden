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
  return fetch(url).catch(err => {
    if (err instanceof TypeError) {
      return Promise.reject('connection failed');
    } else {
      return Promise.reject(err);
    }
  }).then(resp => {
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
  const result = {};
  Object.keys(obj).forEach(k => {
    if (k == 'ID') {
      result.id = obj[k];
    } else {
      result[k[0].toLowerCase() + k.substr(1)] = obj[k];
    }
  });
  return result;
}
class BackState {
  constructor(stateKeys) {
    this.stateKeys = stateKeys;

    // Back button to homepage (from hash) shouldn't
    // refresh the page.
    if (location.hash == '') {
      history.replaceState({}, window.title, this._stateToHash({}));
    }

    this.onChange = state => false;
    window.addEventListener('popstate', () => {
      this.onChange(this.currentState());
    });
  }

  currentState() {
    const result = this._emptyState();
    if (location.hash.length < 2) {
      return result;
    }
    try {
      Object.assign(result, JSON.parse(decodeURIComponent(location.hash.substr(1))));
    } catch (e) {}
    return result;
  }

  pushState(state) {
    history.pushState({}, window.title, this._stateToHash(state));
  }

  replaceState(state) {
    history.pushState({}, window.title, this._stateToHash(state));
  }

  _emptyState() {
    const result = {};
    this.stateKeys.forEach(k => result[k] = null);
    return result;
  }

  _stateToHash(state) {
    var smallState = {};
    this.stateKeys.forEach(k => state[k] && (smallState[k] = state[k]));
    if (!Object.keys(smallState).length) {
      return '#';
    }
    return '#' + encodeURIComponent(JSON.stringify(smallState));
  }
}
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
    this._lookup = new BayLookup(this.props.id, this.bayCallback.bind(this));
  }

  componentWillUnmount() {
    this._lookup.cancel();
  }

  render() {
    if (this.state.loading) {
      return React.createElement(LoaderPane, null);
    } else if (this.state.error) {
      return React.createElement(
        'div',
        { className: 'error-pane' },
        this.state.error + ''
      );
    } else {
      return React.createElement(
        'div',
        { className: 'bay-info' },
        React.createElement(
          'label',
          { className: 'bay-info-name' },
          this.state.info.name
        ),
        React.createElement(
          'label',
          { className: 'bay-info-seeders' },
          this.state.info.seeders
        ),
        React.createElement(
          'label',
          { className: 'bay-info-leechers' },
          this.state.info.leechers
        ),
        React.createElement(
          'label',
          { className: 'bay-info-size' },
          this.state.info.size
        ),
        React.createElement(
          'button',
          { className: 'bay-info-add-button',
            onClick: () => this.props.onAdd(this.state.info.magnetURL) },
          'Add Torrent'
        )
      );
    }
  }

  bayCallback(error, info) {
    this.setState({ loading: false, error: error, info: info });
  }
}
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
    const addURL = '/api/add?url=' + encodeURIComponent(magnetURL);
    _callBackendAPI(addURL).then(() => this._getList());
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
      const dl = this._downloads[i];
      if (dl.hash == hash && !dl.actionPending) {
        dl.actionPending = true;
        _callBackendAPI('/api/' + call + '?hash=' + encodeURIComponent(hash)).then(() => {
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
    const extraButtonClass = dl.actionPending ? ' download-info-pending' : '';
    return React.createElement(
      'div',
      { className: 'download-info' },
      React.createElement(
        'div',
        { className: 'download-info-heading' },
        dl.active ? React.createElement(
          'button',
          { className: 'download-stop-button' + extraButtonClass,
            onClick: this.props.onStop },
          'Stop'
        ) : React.createElement(
          'button',
          { className: 'download-start-button' + extraButtonClass,
            onClick: this.props.onStart },
          'Start'
        ),
        React.createElement(
          'label',
          { className: 'download-info-name' },
          dl.name
        )
      ),
      dl.active ? React.createElement(LoadingBar, { progress: dl.completedBytes / dl.sizeBytes,
        color: downloadLoaderColor(dl) }) : null,
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
              React.createElement(
                'label',
                null,
                'Size:'
              ),
              React.createElement(
                'label',
                null,
                formatSize(dl.sizeBytes)
              )
            ),
            React.createElement(
              'td',
              null,
              React.createElement(
                'label',
                null,
                '% Complete:'
              ),
              React.createElement(
                'label',
                null,
                (100 * dl.completedBytes / dl.sizeBytes).toFixed(2) + '%'
              )
            )
          ),
          React.createElement(
            'tr',
            null,
            React.createElement(
              'td',
              null,
              React.createElement(
                'label',
                null,
                'Downloaded:'
              ),
              React.createElement(
                'label',
                null,
                formatSize(dl.completedBytes)
              )
            ),
            React.createElement(
              'td',
              null,
              React.createElement(
                'label',
                null,
                'Rate:'
              ),
              React.createElement(
                'label',
                null,
                formatRate(dl.downloadRate)
              )
            )
          ),
          React.createElement(
            'tr',
            null,
            React.createElement(
              'td',
              null,
              React.createElement(
                'label',
                null,
                'Uploaded:'
              ),
              React.createElement(
                'label',
                null,
                formatSize(dl.uploadTotal)
              )
            ),
            React.createElement(
              'td',
              null,
              React.createElement(
                'label',
                null,
                'Rate:'
              ),
              React.createElement(
                'label',
                null,
                formatRate(dl.uploadRate)
              )
            )
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'download-info-delete-container' },
        React.createElement(
          'button',
          { className: 'download-delete-button' + extraButtonClass,
            onClick: this.props.onDelete },
          'Delete'
        )
      ),
      this.filesElement()
    );
  }

  filesElement() {
    if (this.state.files) {
      return React.createElement(
        'div',
        { className: 'download-files' },
        React.createElement(
          'label',
          { className: 'heading' },
          'Files',
          React.createElement(
            'a',
            { href: '/api/downloadall?hash=' + this.props.download.hash },
            ' (get all)'
          )
        ),
        this.state.files.map(x => React.createElement(
          'a',
          { className: 'file-link', key: x.link, href: x.link },
          x.path
        ))
      );
    } else if (this.state.filesError) {
      return React.createElement(
        'div',
        { className: 'download-files-error' },
        this.state.filesError + ''
      );
    } else {
      return React.createElement(
        'div',
        { className: 'download-files-loading' },
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
      'div',
      { id: 'no-downloads' },
      React.createElement(
        'h1',
        null,
        'No Downloads'
      )
    );
  }
  const list = props.downloads.map(dl => {
    return React.createElement(DownloadEntry, { download: dl,
      key: dl.hash,
      onClick: () => props.onClick(dl.hash) });
  }).reverse();
  return React.createElement(
    'ol',
    { id: 'downloads' },
    list
  );
}

function DownloadEntry(props) {
  const dl = props.download;

  let details = React.createElement(LoadingBar, { progress: dl.completedBytes / dl.sizeBytes,
    color: downloadLoaderColor(dl) });
  if (!dl.active && dl.completedBytes === dl.sizeBytes) {
    details = React.createElement(ListInfoBox, { keys: ['Size', 'Uploaded'],
      values: [formatSize(dl.sizeBytes), formatSize(dl.uploadTotal)] });
  }
  return React.createElement(
    'li',
    { className: 'download' + (props.actionPending ? ' download-frozen' : ''),
      onClick: props.onClick },
    React.createElement(
      'label',
      { className: 'download-name' },
      dl.name
    ),
    details
  );
}
function ListInfoBox(props) {
  const fields = [];
  props.keys.forEach((key, i) => {
    fields.push(React.createElement(
      'div',
      { className: 'list-item-info-field', key: i },
      React.createElement(
        'label',
        null,
        key,
        ':'
      ),
      React.createElement(
        'label',
        null,
        props.values[i]
      )
    ));
  });
  return React.createElement(
    'div',
    { className: 'list-item-info-box' },
    fields
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

function LoadingBar(props) {
  const style = {
    width: (props.progress * 100).toFixed(3) + '%',
    backgroundColor: props.color
  };
  return React.createElement(
    'div',
    { className: 'loading-bar' },
    React.createElement('div', { className: 'loading-bar-filler', style: style })
  );
}

function downloadLoaderColor(dl) {
  if (dl.completedBytes < dl.sizeBytes) {
    if (dl.active) {
      return '#65bcd4';
    } else {
      return '#feb4b1';
    }
  }
  return '#a7e48b';
}
class Root extends React.Component {
  constructor() {
    super();

    this.backState = new BackState(['currentSearch', 'currentDownloadHash', 'currentBayID']);
    this.backState.onChange = s => this.setState(s);
    this.state = this.backState.currentState();

    this.state.downloads = null;
    this.client = null;
  }

  componentWillMount() {
    this.client = new TorrentClient();
    this.client.onChange = () => this.setState({ downloads: this.client.downloads() });
  }

  render() {
    const canExit = this.state.currentSearch || this.state.currentDownloadHash || this.state.currentBayID;
    return React.createElement(
      'div',
      null,
      this.contentPane(),
      React.createElement(TopBar, { search: this.state.currentSearch,
        canExit: canExit,
        onExit: () => this.handleExit(),
        onSearchChange: s => this.handleSearchChange(s) }),
      React.createElement(
        'button',
        { id: 'add-button', onClick: () => this.handleAddURL() },
        'Add Torrent'
      )
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
          onDelete: () => this.handleDeleteTorrent(result.hash) });
      } else {
        return React.createElement(
          'div',
          { className: 'error-pane' },
          'Download does not exist.'
        );
      }
    } else if (this.state.currentBayID) {
      return React.createElement(BayInfo, { id: this.state.currentBayID,
        onAdd: u => this.handleAddFromBay(u) });
    } else {
      return React.createElement(DownloadList, { downloads: this.state.downloads,
        onClick: hash => this.showDownload(hash) });
    }
  }

  showDownload(hash) {
    const newState = { currentDownloadHash: hash };
    this.backState.pushState(newState);
    this.setState(this.backState.currentState());
  }

  showBay(id) {
    const newState = { currentBayID: id };
    this.backState.pushState(newState);
    this.setState(this.backState.currentState());
  }

  handleSearchChange(query) {
    const oldSearch = this.state.currentSearch;
    const newState = this.setState({ currentSearch: query }, () => {
      if (oldSearch && query) {
        this.backState.replaceState(this.state);
      } else {
        this.backState.pushState(this.state);
      }
    });
  }

  handleExit() {
    this.backState.pushState({});
    this.setState(this.backState.currentState());
  }

  handleDeleteTorrent(hash) {
    this.client.deleteTorrent(hash);
    this.handleExit();
  }

  handleAddURL() {
    const url = prompt('Magnet URL');
    if (url) {
      this.client.addTorrent(url);
    }
  }

  handleAddFromBay(url) {
    this.client.addTorrent(url);
    this.handleExit();
  }
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
    return React.createElement(
      'ol',
      { className: 'search-results' },
      React.createElement(SearchHeading, { key: 'heading-1', text: 'In the client' }),
      this.downloadListing(),
      React.createElement(SearchHeading, { key: 'heading-2', text: window.BAY_SLANG_NAME }),
      this.bayListing()
    );
  }

  downloadListing() {
    const downloads = filterDownloads(this.props.downloads, this.props.query);
    const elems = downloads.map((d, i) => {
      return React.createElement(SearchListing, { onClick: () => this.props.onClickDownload(d.hash),
        key: 'dl-' + i, name: d.name });
    }).reverse();
    if (elems.length == 0) {
      return React.createElement(SearchEmpty, { key: 'dl-empty' });
    } else {
      return elems;
    }
  }

  bayListing() {
    if (this.state.bayResults) {
      const elems = this.state.bayResults.map((r, i) => {
        return React.createElement(SearchListing, { onClick: () => this.props.onClickBay(r.id),
          key: 'bay-' + i, name: r.name,
          keys: ['Size'], values: [r.size] });
      });
      if (elems.length === 0) {
        return React.createElement(SearchEmpty, { key: 'bay-empty' });
      } else {
        return elems;
      }
    } else if (this.state.bayError) {
      return React.createElement(SearchError, { key: 'bay-error', message: this.state.bayError });
    } else {
      return React.createElement(SearchLoading, { key: 'bay-loading' });
    }
  }

  bayCallback(error, results) {
    error = error && error.toString();
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
    React.createElement(
      'label',
      null,
      props.name
    ),
    props.keys && React.createElement(ListInfoBox, { keys: props.keys, values: props.values })
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
      this.props.canExit && React.createElement(
        'button',
        { className: 'top-bar-exit-button', onClick: this.props.onExit },
        'Go Home'
      ),
      React.createElement('input', { className: 'top-bar-search-box',
        onFocus: () => this.setState({ searchFocused: true }),
        onBlur: () => this.setState({ searchFocused: false }),
        onChange: e => this.props.onSearchChange(e.target.value),
        value: this.props.search || '',
        placeholder: 'Search' })
    );
  }
}
