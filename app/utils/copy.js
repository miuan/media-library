import * as fs from 'fs'
import * as path from 'path'
import { MEDIA_NAMES, writeScan } from './common'


const locateInLibraryByHash = (data: IFindData, where: string, hash: string) => {
    let index = -1
    
    return data[where] && data[where].find((file, idx) => {
      if(file.hash === hash) {
        index = idx
        return true
      }
    })
  }
  
  export const libraryVsSource = (libraryMedia, source) => {
    console.log(libraryMedia)
    const filesForCopy = {
      totalSize: 0,
      totalFiles: 0,
    }
  
    MEDIA_NAMES.forEach( (media)=>{
      const sourceMedia = source[media] || []
      const copyMedia = []

      sourceMedia.forEach((fileStat)=>{
        const located = locateInLibraryByHash(libraryMedia, media, fileStat.hash)
    
        if(!located) {
          copyMedia.push(fileStat)
          filesForCopy.totalFiles += 1;
          filesForCopy.totalSize += fileStat.size;
        }
      })

      filesForCopy[media] = copyMedia
    })
  
    console.log(filesForCopy)
    return filesForCopy
  
  }

  export const copyFiles = async (library, copyData, sourceLocation, { progress, updateLibrary }) => {

    console.log('TOOD: copyFile', [copyData, sourceLocation, library.location])
    const destination = path.join(copyData.destination, copyData.origin)

    const stats = {
      copiedSize: 0,
      copiedFiles: 0,
      totalSize: copyData.media.totalSize,
      totalFiles: copyData.media.totalFiles
    }

    for(const media of MEDIA_NAMES) {

      const prevLibrary = library.media[media] && library.media[media].length > 0 ? library.media[media] : []
      const updatedLib = [
        ...prevLibrary
      ]

      try {
        if(copyData.media[media] && copyData.media[media].length > 0) {
          const mediaDestination = path.join(destination, media)
          await copyMedia(updatedLib, copyData.media[media], sourceLocation, library.location, mediaDestination, progress, stats)
        } 
      } finally {

        console.log('finally-' + media, updatedLib)
        library.media[media] = updatedLib
        library.media[media + '_size'] = updatedLib.reduce((prev, cur) => (cur.size > 0 ? prev + cur.size : prev), 0)
        library.totalFiles = MEDIA_NAMES.reduce((totalFiles, m) => (library[m] && library[m].length > 0 ? totalFiles + library[m].length : totalFiles), 0)
        library.totalSize = MEDIA_NAMES.reduce((totalSize, m) => (library[m] && library[m + '_size'] > 0 ? totalSize + library[m + '_size'] : totalSize), 0)

        writeScan(library.location, library.media)
        updateLibrary(library.media)
      }
      
    }
  
  }

  const copyMedia = async (updateLibrary, files, sourceLocation, libraryLocation, destination, progress, stats) => {
    for( const file of files) {

      const [fullFileDest, fileDest] = generateFileName(file, libraryLocation, destination)
      
      
      await new Promise((resolve, reject) => {
        fs.copyFile(path.join(sourceLocation, file.filePath), fullFileDest, resolve)
      })
      
      stats.copiedSize += file.size
      stats.copiedFiles += 1
      const copiedProgress = Math.round((stats.copiedSize/stats.totalSize)*10000)/100
      console.log('copiedProgress', copiedProgress)
      progress(copiedProgress)


      const newone = {
        filePath: fileDest[0] == '/' ? fileDest.substr(1) : fileDest,
        hash: file.hash,
        size: file.size,
        ctimeMs: file.ctimeMs,
      }
      updateLibrary.push(newone)
    }
  }

  const generateFileName = (file, libraryLocation, destination) => {
    const cdate = new Date(file.ctimeMs)
    
    const numericMonth = (cdate.getMonth()+1)
    const month = numericMonth < 10 ? `0${numericMonth}` : `${numericMonth}`
    const numericDay = (cdate.getDay()+1)
    const day = numericDay < 10 ? `0${numericDay}` : `${numericDay}`

    const rawHours = cdate.getHours()
    const numericHours = rawHours% 2 > 0 ? rawHours - 1 : rawHours
    const hours = numericHours < 10 ? `0${numericHours}` : `${numericHours}`

    const customDir = `/${month}-${day}-${hours}/`
    const finalDestDir = path.join(destination, customDir)
    const fullDestDir = path.join(libraryLocation, finalDestDir)
    
    if(!fs.existsSync(fullDestDir)){
      fs.mkdirSync(fullDestDir, { recursive: true });
    } 
    
    let fileName = path.basename(file.filePath)
    let fileDest = path.join(finalDestDir, fileName)
    let fullFileDest = path.join(libraryLocation, fileDest)
   
    let iterate = 2
    while(fs.existsSync(fullFileDest)){
      const fileInfo = path.parse(fileName)
      fileDest = path.join(finalDestDir, `${fileInfo.name}-${(iterate++)}${fileInfo.ext}`)
      fullFileDest = path.join(libraryLocation, fileDest)
    }
    
    return [
      fullFileDest,
      fileDest
    ]
  }
  
