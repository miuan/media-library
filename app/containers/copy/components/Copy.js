// @flow
import React, { Component, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import routes from '../../../constants/routes.json';
import { remote } from 'electron';
import * as Store from 'electron-store'
import MediaLibraries from '../../source/components/MediaLibraries'
import { COPY_ORIGINS, COPY_STATUS } from '../copyAction'
import SelectOrigin from './SelectOrigin'


const dialog = remote.dialog
const store = new Store();

const Copy = ({
  copy,
  sourceLocation,
  library,
  copySetOrigin,
  copyFilesToLibrary,
  copyInsertFiles
}) => {
  
  // useEffect(()=>{
  //   if(copy.status == COPY_STATUS.COPY_DONE) {
  //     copyInsertFiles([])
  //   }
  // }, [copy.status])

  const onSetOrigin = (origin) => {
    copySetOrigin(origin)

    //console.log([libraryLocation, copy.destination, origin])
    // const destination = path.join(libraryLocation, copy.destination, origin)
    const copyData = {
      media: copy.media,
      destination: copy.destination,
      origin
    }
    
    copyFilesToLibrary (library, copyData, sourceLocation)

    console.log(copyData)

  }

  return (
    <div className="body">
      <Link to={routes.COUNTER}>&larr; back to select destination</Link>
      

      {copy.status == COPY_STATUS.COPY_READY && (<SelectOrigin copy={copy} onSetOrigin={onSetOrigin} />)}

      {(copy.status == COPY_STATUS.COPY_STARTED || copy.status == COPY_STATUS.COPY_DONE)&& (
        <div>
          <h4>{`Copying ${copy.progress}%`}</h4>
          
          <div className="progress" role="progressbar" tabIndex="0" aria-valuenow="50" aria-valuemin="0" aria-valuetext="50 percent" aria-valuemax="100">
            <div className="progress-meter" style={{'width': `${copy.progress}%`}}></div>
          </div>
        </div>
      )}


        
    {copy.status == COPY_STATUS.COPY_DONE && (
      <Link to={routes.COUNTER}>DONE</Link>
    )}
    </div>
  );

}

export default Copy
