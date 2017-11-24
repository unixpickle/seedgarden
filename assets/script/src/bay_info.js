class BayInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      info: null
    };
    this._lookup = new BayLookup(props.id, this.bayCallback.bind(this));
  }

  addTorrent() {
    // TODO: add magnet link, have some kind of loading
    // indicator, etc.
  }

  componentWillUnmount() {
    this._lookup.cancel();
  }

  render() {
    if (this.state.loading) {
      return <LoaderPane />;
    } else if (this.state.error) {
      return <div className="error-pane">{this.state.error}</div>;
    } else {
      return (
        <div className="bay-info">
          <label className="bay-info-name">{this.state.info.name}</label>
          <label className="bay-info-seeders">{this.state.info.seeds}</label>
          <label className="bay-info-leachers">{this.state.info.leachers}</label>
          <button className="bay-info-add-button"
                  onClick={() => this.addTorrent()}>Add Torrent</button>
        </div>
      );
    }
  }

  bayCallback(error, info) {
    this.setState({loading: false, error: error, info: info});
  }
}
