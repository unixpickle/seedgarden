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
    let elements = [];
    if (this.state.currentSearch && this.state.downloads) {
      elements.push(<Search downloads={this.state.downloads}
                            query={this.state.currentSearch} />);
    } else if (this.state.downloads) {
      elements.push(<DownloadList downloads={this.state.downloads}
                                  onClick={(hash) => console.log('click hash', hash)} />);
    } else {
      elements.push(<LoaderPane />);
    }
    elements.push(<TopBar search={this.state.currentSearch}
                          onSearchChange={(s) => this.setState({currentSearch: s})} />);
    elements.unshift({});
    elements.unshift('div');
    return React.createElement.apply(React, elements);
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
