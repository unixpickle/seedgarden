class DownloadInfo extends React.Component {
  constructor() {
    super();
    this.state = { filesLoading: true, filesError: null, files: null };
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
        <table className="download-info-table">
          <tbody>
            <tr>
              <td>
                <label>Size:</label>
                <label>{formatSize(dl.sizeBytes)}</label>
              </td>
              <td>
                <label>% Complete:</label>
                <label>{(100 * dl.completedBytes / dl.sizeBytes).toFixed(2) + '%'}</label>
              </td>
            </tr>
            <tr>
              <td>
                <label>Downloaded:</label>
                <label>{formatSize(dl.completedBytes)}</label>
              </td>
              <td>
                <label>Rate:</label>
                <label>{formatRate(dl.downloadRate)}</label>
              </td>
            </tr>
            <tr>
              <td>
                <label>Uploaded:</label>
                <label>{formatSize(dl.uploadTotal)}</label>
              </td>
              <td>
                <label>Rate:</label>
                <label>{formatRate(dl.uploadRate)}</label>
              </td>
            </tr>
          </tbody>
        </table>
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
          <label className="heading">
            Files
            <a href={'/api/downloadall?hash=' + this.props.download.hash}> (get all)</a>
          </label>
          {this.state.files.map((x) => <a className="file-link" key={x.link} href={x.link}>{x.path}</a>)}
        </div>
      );
    } else if (this.state.filesError) {
      return <div className="download-files-error">{this.state.filesError + ''}</div>
    } else {
      return <div className="download-files-loading"><Loader /></div>;
    }
  }

  filesCallback(error, files) {
    this.setState({ filesLoading: false, filesError: error, files: files });
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
