// @flow
import React, { Component, useState, useEffect, useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import routes from '../../../constants/routes.json'
import styles from './Home.css';
import LibraryPanel from './panel'
import * as Store from 'electron-store'
import { LIBRARY_STATUS } from '../libraryActions'

const store = new Store();

export const Home = ({
  library,
  locateLibrary,
  startHashing
}) => {

  const [mediaLibraryLocation, setMediaLibraryLocation] = useState('')
  const history = useHistory()

  useEffect(()=>{
    if(!mediaLibraryLocation) {
      let mediaLibraryPath = store.get('medialLibraryPath');
      if(mediaLibraryPath){
        if(mediaLibraryPath.length > 0){
          mediaLibraryPath = mediaLibraryPath[0]
        }

        setMediaLibraryLocation(mediaLibraryPath)
        locateLibrary(mediaLibraryPath)
      }
    }

  }, [mediaLibraryLocation, library])

  const enabledSelectSource = useMemo(()=>{
    return (library.status === LIBRARY_STATUS.HASHING_DONE || library.status === LIBRARY_STATUS.FIND_DONE )
              && (library.unhashed && library.unhashed.files && library.unhashed.files.length < 1)
  }, [library.status, library.unhashed])

  const onSelectSource = () => {
    if(enabledSelectSource){
      history.push(routes.COUNTER)
    }
    
  }

  return (<div className={styles.body}>
    <div  >
      <LibraryPanel  {...{
          library,
          mediaLibraryLocation,
          setMediaLibraryLocation,
          locateLibrary,
          startHashing
        }}/>
      </div>
      <div>

      <button className={'button primary ' + (enabledSelectSource ? '' : 'disabled')} onClick={onSelectSource} >
          Select Source
      </button>
      </div>
    </div>
  )
}

export default Home
