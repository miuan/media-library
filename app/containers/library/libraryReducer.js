import { 
  UPDATE_LIBRARY, 
  UPDATE_LIBRARY_UNHASHED, 
  SET_LIBRARY_STATUS,
  SET_LIBRARY_LOCATION
} from './libraryActions';
import type { Action } from './types';

export default function media (state = {media: {}, unhashed:{}, location: ''}, action: Action) {
  switch (action.type) {
    case UPDATE_LIBRARY:
      return {
          ...state,
          media: action.media
      }
    case UPDATE_LIBRARY_UNHASHED:
      return {
          ...state,
          unhashed: action.unhashed
      }
    case SET_LIBRARY_STATUS:
      return {
        ...state,
        status: action.status
    }
    case SET_LIBRARY_LOCATION:
      return {
        ...state,
        location: action.location,
        status: action.status
    }
    default:
      return state;
  }
}
