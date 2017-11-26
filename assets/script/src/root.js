class Root extends React.Component {
  constructor() {
    super();

    this.backState = new BackState(['currentSearch', 'currentDownloadHash', 'currentBayID']);
    this.backState.onChange = (s) => this.setState(s);
    this.state = this.backState.currentState();

    this.state.downloads = null;
    this.client = null;
  }

  componentWillMount() {
    this.client = new TorrentClient();
    this.client.onChange = () => this.setState({downloads: this.client.downloads()});
  }

  render() {
    const canExit = (this.state.currentSearch || this.state.currentDownloadHash ||
                     this.state.currentBayID);
    return (
      <div>
        {this.contentPane()}
        <TopBar search={this.state.currentSearch}
                canExit={canExit}
                onExit={() => this.handleExit()}
                onSearchChange={(s) => this.handleSearchChange(s)} />
        <button id="add-button" onClick={() => this.handleAddURL()}>Add Torrent</button>
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
                             onDelete={() => this.handleDeleteTorrent(result.hash)} />;
      } else {
        return <div className='error-pane'>Download does not exist.</div>;
      }
    } else if (this.state.currentBayID) {
      return <BayInfo id={this.state.currentBayID}
                      onAdd={(u) => this.handleAddFromBay(u)} />
    } else {
      return <DownloadList downloads={this.state.downloads}
                           onClick={(hash) => this.showDownload(hash)} />;
    }
  }

  showDownload(hash) {
    const newState = {currentDownloadHash: hash};
    this.backState.pushState(newState);
    this.setState(this.backState.currentState());
  }

  showBay(id) {
    const newState = {currentBayID: id};
    this.backState.pushState(newState);
    this.setState(this.backState.currentState());
  }

  handleSearchChange(query) {
    const oldSearch = this.state.currentSearch;
    const newState = this.setState({currentSearch: query}, () => {
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

window.addEventListener('load', function() {
  ReactDOM.render(<Root />, document.getElementById('content'));
});
