// @flow
import React, { Component, useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styles from './Scan.css';
import routes from '../../../constants/routes.json'
import { remote } from 'electron';
import * as Store from 'electron-store'
import MediaLibraries from './MediaLibraries'
import LibraryPanel from '../../library/components/panel'
import { SOURCE_STATUS } from '../sourceActions';
import Info from './Info'

const dialog = remote.dialog
const store = new Store();

const Scan = ({
  locateLibrary, 
  startHashing,
  locateSource,
  library, 
  source,
  copy,
  copySetDestination
}) => {
  
  const [sourceLocation, setSourceLocation] = useState(source.location || '')
  const history = useHistory()


  useEffect(()=>{
    if(!library || !library.location) {
      history.push(routes.HOME)
    }
  }, [library])

  const onLocateSource = () => {
    const sourceDir = dialog.showOpenDialogSync({ properties: ['openDirectory'] })

    if(sourceDir) {
      const sourceLocation = sourceDir && sourceDir.length > 0 ? sourceDir[0] : sourceDir
      locateSource(sourceLocation, library.media)
      setSourceLocation(sourceLocation)
    }
  }

  const onLibrarySelect = (name) => {

    console.log(name)
    copySetDestination(name)
    history.push(routes.COPY)
  }

  const sourceFilesCount = useMemo(() => (source.media? source.media.totalFiles : 0), [source.media])
  const copyFilesSize = useMemo(()=> (copy.media ? copy.media.totalSize : 0), [copy.media])

  return (
    <div className="body">
      <Link to={routes.HOME}>&larr; back to select library location</Link>
      <h2>Select location of source</h2>
      <form className="input-group">
        <input type="text" value={sourceLocation} readOnly={true} onClick={onLocateSource}/>
        <button 
          onClick={onLocateSource}
          className="button">
            Source
        </button>
      </form>

      <div>
        
      </div>
      {(source.status == SOURCE_STATUS.FIND_DONE) && (
        <div>
          <div>{`Files in source: ${sourceFilesCount}`}</div>
        </div>
      )}

      {source.status == SOURCE_STATUS.HASHING_START && (
        <div>
          <h4>{`Analyzing ${source.progress}%`}</h4>
          
          <div className="progress" role="progressbar" tabIndex="0" aria-valuenow="50" aria-valuemin="0" aria-valuetext="50 percent" aria-valuemax="100">
            <div className="progress-meter" style={{'width': `${source.progress}%`}}></div>
          </div>
        </div>
      )}

      {source.status == SOURCE_STATUS.HASHING_DONE && sourceLocation && (
        <div>
          <Info source={source} copy={copy} />
          {copy.media.totalFiles > -1 ?  (<MediaLibraries onSelect={onLibrarySelect}/>) : (<div> nothing to copy </div>) }         
        </div>
      )}
      
    </div>
  );

}

export default Scan
