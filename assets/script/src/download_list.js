function DownloadList(props) {
  if (!props.downloads) {
    return <div id="no-downloads"></div>;
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
    <li class={'download' + (props.actionPending ? ' download-frozen' : '')}
        onClick={props.onClick}>
      <label class="download-name">{props.download.name}</label>
      <div class="download-stats">
        <label class="download-size">{humanSize(props.download.sizeBytes)}</label>
        {(props.download.active &&
          <label class="download-rate">{humanSize(props.download.sizeBytes)+'/sec'}</label>)}
        <label class="download-upload">{humanSize(props.download.uploadTotal)}</label>
      </div>
      {(props.download.active ?
        <button class="download-stop-button"
                onClick={(e) => {e.stopPropagation(); props.onStop()}}>Stop</button> :
        <button class="download-start-button"
                onClick={(e) => {e.stopPropagation(); props.onStart()}}>Start</button>)}
    </li>
  );
}

function humanSize(bytes) {
  const suffixes = [' KB', ' MB', ' GB', ' TB'];
  suffixes.forEach((suffix, idx) => {
    const size = bytes / Math.pow(10, 3*idx + 3);
    if (size < 10) {
      return size.toFixed(2) + suffix;
    } else if (size < 100) {
      return size.toFixed(1) + suffix;
    } else {
      return Math.round(size) + suffix;
    }
  });
  return bytes + ' bytes';
}
