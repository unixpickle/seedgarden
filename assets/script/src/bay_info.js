class BayInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      info: null
    };
    this._lookup = null;
  }

  componentWillMount() {
    this._lookup = new BayLookup(this.props.id, this.bayCallback.bind(this));
  }

  componentWillUnmount() {
    this._lookup.cancel();
  }

  render() {
    if (this.state.loading) {
      return <LoaderPane />;
    } else if (this.state.error) {
      return <div className="error-pane">{this.state.error + ''}</div>;
    } else {
      return (
        <div className="bay-info">
          <label className="bay-info-name">{this.state.info.name}</label>
          <label className="bay-info-seeders">{this.state.info.seeders}</label>
          <label className="bay-info-leechers">{this.state.info.leechers}</label>
          <button className="bay-info-add-button"
                  onClick={() => this.props.onAdd(this.state.info.magnetURL)}>Add Torrent</button>
        </div>
      );
    }
  }

  bayCallback(error, info) {
    this.setState({loading: false, error: error, info: info});
  }
}
