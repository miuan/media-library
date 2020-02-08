import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Home from './components/Home'
import * as LibraryActions from './libraryActions'



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

export default connect(mapStateToProps, mapDispatchToProps)(Home);