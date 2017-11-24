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

	pushHistoryState(state) {
		history.pushState({}, window.title, '#'+JSON.stringify(state));
	}

	render() {
		return (
			<div>
				{this.contentPane()}
				<TopBar search={this.state.currentSearch}
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
