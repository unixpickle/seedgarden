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
    return <div class='search-results'>Some results here!</div>;
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
    this.setState({bayResults: results, bayLoading: false, bayError: error});
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
  return downloads
}

window.addEventListener('load', function() {
	ReactDOM.render(<Root />, document.getElementById('content'));
});
