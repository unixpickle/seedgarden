class TopBar extends React.Component {
  constructor() {
    super();
    this.state = {searchFocused: false};
  }

  render() {
    return (
      <div className={'top-bar' + (this.search ? ' topbar-searching' : '')}>
        {(this.props.canExit &&
          <button className='exit-button' onClick={this.props.onExit}>Go Home</button>)}
        <button className='add-button' onClick={this.props.onAdd}>Add Magnet URL</button>
        <input className='search-box'
               onFocus={() => this.setState({searchFocused: true})}
               onBlur={() => this.setState({searchFocused: false})}
               onChange={(e) => this.props.onSearchChange(e.target.value)}
               value={this.props.search || ''}
               placeholder="Search" />
      </div>
    );
  }
}
