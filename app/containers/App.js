// @flow
import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as LibraryActions from '../containers/library/libraryActions'

type Props = {
  children: React.Node
}


function mapStateToProps(state) {
  return {
    library: state.library,
  };
}

function mapDispatchToProps(dispatch) {
  return { 
    ...bindActionCreators(LibraryActions, dispatch),
  }
}

export const App = ({ library, setLibraryLocation, children }) => {
  useEffect(()=>{

  })
  
  return <>{children}</>;
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
