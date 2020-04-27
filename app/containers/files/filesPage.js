import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Files from './components/Files'



function mapStateToProps(state) {
  return {
    library: state.library,
    source: state.source,
    copy: state.copy
  };
}

function mapDispatchToProps(dispatch) {
  return { 
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Files);
