// @flow
import type { GetState, Dispatch } from '../reducers/types';
import { copyFiles } from '../../utils/copy'
import { updateLibrary } from '../library/libraryActions'

export const COPY_INSERT_FILES = 'COPY_INSERT_FILES'
export const COPY_PROGRESS = 'COPY_PROGRESS'
export const COPY_SET_DESTINATION = 'COPY_SET_DESTINATION'
export const COPY_SET_ORIGIN = 'COPY_SET_ORIGIN'
export const COPY_SET_STATUS = 'COPY_SET_STATUS'

export const COPY_ORIGINS = [
  'primary',
  'secondary',
  'dron',
  'action',
  'phone'
]

export const COPY_STATUS = {
  COPY_READY : 'COPY_READY',
  COPY_STARTED: 'COPY_STARTED',
  COPY_DONE: 'COPY_DONE',
  COPY_UPDATING_LIBRARY: 'COPY_UPDATING_LIBRARY',
}

export function copyInsertFiles(media: any) {
  return {
    type: COPY_INSERT_FILES,
    media
  };
}

export function copyUpdateProgress(progress: number) {
  return {
    type: COPY_PROGRESS,
    progress
  };
}

export function copySetDestination(destination: string) {
  return {
    type: COPY_SET_DESTINATION,
    destination
  };
}

export function copySetOrigin(origin: string) {
  return {
    type: COPY_SET_ORIGIN,
    origin
  };
}

export function copySetStatus(status: string) {
  return {
    type: COPY_SET_STATUS,
    status
  };
}

export const copyFilesToLibrary = (library, copyData, sourceLocation) => {
  return (dispatch: Dispatch) => new Promise(async (resolve, reject) => {
    const progress = (progress) => setTimeout(() => dispatch(copyUpdateProgress(progress)), 1)
    const updateLibrary2 = (library) => setTimeout(() => dispatch(updateLibrary(library)), 1)

    setTimeout(() => dispatch(copySetStatus(COPY_STATUS.COPY_STARTED)), 1)
    await copyFiles(library, copyData, sourceLocation, { progress, updateLibrary: updateLibrary2 })
    setTimeout(() => dispatch(copySetStatus(COPY_STATUS.COPY_DONE)), 1)
    resolve();
  });
}
