import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Copy from './components/Copy';
import * as CopyActions from './copyAction';


const mapStateToProps = (state) => ({
  copy: state.copy,
  library: state.library,
  sourceLocation: state.source.location
})

const mapDispatchToProps = (dispatch) => ({ 
    ...bindActionCreators(CopyActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Copy);
