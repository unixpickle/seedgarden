function DownloadList(props) {
  if (!props.downloads) {
    return <div id="no-downloads"><h1>No downloads</h1></div>;
  }
  let list = [];
  props.downloads.forEach((dl) => {
    list.push(<DownloadEntry download={dl}
                             key={dl.hash}
                             onClick={() => props.onClick(dl.hash)}
                             onStop={() => props.onStop(dl.hash)}
                             onStart={() => props.onStart(dl.hash)}/>);
  });
  return <ol id="downloads">{list}</ol>;
  // TODO: list of downloads.

  // TODO: flag on download indicating that an action is
  // currently pending for it.

  // TODO: callbacks for pause/resume/delete.
}

function DownloadEntry(props) {
  return (
    <li className={'download' + (props.actionPending ? ' download-frozen' : '')}
        onClick={props.onClick}>
      <label className="download-name">{props.download.name}</label>
      <div className="download-stats">
        <label className="download-size">{humanSize(props.download.sizeBytes)}</label>
        {(props.download.active &&
          <label className="download-rate">{humanSize(props.download.sizeBytes)+'/sec'}</label>)}
        <label className="download-upload">{humanSize(props.download.uploadTotal)}</label>
      </div>
      {(props.download.active ?
        <button className="download-stop-button"
                onClick={(e) => {e.stopPropagation(); props.onStop()}}>Stop</button> :
        <button className="download-start-button"
                onClick={(e) => {e.stopPropagation(); props.onStart()}}>Start</button>)}
    </li>
  );
}

function humanSize(bytes) {
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
