const STATE_KEYS = ['currentSearch', 'currentDownloadHash', 'currentPirateBayID'];

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

	showDownload(hash) {
		const stateDict = {currentSearch: null, currentDownloadHash: hash};
		this.setState(stateDict);
		this.pushHistoryState(stateDict);
	}

	exitPane() {
		const newState = {};
		STATE_KEYS.forEach((k) => newState[k] = null);
		this.setState(newState);
		this.pushHistoryState({});
	}

	pushHistoryState(state) {
		history.pushState({}, window.title, '#'+JSON.stringify(state));
	}

	render() {
		const canExit = (this.state.currentSearch || this.state.currentDownloadHash);
		return (
			<div>
				{this.contentPane()}
				<TopBar search={this.state.currentSearch}
				        canExit={canExit}
								onExit={() => this.exitPane()}
								onSearchChange={(s) => this.setState({currentSearch: s})} />
			</div>
		);
	}

	contentPane() {
		if (!this.state.downloads) {
			return <LoaderPane />;
    } if (this.state.currentSearch) {
			return <Search downloads={this.state.downloads}
                     query={this.state.currentSearch} />;
		} else if (this.state.currentDownloadHash) {
			const result = this.state.downloads.find((x) => {
				return x.hash === this.state.currentDownloadHash;
			});
			if (result) {
				return <DownloadInfo download={result} />;
			} else {
				return <div className='error-pane'>Download does not exist.</div>;
			}
    } else {
      return <DownloadList downloads={this.state.downloads}
                           onClick={(hash) => this.showDownload(hash)} />;
    }
	}
}

function initialStateFromHash() {
  let result = rootStateFromHash();
	result.downloads = null;
  return result;
}

function rootStateFromHash() {
  let result = {};
  if (location.hash.length < 2) {
    return result;
  }
  try {
    let parsed = JSON.parse(location.hash.substr(1));
		STATE_KEYS.forEach((k) => {
	    if (parsed.hasOwnProperty(k)) {
	      result[k] = parsed[k];
	    } else {
				result[k] = null;
			}
	  });
  } catch (e) {
  }
  return result;
}

window.addEventListener('load', function() {
	ReactDOM.render(<Root />, document.getElementById('content'));
});
