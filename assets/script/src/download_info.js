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
    const extraButtonClass = (dl.actionPending ? ' download-info-pending' : '');
    // TODO: show progress bar.
    return (
      <div className="download-info">
        <div className="download-info-heading">
          {(dl.active ?
            <button className={'download-stop-button' + extraButtonClass}
                    onClick={this.props.onStop}>Stop</button> :
            <button className={'download-start-button' + extraButtonClass}
                    onClick={this.props.onStart}>Start</button>)}
          <label className="download-info-name">{dl.name}</label>
        </div>
        {(dl.active ?
          <LoadingBar progress={dl.completedBytes / dl.sizeBytes}
                      color={downloadLoaderColor(dl)} /> :
          null)}
        <div className="download-info-row">
          <div className="download-info-data">
            <label>Size:</label>
            <label>{formatSize(dl.sizeBytes)}</label>
          </div>
          <div className="download-info-data">
            <label>% Complete:</label>
            <label>{(100*dl.completedBytes/dl.sizeBytes).toFixed(2) + '%'}</label>
          </div>
        </div>
        <div className="download-info-row">
          <div className="download-info-data">
            <label>Downloaded:</label>
            <label>{formatSize(dl.completedBytes)}</label>
          </div>
          <div className="download-info-data">
            <label>Rate:</label>
            <label>{formatRate(dl.downloadRate)}</label>
          </div>
        </div>
        <div className="download-info-row">
          <div className="download-info-data">
            <label>Uploaded:</label>
            <label>{formatSize(dl.uploadTotal)}</label>
          </div>
          <div className="download-info-data">
            <label>Rate:</label>
            <label>{formatRate(dl.uploadRate)}</label>
          </div>
        </div>
        <div className="download-info-delete-container">
          <button className={'download-delete-button' + extraButtonClass}
                  onClick={this.props.onDelete}>Delete</button>
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
