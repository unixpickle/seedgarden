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
      this.setState({bayResults: null, bayLoading: true, bayError: null});
      this.baySearch = new BaySearch(props.query, this.bayCallback.bind(this));
    }
  }

  render() {
    return (
      <ol className='search-results'>
        <SearchHeading key="heading-1" text="In the client" />
        {this.downloadListing()}
        <SearchHeading key="heading-2" text="On the bay" />
        {this.bayListing()}
      </ol>
    );
  }

  downloadListing() {
    const downloads = filterDownloads(this.props.downloads, this.props.query);
    const elems = downloads.map((d, i) => {
      return <SearchListing onClick={() => this.props.onClickDownload(d.hash)}
                            key={'dl-'+i} name={d.name} />;
    }).reverse();
    if (elems.length == 0) {
      return <SearchEmpty key="dl-empty" />;
    } else {
      return elems;
    }
  }

  bayListing() {
    if (this.state.bayResults) {
      const elems = this.state.bayResults.map((r, i) => {
        return <SearchListing onClick={() => this.props.onClickBay(r.id)}
                              key={'bay-'+i} name={r.name} />;
      });
      if (elems.length === 0) {
        return <SearchEmpty key="bay-empty" />;
      } else {
        return elems;
      }
    } else if (this.state.bayError) {
      return <SearchError key="bay-error" message={this.state.bayError} />;
    } else {
      return <SearchLoading key="bay-loading" />;
    }
  }

  bayCallback(error, results) {
    error = error && error.toString();
    this.setState({bayResults: results, bayLoading: false, bayError: error});
  }
}

function SearchHeading(props) {
  return <div className="search-heading">{props.text}</div>;
}

function SearchListing(props) {
  return <div className="search-listing" onClick={props.onClick}>{props.name}</div>;
}

function SearchEmpty() {
  return <div className="search-empty">No results</div>
}

function SearchLoading() {
  return <div className="search-loading"><Loader /></div>
}

function SearchError(props) {
  return <div className="search-error">{props.message}</div>
}

function filterDownloads(downloads, query) {
  query = query.toLowerCase();
  return downloads.filter((x) => x.name.toLowerCase().includes(query));
}

window.addEventListener('load', function() {
  ReactDOM.render(<Root />, document.getElementById('content'));
});
