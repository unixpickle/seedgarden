class TopBar extends React.Component {
  constructor() {
    super();
    this.state = {searchFocused: false};
  }

  render() {
    return (
      <div className={'topbar' + (this.search ? ' topbar-searching' : '')}>
        <button className='add-button' onClick={this.props.onAdd}>Add Magnet URL</button>
        <input className='search-box'
               onFocus={() => this.setState({searchFocused: true})}
               onBlur={() => this.setState({searchFocused: false})}
               onChange={(e) => this.props.onSearchChange(e.target.value)}
               value={this.props.search || ''} />
        {(this.props.search &&
           <button className='clear-button' onClick={() => this.props.onSearchChange('')}>
             Clear Search
           </button>)}
      </div>
    );
  }
}
