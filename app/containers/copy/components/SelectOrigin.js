// @flow
import React, { Component, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { remote } from 'electron';
import * as Store from 'electron-store'
import { COPY_ORIGINS, COPY_STATUS } from '../copyAction'


const SelectOrigin = ({
  copy,
  onSetOrigin
}) => {

  return (
    <div>
      <h3>Select category of source and copy</h3>
      <p>
        After choice source category it will start copy to selected library name ({copy.destination}) and selected category 
      </p>
        {COPY_ORIGINS.map((origin,idx) => 
          (<div key={idx}>
            &rarr; {copy.destination} &rarr; <span className="link" onClick={() => onSetOrigin(origin)}>{origin}</span>
             
          </div>)
        )}
    </div>
  );

}

export default SelectOrigin
