import * as fs from 'fs'
import * as path from 'path'
import { cleanError, addError, takeFileStats, FileType, MEDIA_LIBRARY_NAME } from './common'




export const startfind = async (mediaLibraryPath: string, updateLibrary, updateUnhashed, loadMediaFile = true) => {

    const media = {
      totalSize: 0,
      totalFiles: 0,
      videos: [],
      video_size: 0,
      photos: [],
      photos_size: 0,
      raw_photos: [],
      raw_photos_size: 0,
      other_files: [],
      other_files_size: 0,
    }
    
    cleanError()
    findRecursive( mediaLibraryPath, '', media)
    const unhashed = connectLinkedFile(mediaLibraryPath, media, loadMediaFile);
    
    updateLibrary(media)
    updateUnhashed(unhashed)
  
    // const srcDir = '/Users/milanmedlik/Documents/video/ambon/fuji/'
  
    // const copyData = {
    //   totalSize: 0,
    //   totalFiles: 0,
    //   videos: [],
    //   video_size: 0,
    //   photos: [],
    //   photos_size: 0,
    //   raw_photos: [],
    //   raw_photos_size: 0,
    //   other_files: [],
    //   other_files_size: 0,
    // }
  
    // findRecursive( srcDir, '', copyData)
    // const unhashed2 = connectLinkedFile(srcDir, copyData, false);
    // await copyFiles(srcDir, copyData, mediaLibraryPath, findData)
  
    return [media, unhashed]
  }

  const findRecursive =  (mediaLibraryPath: string, relativePath: string, findData: IFindData) => {
    let files = []
    
    try {
      files = fs.readdirSync(mediaLibraryPath + relativePath)
    } catch (e) {
      // DODO: 
      // for some reason in previous step some files are recognized as directory
      // const fileStat = fs.lstatSync(fullpath);
      // console.log(filePath, `Is file: ${fileStat.isFile()} vs. Is directory: ${fileStat.isDirectory()}`)
      // Uncaught (in promise) Error: Invalid package /Users/milanmedlik/Downloads/traveling-L89QZV2/Visual Studio Code/Contents/Resources/app/node_modules.asar/
  
      addError(mediaLibraryPath + relativePath, e)
      return false
    }
      
      for( const file of files) {
        const filePath = relativePath + file;
        const fullpath = mediaLibraryPath + filePath;
        const fileStat = fs.statSync(fullpath);
        
        // console.log(filePath, `Is file: ${fileStat.isFile()} vs. Is directory: ${fileStat.isDirectory()}`)
  
        if(fileStat.isFile() || !findRecursive(mediaLibraryPath, path.normalize(filePath + '/'), findData)){      
          const filestats = takeFileStats(filePath, fullpath);
         
          if(filestats.type === FileType.VIDEO) {
            findData.videos.push(filestats)
            findData.video_size += filestats.size
          }
  
          if(filestats.type === FileType.PHOTO) {
            findData.photos.push(filestats)
            findData.photos_size += filestats.size
          }
  
          if(filestats.type === FileType.RAW_PHOTO) {
            findData.raw_photos.push(filestats)
            findData.raw_photos_size += filestats.size
          }
  
          if(filestats.type === FileType.OTHER) {
            findData.other_files.push(filestats)
            findData.other_files_size += filestats.size
          }
  
          findData.totalSize += filestats.size;
          findData.totalFiles += 1;
        }
      }
  
      return true
  }

  const locateInDataByPath = (data: IFindData, where: string, filePath: string) => {
    let index = -1
    
    if(data[where] && data[where].length > 0) {
      data[where].find((file, idx) => {

        const dfp = file.filePath[0] == '/' ? file.filePath.substr(1) : file.filePath
        const fp = filePath[0] == '/' ? filePath.substr(1) : filePath

        if(dfp === fp) {
          index = idx
          return true
        }
      })

      return index != -1 ? data[where].splice(index, 1) : null
    }
  }
  
  const connectLinkedFile = (mediaLibraryPath: string, findData, loadMediaFile = true) => {
  
    let storedData = null
  
    if(loadMediaFile) {
      const fileName = path.normalize(mediaLibraryPath + '/' + MEDIA_LIBRARY_NAME)
      if(fs.existsSync(fileName)) {
        let rawdata = fs.readFileSync(fileName);
        storedData = JSON.parse(rawdata)
      }
    }
      
    let unhashed = {
      files: [],
      totalSize: 0
    }
  
    findData.videos.forEach((fileStat)=>{
      const located = storedData && locateInDataByPath(storedData, 'videos', fileStat.filePath)
  
      if(located) {
        fileStat.hash = located[0].hash
      } else {
        unhashed.files.push(fileStat)
        unhashed.totalSize += fileStat.size;
      }
    })
  
    findData.photos.forEach((fileStat)=>{
      const located = storedData && locateInDataByPath(storedData, 'photos', fileStat.filePath)
  
      if(located) {
        fileStat.hash = located[0].hash
      } else {
        unhashed.files.push(fileStat)
        unhashed.totalSize += fileStat.size;
      }
    })
  
    findData.raw_photos.forEach((fileStat)=>{
      const located = storedData && locateInDataByPath(storedData, 'raw_photos', fileStat.filePath)
  
      if(located) {
        fileStat.hash = located[0].hash
      } else {
        unhashed.files.push(fileStat)
        unhashed.totalSize += fileStat.size;
      }
    })
  
    findData.other_files.forEach((fileStat)=>{
      const located = storedData && locateInDataByPath(storedData, 'other_files', fileStat.filePath)
  
      if(located) {
        fileStat.hash = located[0].hash
      } else {
        unhashed.files.push(fileStat)
        unhashed.totalSize += fileStat.size;
      }
    })
  
    return unhashed;
  }