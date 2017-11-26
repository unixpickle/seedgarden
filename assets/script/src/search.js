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
    const downloads = filterDownloads(this.props.downloads, this.props.query);
    let downloadElems = downloads.map((d, i) => {
      return <SearchListing onClick={() => this.props.onClickDownload(d.hash)}
                            key={'dl-'+i} name={d.name} />;
    }).reverse();
    if (downloadElems.length == 0) {
      downloadElems = <SearchEmpty key="dl-empty" />;
    }
    let bayElems = <SearchLoading key="bay-loading" />;
    if (this.state.bayResults) {
      bayElems = this.state.bayResults.map((r, i) => {
        return <SearchListing onClick={() => this.props.onClickBay(r.id)}
                              key={'bay-'+i} name={r.name} />;
      });
      if (bayElems.length === 0) {
        bayElems = <SearchEmpty key="bay-empty" />;
      }
    } else if (this.state.bayError) {
      bayElems = <SearchError key="bay-error" message={this.state.bayError} />;
    }
    return (
      <ol className='search-results'>
        <SearchHeading key="heading-1" text="In the client" />
        {downloadElems}
        <SearchHeading key="heading-2" text="On the bay" />
        {bayElems}
      </ol>
    );
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
