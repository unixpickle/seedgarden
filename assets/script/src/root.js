const STATE_KEYS = ['currentSearch', 'currentDownloadHash', 'currentBayID'];

class Root extends React.Component {
  constructor() {
    super();

    // Make going home not reload the page.
    if (location.hash == '') {
      history.replaceState({}, window.title, stateToHash({}));
    }

    this.state = initialStateFromHash();
    window.onpopstate = () => this.handlePopState();
    this.client = null;
  }

  componentWillMount() {
    this.client = new TorrentClient();
    this.client.onChange = () => this.setState({downloads: this.client.downloads()});
  }

  handlePopState() {
    this.setState(rootStateFromHash());
  }

  changeSearch(query) {
    const oldSearch = this.state.currentSearch;
    const newState = this.setState({currentSearch: query}, () => {
      if (oldSearch && query) {
        history.replaceState({}, window.title, stateToHash(this.state));
      } else {
        history.pushState({}, window.title, stateToHash(this.state));
      }
    });
  }

  showDownload(hash) {
    const update = {currentDownloadHash: hash};
    this.pushHistoryState(update);
    this.setState(Object.assign(emptyState(), update));
  }

  showBay(id) {
    const update = {currentBayID: id};
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
    history.pushState({}, window.title, stateToHash(state));
  }

  render() {
    const canExit = (this.state.currentSearch || this.state.currentDownloadHash ||
                     this.state.currentBayID);
    return (
      <div>
        {this.contentPane()}
        <TopBar search={this.state.currentSearch}
                canExit={canExit}
                onExit={() => this.exitPane()}
                onSearchChange={(s) => this.changeSearch(s)} />
        <button id="add-button" onClick={() => this.addURL()}>Add Torrent</button>
      </div>
    );
  }

  contentPane() {
    if (!this.state.downloads) {
      return <LoaderPane />;
    } if (this.state.currentSearch) {
      return <Search downloads={this.state.downloads}
                     query={this.state.currentSearch}
                     onClickDownload={(hash) => this.showDownload(hash)}
                     onClickBay={(id) => this.showBay(id)} />;
    } else if (this.state.currentDownloadHash) {
      const result = this.state.downloads.find((x) => {
        return x.hash === this.state.currentDownloadHash;
      });
      if (result) {
        return <DownloadInfo download={result}
                             onStart={() => this.client.startTorrent(result.hash)}
                             onStop={() => this.client.stopTorrent(result.hash)}
                             onDelete={() => this.deleteTorrent(result.hash)} />;
      } else {
        return <div className='error-pane'>Download does not exist.</div>;
      }
    } else if (this.state.currentBayID) {
      return <BayInfo id={this.state.currentBayID}
                      onAdd={(u) => this.addFromBay(u)} />
    } else {
      return <DownloadList downloads={this.state.downloads}
                           onClick={(hash) => this.showDownload(hash)} />;
    }
  }
}

function stateToHash(state) {
  var smallState = {};
  STATE_KEYS.forEach((k) => (state[k] && (smallState[k] = state[k])));
  if (!Object.keys(smallState).length) {
    return '#';
  }
  return '#' + encodeURIComponent(JSON.stringify(smallState));
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
    Object.assign(result, JSON.parse(decodeURIComponent(location.hash.substr(1))));
  } catch (e) {
  }
  return result;
}

function emptyState() {
  let result = {};
  STATE_KEYS.forEach((k) => result[k] = null);
  return result;
}

window.addEventListener('load', function() {
  ReactDOM.render(<Root />, document.getElementById('content'));
});
