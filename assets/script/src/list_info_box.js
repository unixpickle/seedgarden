function ListInfoBox(props) {
  const fields = [];
  props.keys.forEach((key, i) => {
    fields.push(
      <div className="list-item-info-field" key={i}>
        <label>{key}:</label>
        <label>{props.values[i]}</label>
      </div>
    );
  });
  return <div className="list-item-info-box">{fields}</div>;
}
