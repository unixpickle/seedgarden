class Root extends React.Component {
	constructor() {
		super();
		this.state = initialStateFromHash();
		window.onpopstate = () => this.handlePopState();
    this.client = new TorrentClient();
    this.client.onChange = () => this.setState({downloads: this.client.downloads()});
	}

  handlePopState() {
    this.setState(rootStateFromHash());
  }

	render() {
    return (
      <div class="root">
        <TopBar search={this.state.currentSearch}
                onSearchChange={(s) => this.setState({currentSearch: s})} />
        {(this.state.currentSearch &&
          <Search downloads={this.state.downloads} query={this.state.currentSearch} />)}
        <DownloadList downloads={this.state.downloads}
                      onClick={(hash) => console.log('click hash', hash)}
                      onStart={(hash) => this.client.startTorrent(hash)}
                      onStop={(hash) => this.client.stopTorrent(hash)} />
      </div>
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
    } else {
      // TODO: loading screen here.
    }
    // TODO: add button here.
	}
}

function initialStateFromHash() {
  let result = rootStateFromHash();
  ['currentSearch', 'currentDownloadHash', 'currentPirateBayID', 'downloads'].forEach((k) => {
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
    Object.keys(parsed).forEach((k) => result[k] = parsed[k]);
  } catch (e) {
  }
  return result;
}

window.addEventListener('load', function() {
	ReactDOM.render(<Root />, document.getElementById('content'));
});
