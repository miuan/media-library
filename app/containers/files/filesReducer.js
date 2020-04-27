import { 
  UPDATE_SOURCE,
  UPDATE_SOURCE_UNHASHED, 
  SET_SOURCE_STATUS,
  SET_SOURCE_HASH_PROGRESS,
  SET_SOURCE_LOCATION
} from './sourceActions';
import type { Action } from './types';

export default function source (state = {media: {}, unhashed:{}, status: '', progress: 0}, action: Action) {
  switch (action.type) {
    
    case UPDATE_SOURCE:
      return {
          ...state,
          media: action.media
      }
    case UPDATE_SOURCE_UNHASHED:
      return {
          ...state,
          unhashed: action.unhashed
      }
    case SET_SOURCE_STATUS:
      return {
        ...state,
        status: action.status
    }
    case SET_SOURCE_HASH_PROGRESS: 
      return {
        ...state,
        progress: action.progress
      }
    case SET_SOURCE_LOCATION: 
      return {
        ...state,
        location: action.location,
        status: action.status
      }

      
    default:
      return state;
  }
}
