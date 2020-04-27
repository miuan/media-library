// @flow
import type { GetState, Dispatch } from '../reducers/types';
import * as fs from 'fs'
import * as path from 'path'

import { startfind } from '../../utils/find'
import { generateHashForUnhashed } from '../../utils/hash'
import { libraryVsSource } from '../../utils/copy'
import { writeScan } from '../../utils/common'
import { copyInsertFiles } from '../copy/copyAction'

export const SCAN_FILE = 'SCAN_FILE';

export const UPDATE_SOURCE = 'UPDATE_SOURCE'
export const UPDATE_SOURCE_UNHASHED = 'UPDATE_SOURCE_UNHASHED'
export const SET_SOURCE_STATUS = 'SET_SOURCE_STATUS'
export const SET_SOURCE_HASH_PROGRESS = 'SET_SOURCE_HASH_PROGRESS'
export const SET_SOURCE_LOCATION = 'SET_SOURCE_LOCATION'

export const SOURCE_STATUS = {
  READY: 'READY',
  FIND_START: 'FIND_START',
  FIND_DONE: 'FIND_DONE',
  HASHING_START: 'HASHING_START',
  HASHING_DONE: 'HASHING_DONE'
}

export function updateSource(media) {
  return {
    type: UPDATE_SOURCE,
    media
  };
}

export function updateSourceUnhashed(unhashed: any) {
  return {
    type: UPDATE_SOURCE_UNHASHED,
    unhashed
  };
}

export function setSourceHashProgress(progress: number) {
  return {
    type: SET_SOURCE_HASH_PROGRESS,
    progress
  };
}

export function setSourceStatus(status: number) {
  return {
    type: SET_SOURCE_STATUS,
    status
  };
}

export function setSourceLocation(location: string, status: string = SOURCE_STATUS.FIND_DONE) {
  return {
      type: SET_SOURCE_LOCATION,
      location,
      status
  };
}

export const locateSource = (sourceDir, libraryMedia) => {
  return (dispatch: Dispatch) => new Promise(async (resolve, reject) => {
    const sourcePath = path.normalize(sourceDir + '/');

    const updateLibrary = (library) => setTimeout(() => dispatch(updateSource(library)), 1)
    const updateUnhashed = (unhashed) => setTimeout(() => dispatch(updateSourceUnhashed(unhashed)), 1)

    setTimeout(() => dispatch(setSourceStatus(SOURCE_STATUS.FIND_START)), 1)
    const [source, unhashed] = await startfind(sourcePath, updateLibrary, updateUnhashed, false);
    setTimeout(() => dispatch(setSourceStatus(SOURCE_STATUS.FIND_DONE)), 1)

    if(unhashed.files && unhashed.files.length > 0){
      const updateUnhashedWithProgress = (updatedUnhased, progress) => setTimeout(() => {
        dispatch(updateSourceUnhashed(updatedUnhased))
        dispatch(setSourceHashProgress(progress))
      }, 1)

      setTimeout(() => dispatch(setSourceStatus(SOURCE_STATUS.HASHING_START)), 1)
      await generateHashForUnhashed(sourcePath, unhashed, updateUnhashedWithProgress )
      setTimeout(() => dispatch(() => updateSource(source)), 1)
    }

    const filesForCopy = libraryVsSource(libraryMedia, source)
    
    setTimeout(() => {
      dispatch(copyInsertFiles(filesForCopy))
      dispatch(setSourceLocation(sourceDir, SOURCE_STATUS.HASHING_DONE))
    }, 1)
    resolve();
  });
}








