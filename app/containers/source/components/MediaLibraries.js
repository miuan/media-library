// @flow
import React, { Component, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './MediaLibraries.css';
import routes from '../../../constants/routes.json';
import { remote } from 'electron';
import * as Store from 'electron-store'
import Modal from 'react-foundation-modal'

const STORE_MEDIA_LIBRARIES = 'STORE_MEDIA_LIBRARIES'
const dialog = remote.dialog
const store = new Store();


const overlayStyle = {
  'backgroundColor': 'rgba(33,10,10,.45)',
  'color': 'black'
  };

// store.set(STORE_MEDIA_LIBRARIES, [])

const MediaLibraries = ({onSelect}) => {
  const [libraries, setLibraries] = useState(store.get(STORE_MEDIA_LIBRARIES, []))
  const [customLibrary, setCustomLibrary] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [nameOfNew, setNameOfNew] = useState('')

  const doSelect = (lib) => () => {

    let libs = []

    libraries.forEach(l => {
      if(l.name == lib.name){
        l.lastUse = (new Date()).getUTCSeconds()
      }

      libs.push(l)
    })
    
    setLibraries(libs)
    store.set(STORE_MEDIA_LIBRARIES, libs)
    onSelect(lib.name)
  }

  const doCreate = () => {
    
    const newone = {name: nameOfNew, lastUse: (new Date()).getUTCSeconds()}
    libraries.push(newone)
    setLibraries(libraries)
    store.set(STORE_MEDIA_LIBRARIES, libraries)

    showPopupForNew(false)
    setNameOfNew('')
    onSelect(newone.name)
  }

  const showPopupForNew = (isOpen = true) => {
    setModalIsOpen(isOpen)
  }
  
  const handleNewNameChange = (event) => {
    setNameOfNew(event.target.value);
  }

  return (
    <div>
      <h4>Copy to library <span className="link" onClick={showPopupForNew}>[new]</span></h4>
      {libraries.sort((lib1, lib2)=>lib1.lastUse < lib2.lastUse ? 1 : -1).map((lib, idx) => (
        <div key={idx} >
          <div className="link" onClick={doSelect(lib)}>&rarr; {lib.name}</div>
        </div>
      ))}
      <div>
        
      </div>
      
    <Modal 
          open={modalIsOpen}
          closeModal={showPopupForNew}
          isModal={true}
          size="large"
          overlayStyle={overlayStyle} >
            <button className="close-button" data-close aria-label="Close reveal" type="button"></button>
          <h3>Tape name of new library</h3>
          <form className="input-group">
            <input type="text" value={nameOfNew} onChange={handleNewNameChange}/>
            <input type="submit" className="button" value="Create" placeholder="weddings/jane+kenny" onClick={() => doCreate()}></input>
          </form>
          <div>
            Idealy choice name of your library base on type event like wedding, blog or travel (etc.) and separe with slash to particular situation like "wedding/Jane+Mick" or "travels/australia"
          </div>
          
          
      </Modal>  
    </div>


  );

}

export default MediaLibraries
