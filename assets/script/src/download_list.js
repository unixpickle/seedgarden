function DownloadList(props) {
  if (props.downloads.length === 0) {
    return <div id="no-downloads"><h1>No Downloads</h1></div>;
  }
  let list = props.downloads.map((dl) => {
    return <DownloadEntry download={dl}
                          key={dl.hash}
                          onClick={() => props.onClick(dl.hash)}
                          onStart={() => props.onStart(dl.hash)}
                          onStop={() => props.onStop(dl.hash)} />;
  }).reverse();
  return <ol id="downloads">{list}</ol>;
}

function DownloadEntry(props) {
  const dl = props.download;
  return (
    <li className={'download' + (props.actionPending ? ' download-frozen' : '')}>
      {(dl.active ?
        <button className="download-stop-button" onClick={props.onStop}>Stop</button> :
        <button className="download-start-button" onClick={props.onStart}>Start</button>)}
      <div className="download-description" onClick={props.onClick}>
        <label className="download-name">{dl.name}</label>
        <LoadingBar progress={dl.completedBytes / dl.sizeBytes} color={downloadLoaderColor(dl)} />
      </div>
    </li>
  );
}
