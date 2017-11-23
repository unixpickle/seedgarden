class BayInfo extends React.Component {
  constructor() {
    super();
    self.state = {
      loading: true,
      name: null,
      magnetURL: null,
      error: null
    };
    // TODO: make request here.
  }

  componentWillUnmount() {
    // TODO: cancel pending requests here.
  }

  render() {
    // TODO: show loading/error/info.
    // TODO: callback for adding magnet link.
  }
}
