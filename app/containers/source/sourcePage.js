import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Scan from './components/Scan'
import * as LibraryActions from '../library/libraryActions'
import * as SourceActions from './sourceActions'
import * as CopyActions from '../copy/copyAction'



function mapStateToProps(state) {
  return {
    library: state.library,
    source: state.source,
    copy: state.copy
  };
}

function mapDispatchToProps(dispatch) {
  return { 
    ...bindActionCreators(LibraryActions, dispatch),
    ...bindActionCreators(SourceActions, dispatch),
    ...bindActionCreators(CopyActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scan);
