import * as fs from 'fs'
import * as path from 'path'
import { cleanError, addError, takeFileStats, FileType, MEDIA_LIBRARY_NAME, MEDIA_NAMES, MEDIA_TYPES } from './common'




export const startfind = async (mediaLibraryPath: string, updateLibrary, updateUnhashed, loadMediaFile = true) => {

    const media = {
      totalSize: 0,
      totalFiles: 0,
    }

    for(const mtype of MEDIA_TYPES) {
      media[mtype.category] = []
      media[mtype.category + '_size'] = 0
    }
    
    cleanError()
    findRecursive( mediaLibraryPath, '', media)
    const [unhashed, missing] = connectLinkedFile(mediaLibraryPath, media, loadMediaFile);
    
    updateLibrary(media)
    updateUnhashed(unhashed)
  
    return [media, unhashed, missing]
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
      
      for(const file of files) {
        const filePath = relativePath + file;
        const fullpath = mediaLibraryPath + filePath;
        const fileStat = fs.statSync(fullpath);
        
        // console.log(filePath, `Is file: ${fileStat.isFile()} vs. Is directory: ${fileStat.isDirectory()}`)
  
        if(fileStat.isFile() || !findRecursive(mediaLibraryPath, path.normalize(filePath + '/'), findData)){      
          const filestats = takeFileStats(filePath, fullpath);
         
          findData[filestats.category].push(filestats)
          findData[filestats.category + '_size'] += filestats.size
         
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

    for(const media of MEDIA_NAMES) {
      if(findData[media] && findData[media].length > 0) {
        for(const fileStat of findData[media]) {
          const located = storedData && locateInDataByPath(storedData, media, fileStat.filePath)
    
          if(located) {
            fileStat.hash = located[0].hash
          } else {
            unhashed.files.push(fileStat)
            unhashed.totalSize += fileStat.size;
          }
        }
      }
    }
  
    return [unhashed, storedData];
  }


  export const findMissing = (mediaLibraryPath: string, media) => {
      
    let missing = {
      files: [],
      totalSize: 0
    }

    for(const mediaName of MEDIA_NAMES) {
      
      for(const file of media[mediaName]) {

        if(file.filePath.indexOf('weddings/martin/primary/videos/11-06-') != -1) {
          // console.log('******$$$ #2', path.join(mediaLibraryPath, file.filePath))
        }

        const located = fs.existsSync(path.join(mediaLibraryPath, file.filePath))
  
        if(!located) {
          missing.files.push(file)
          missing.totalSize += file.size;
        }
      }
    }
  
    return missing;
  }