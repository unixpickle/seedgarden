function DownloadList(props) {
  if (props.downloads.length === 0) {
    return <div id="no-downloads"><h1>No Downloads</h1></div>;
  }
  let list = [];
  props.downloads.forEach((dl) => {
    list.push(<DownloadEntry download={dl}
                             key={dl.hash}
                             onClick={() => props.onClick(dl.hash)} />);
  });
  return <ol id="downloads">{list}</ol>;
}

function DownloadEntry(props) {
  return (
    <li className={'download' + (props.actionPending ? ' download-frozen' : '')}
        onClick={props.onClick}>
      <div className={'download-state-' + (props.download.active ? 'active' : 'inactive')} />
      <label className="download-name">{props.download.name}</label>
      <div className="download-stats">
        <label className="download-size">{formatSize(props.download.sizeBytes)}</label>
        <label className="download-upload">{formatSize(props.download.uploadTotal)}</label>
        {(props.download.active &&
          <label className="download-rate">
            {formatRate(props.download.downloadRate)}
          </label>)}
      </div>
    </li>
  );
}
