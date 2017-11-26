class BackState {
  constructor(stateKeys) {
    this.stateKeys = stateKeys;

    // Back button to homepage (from hash) shouldn't
    // refresh the page.
    if (location.hash == '') {
      history.replaceState({}, window.title, this._stateToHash({}));
    }

    this.onChange = (state) => false;
    window.addEventListener('popstate', () => {
      this.onChange(this.currentState());
    });
  }

  currentState() {
    const result = this._emptyState();
    if (location.hash.length < 2) {
      return result;
    }
    try {
      Object.assign(result, JSON.parse(decodeURIComponent(location.hash.substr(1))));
    } catch (e) {
    }
    return result;
  }

  pushState(state) {
    history.pushState({}, window.title, this._stateToHash(state));
  }

  replaceState(state) {
    history.pushState({}, window.title, this._stateToHash(state));
  }

  _emptyState() {
    const result = {};
    this.stateKeys.forEach((k) => result[k] = null);
    return result;
  }

  _stateToHash(state) {
    var smallState = {};
    this.stateKeys.forEach((k) => (state[k] && (smallState[k] = state[k])));
    if (!Object.keys(smallState).length) {
      return '#';
    }
    return '#' + encodeURIComponent(JSON.stringify(smallState));
  }
}
