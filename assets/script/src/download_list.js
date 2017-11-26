function DownloadList(props) {
  if (props.downloads.length === 0) {
    return <div id="no-downloads"><h1>No Downloads</h1></div>;
  }
  let list = props.downloads.map((dl) => {
    return <DownloadEntry download={dl}
                          key={dl.hash}
                          onClick={() => props.onClick(dl.hash)} />;
  }).reverse();
  return <ol id="downloads">{list}</ol>;
}

function DownloadEntry(props) {
  const dl = props.download;
  return (
    <li className={'download' + (props.actionPending ? ' download-frozen' : '')}
        onClick={props.onClick}>
      <label className="download-name">{dl.name}</label>
      <LoadingBar progress={dl.completedBytes / dl.sizeBytes} color={downloadLoaderColor(dl)} />
    </li>
  );
}
