import React, { Component, useState, useEffect, useCallback } from 'react';
import { remote } from 'electron';
import * as Store from 'electron-store'
import styles from './Home.css'

const dialog = remote.dialog
const store = new Store();


export const LibraryPanel = ({
    library,
    mediaLibraryLocation,
    setMediaLibraryLocation,
    locateLibrary,
    startHashing
}) => {

    const [stats, setStats] = useState({size: 0, unhashedCount: 0, totalCount: 0, unhashedPercent: 0})
    

    useEffect(() => {
        let size = 0
        
        if(library.media.totalSize > 1000000000) {
            size = `${Math.round(library.media.totalSize/10000000)/ 100}Gb`
        } else if(library.media.totalSize > 1000000) {
            size = `${Math.round(library.media.totalSize/10000)/ 100}Mb`
        } else {
            size = `${Math.round(library.media.totalSize/10)/ 100}Kb`
        }
        
        const unhashedCount = library.unhashed && library.unhashed.files ? library.unhashed.files.length : 0
        const totalCount = library.media && library.media.totalFiles ? library.media.totalFiles : 0
        const unhashedPercent = `${100 - Math.round(unhashedCount/totalCount * 100)}%`

        console.log('setStats', stats)
        setStats({size, unhashedCount, totalCount, unhashedPercent})


        document.title = `${mediaLibraryLocation} size: ${size} Hashed: ${unhashedPercent}`

    }, [library])

    const opendialog = useCallback(() => {
        console.log('mediaLibraryLocation', mediaLibraryLocation)
        const mediaDir = dialog.showOpenDialogSync({defaultPath: (mediaLibraryLocation ? mediaLibraryLocation : '~/Documents') , properties: ['openDirectory'] })
        console.log(mediaDir)
        locateLibrary(mediaDir);
        setMediaLibraryLocation(mediaDir)
        store.set('medialLibraryPath', mediaDir)
        
    }, [mediaLibraryLocation])

    const onStartHashing = () => {
        startHashing(mediaLibraryLocation + '/', library, library.unhashed)
    }

    return (
    <div>
        <h2>Select library location</h2>
        <form className="input-group">
        <input type="text" value={mediaLibraryLocation} readOnly={true} onClick={opendialog}/>
        <button 
            onClick={opendialog}
            className="button">
            Locate
        </button>
        </form>
        <div className={styles.infoPanel}>

        <table width="100%">
            <tbody>
                <tr>
                    <td>Total size</td>
                    <td>Total files</td>
                    <td>Hashed</td>
                    <td rowSpan="2">
                        <button 
                            onClick={onStartHashing}
                            className={`alert button ` + (stats.unhashedCount < 1? 'disabled' : '')}>
                            Generate hash for {stats.unhashedCount} files
                        </button>
                    </td>
                </tr>

                <tr>
                
                    <td>{stats.size}</td>
                    <td>{stats.totalCount}</td>
                    <td>
                        {`${stats.unhashedPercent} `}
                    </td>
                </tr> 
            </tbody>
        </table>
 
        <div>
        
        </div>
        </div>
    </div>
    )
}

export default LibraryPanel