class DownloadInfo extends React.Component {
  constructor() {
    super();
    this.state = {filesLoading: true, filesError: null, files: null};
    this.fileReq = null;
  }

  componentWillMount() {
    this.fileReq = new ListFiles(this.props.download.hash, this.filesCallback.bind(this));
  }

  componentWillUnmount() {
    this.fileReq.cancel();
  }

  render() {
    const dl = this.props.download;
    return (
      <div className="download-info">
        <table className="download-info-table">
          <tbody>
            <tr><td>Name</td><td>{dl.name}</td></tr>
            <tr><td>Progress</td><td>{(100*dl.completedBytes/dl.sizeBytes).toFixed(2) + '%'}</td></tr>
            <tr><td>Size</td><td>{formatSize(dl.sizeBytes)}</td></tr>
            <tr><td>Completed</td><td>{formatSize(dl.completedBytes)}</td></tr>
            <tr><td>DL Rate</td><td>{formatRate(dl.downloadRate)}</td></tr>
            <tr><td>UL Rate</td><td>{formatRate(dl.uploadRate)}</td></tr>
            <tr><td>Uploaded</td><td>{formatSize(dl.uploadTotal)}</td></tr>
          </tbody>
        </table>
        <div className={'download-actions' + (dl.actionPending ? ' download-frozen' : '')}>
          {(dl.active ?
            <button className="download-action-button" onClick={this.props.onStop}>Stop</button> :
            <button className="download-action-button" onClick={this.props.onStart}>Start</button>)}
          <button className="download-delete-button" onClick={this.props.onDelete}>Delete</button>
        </div>
        {this.filesElement()}
      </div>
    );
  }

  filesElement() {
    if (this.state.files) {
      return (
        <div className="download-files">
          <label className="heading">Files</label>
          {this.state.files.map((x) => <a key={x.link} href={x.link}>{x.path}</a>)}
        </div>
      );
    } else if (this.state.filesError) {
      return <div className="download-files-error">{this.state.filesError + ''}</div>
    } else {
      return <div className="download-files-loading"><Loader /></div>;
    }
  }

  filesCallback(error, files) {
    this.setState({filesLoading: false, filesError: error, files: files});
  }
}

function formatSize(bytes) {
  const suffixes = [' KB', ' MB', ' GB', ' TB'];
  for (let i = 0; i < suffixes.length; ++i) {
    const suffix = suffixes[i];
    const size = bytes / Math.pow(10, 3 * (i + 1));
    if (size < 10) {
      return size.toFixed(2) + suffix;
    } else if (size < 100) {
      return size.toFixed(1) + suffix;
    } else if (size < 1000) {
      return Math.round(size) + suffix;
    }
  }
  return bytes + ' bytes';
}

function formatRate(rate) {
  return formatSize(rate) + '/sec';
}
