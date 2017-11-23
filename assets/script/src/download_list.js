function DownloadList(props) {
  if (!props.downloads) {
    return <div id="no-downloads"><Loader /></div>;
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
        <label className="download-size">{humanSize(props.download.sizeBytes)}</label>
        <label className="download-upload">{humanSize(props.download.uploadTotal)}</label>
        {(props.download.active &&
          <label className="download-rate">
            {humanSize(props.download.downloadRate)+'/sec'}
          </label>)}
      </div>
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
