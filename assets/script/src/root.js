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
		const update = {currentDownloadHash: hash};
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
                     query={this.state.currentSearch}
										 onClickDownload={(hash) => this.showDownload(hash)} />;
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
  let result = emptyState();
  if (location.hash.length < 2) {
    return result;
  }
  try {
		Object.assign(result, JSON.parse(location.hash.substr(1)));
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
