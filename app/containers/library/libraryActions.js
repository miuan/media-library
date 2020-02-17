
import * as path from 'path'

import type { GetState, Dispatch } from '../reducers/types'

import { startfind, findMissing } from '../../utils/find'
import { generateHashForUnhashed } from '../../utils/hash'
import { writeScan } from '../../utils/common'

export const UPDATE_LIBRARY = 'UPDATE_LIBRARY'
export const UPDATE_LIBRARY_UNHASHED = 'UPDATE_LIBRARY_UNHASHED'
export const SET_LIBRARY_STATUS = 'SET_LIBRARY_STATUS'
export const SET_LIBRARY_PROGRESS = 'UPDATE_MEDIA_PROGRESS'
export const SET_LIBRARY_LOCATION = 'SET_LIBRARY_LOCATION'

export const UPDATE_LIBRARY_MISSING = 'UPDATE_LIBRARY_MISSING'
export const UPDATE_LIBRARY_DUPLICATES = 'UPDATE_LIBRARY_DUPLICATES'

export const FORCE_MEDIA_RECREATE = false

export const LIBRARY_STATUS = {
    READY: 'READY',
    FIND_START: 'FIND_START',
    MISSING_START: 'MISSING_START',
    DUPLICATIONS_START: 'DUPLICATIONS_START',
    FIND_DONE: 'FIND_DONE',
    HASHING_START: 'HASHING_START',
    HASHING_DONE: 'HASHING_DONE'
}

export function updateLibrary(media) {
    return {
        type: UPDATE_LIBRARY,
        media
    };
}

export function updateLibraryUnhashed(unhashed: any) {
    return {
        type: UPDATE_LIBRARY_UNHASHED,
        unhashed
    };
}

export function setLibraryHashProgress(progress: number) {
    return {
        type: SET_LIBRARY_PROGRESS,
        progress
    };
}
  
export function setLibraryStatus(status: string) {
    return {
        type: SET_LIBRARY_STATUS,
        status
    };
}

export function setLibraryLocation(location: string, status: string = LIBRARY_STATUS.FIND_DONE) {
    return {
        type: SET_LIBRARY_LOCATION,
        location,
        status
    };
}

export function updateLibraryMissing(missing: any) {
  return {
      type: UPDATE_LIBRARY_MISSING,
      missing
  }
}

export function updateLibraryDuplicates(duplicates: any) {
  return {
      type: UPDATE_LIBRARY_DUPLICATES,
      duplicates
  }
}


export const locateLibrary = (libraryLocation: string = '/Users/milanmedlik/Documents/video/') => {
    return (dispatch: Dispatch) => new Promise(async (resolve, reject) => {
      const mediaLibraryPath = path.normalize(libraryLocation + '/');
  
      const updateMedia = (library) => setTimeout(() => dispatch(updateLibrary(library)), 1)
      const updateUnhashed = (unhashed) => setTimeout(() => dispatch(updateLibraryUnhashed(unhashed)), 1)
    
      setTimeout(() => dispatch(setLibraryStatus(LIBRARY_STATUS.FIND_START)), 1)
      const [media, unhashed, missing] = await startfind(mediaLibraryPath, updateMedia, updateUnhashed, !FORCE_MEDIA_RECREATE)
      setTimeout(() => dispatch(setLibraryStatus(LIBRARY_STATUS.MISSING_START)), 1)
      
      //const missing = {} // findMissing(mediaLibraryPath, media)
      setTimeout(() => {
        dispatch(updateLibraryMissing(missing))
        dispatch(setLibraryStatus(LIBRARY_STATUS.DUPLICATIONS_START))
      },1)

      setTimeout(() => {
          dispatch(updateLibraryMissing(missing))
          dispatch(setLibraryLocation(libraryLocation))
          dispatch(setLibraryStatus(LIBRARY_STATUS.FIND_DONE))
          resolve();
      }, 1)
      
    });
  }
  
  export const startHashing = (mediaLibraryPath, library, unhashed) => {
    return (dispatch: Dispatch) => new Promise(async (resolve, reject) => {
      if(unhashed.files && unhashed.files.length > 0){
        
        const updateUnhashedWithProgress = (updatedUnhased, progress) => setTimeout(() => dispatch(() => {
          updateLibraryUnhashed(updatedUnhased)
          setLibraryHashProgress(progress)
        }), 1)
        
        setTimeout(() => dispatch(setLibraryStatus(LIBRARY_STATUS.HASHING_START)), 1)
        await generateHashForUnhashed(mediaLibraryPath, unhashed, updateUnhashedWithProgress)

        writeScan(mediaLibraryPath, library.media)

        setTimeout(() => {
          dispatch(updateLibrary(library.media))
          dispatch(setLibraryStatus(LIBRARY_STATUS.HASHING_DONE))
          resolve();
        }, 1)
      } else {
        resolve();
      }
      
    });
  }