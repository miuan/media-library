import { 
  COPY_INSERT_FILES,
  COPY_PROGRESS,
  COPY_SET_DESTINATION,
  COPY_SET_ORIGIN,
  COPY_SET_STATUS,
  COPY_STATUS,
} from './copyAction';
import type { Action } from './types';

export default function source (state = {media: {}, progress: 0, dest: ''}, action: Action) {
  switch (action.type) {
    case COPY_INSERT_FILES:
      return {
          ...state,
          media: action.media,
          status: COPY_STATUS.COPY_READY
      }
    case COPY_PROGRESS:
      return {
        ...state,
        progress: action.progress
    }
    case COPY_SET_DESTINATION:
      return {
        ...state,
        destination: action.destination
    }
    case COPY_SET_ORIGIN:
      return {
        ...state,
        origin: action.origin
    }
    case COPY_SET_STATUS:
      return {
        ...state,
        status: action.status
    }
    default:
      return state;
  }
}
