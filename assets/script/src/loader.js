function Loader(props) {
  return <div className="loader">Loading</div>;
}

function LoaderPane(props) {
  return <div className="loader-pane"><Loader /></div>;
}

function LoadingBar(props) {
  const style = {
    width: (props.progress*100).toFixed(3) + '%',
    backgroundColor: props.color
  };
  return (
    <div className="loading-bar">
      <div className="loading-bar-filler" style={style}></div>
    </div>
  );
}

function downloadLoaderColor(dl) {
  if (dl.completedBytes < dl.sizeBytes) {
    if (dl.active) {
      return '#65bcd4';
    } else {
      return '#feb4b1';
    }
  }
  return '#a7e48b';
}
