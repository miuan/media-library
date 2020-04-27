// @flow
import React, { Component, useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import routes from '../../../constants/routes.json'
import { remote } from 'electron';
import * as Store from 'electron-store'
import FileInfo from './FileInfo'
import * as path from 'path'

const dialog = remote.dialog
const store = new Store();

const SORT_SIZE_HIGHT = 'SORT_SIZE_HIGHT'
const SORT_SIZE_LOW = 'SORT_SIZE_LOW'
const SORT_NAME_HIGHT = 'SORT_NAME_HIGHT'
const SORT_NAME_LOW = 'SORT_NAME_LOW'
const SORT_PATH_HIGHT = 'SORT_PATH_HIGHT'
const SORT_PATH_LOW = 'SORT_PATH_LOW'


const textSort = (a, b) => {
  let nameA = a.toUpperCase(); // ignore upper and lowercase
  let nameB = b.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}

const addBaseName = (input) => {
  return input.map((f) => ({
    basename: path.basename(f.filePath),
    ...f
  }))
}

const Files = ({
  library, 
  source,
  copy,
  match
}) => {
  console.log('Match', match)

  const [sort, setSort] = useState(SORT_NAME_HIGHT)

  const sortFiles = (type, input) => {
    let tos = input ? input : list
  
    if(type == SORT_NAME_HIGHT) {
      tos.sort((f1, f2) => textSort(f1.basename, f2.basename))
    } else if(type == SORT_NAME_LOW) {
      tos.sort((f1, f2) => textSort(f2.basename, f1.basename))
    } else if(type == SORT_SIZE_HIGHT) {
      tos.sort((f1, f2) => (f1.size - f2.size))
    } else if(type == SORT_SIZE_LOW) {
      tos.sort((f1, f2) => (f2.size - f1.size))
    } else if(type == SORT_PATH_HIGHT) {
      tos.sort((f1, f2) => textSort(f1.filePath, f2.filePath))
    } else if(type == SORT_PATH_LOW) {
      tos.sort((f1, f2) => textSort(f2.filePath, f1.filePath))
    }
  
    return tos
  }
  
  const [list, setList] = useState(()=> {
    const where = match.params.where
    const what = match.params.what
    let media = []
    if(where == 'source') {
      media = source.media[what]
    } else if(where == 'copy') {
      media = copy.media[what]
    }
    
    media = addBaseName(media)
    media = sortFiles(sort, media)

    return media
  }, [match.params])
  
  const onNameSort = () => {
    let newSort = sort == SORT_NAME_HIGHT ? SORT_NAME_LOW : SORT_NAME_HIGHT
    setSort(newSort)
    setList(sortFiles(newSort))
  }

  const onPathSort = () => {
    let newSort = sort == SORT_PATH_HIGHT ? SORT_PATH_LOW : SORT_PATH_HIGHT
    setSort(newSort)
    setList(sortFiles(newSort))
  }

  const onSizeSort = () => {
    let newSort = sort == SORT_SIZE_HIGHT ? SORT_SIZE_LOW : SORT_SIZE_HIGHT
    setSort(newSort)
    setList(sortFiles(newSort))
  }


  return (
    <div className="body">
      <Link to={routes.COUNTER}>&larr; back to source info</Link>
      
      <table>
        <thead>
          <tr>
            <td onClick={onNameSort}>Name</td>
            <td onClick={onPathSort}>Path</td>
            <td onClick={onSizeSort}>Size</td>
          </tr>
        </thead>
        <tbody>
          {list.map((file)=>(<FileInfo file={file} />))}
        </tbody>
      </table>
      <div>
      Total files: {list.length}
      </div>
      
    </div>
  );

}

export default Files
