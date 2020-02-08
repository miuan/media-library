// @flow
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import type { HashHistory } from 'history'

import library from '../containers/library/libraryReducer'
import source from '../containers/source/sourceReducer'
import copy from '../containers/copy/copyReducer'

export default function createRootReducer(history: HashHistory) {
  return combineReducers<{}, *>({
    router: connectRouter(history),
    library,
    source,
    copy
  });
}
