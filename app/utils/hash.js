import * as fs from 'fs'
import * as CryptoJS from 'crypto-js'
import {addError} from './common'

export const generateHashForUnhashed = async (mediaLibraryPath: string, unhashed, updateUnhashedWithProgress) => {
  
  const originalTotalSize = unhashed.totalSize
  let currentTotalSize = originalTotalSize

    while(true) {
      const file = unhashed.files.pop();

      if(!file) {
        break
      }

      await new Promise(async (resolve, reject) => {
        setTimeout(async () => {
          const hash = await hashgen(mediaLibraryPath, file)
          // const hash2 = await hashgen(mediaLibraryPath, file)
  
          // if(hash != hash2) {
          //   console.log(file, hash, hash2)
          // }
    
          file.hash = hash;
          currentTotalSize = currentTotalSize - file.size 
          const updatedUnhased = { 
            files : unhashed.files,
            totalSize: currentTotalSize
          }
    
          const percent = Math.round(((originalTotalSize - currentTotalSize) / originalTotalSize)*100)
          console.log(currentTotalSize, percent)
          updateUnhashedWithProgress(updatedUnhased, percent)
          resolve();
        }, 1)
      })
    }
  }

const hashgen = async (mediaLibraryPath: string, file: IFileInfo)  => {
    const size = file.size;
    const BIT = 124 * 1024
    const md5 = CryptoJS.algo.MD5.create();
  
    try {
      if(size < 3.1 * BIT){
        await hashgenBit(mediaLibraryPath, file, md5, 0, size)
      } else {
        const quater = Math.round(size / 4);
        await hashgenBit(mediaLibraryPath, file, md5, quater, BIT)
        await hashgenBit(mediaLibraryPath, file, md5, quater*2, BIT)
        await hashgenBit(mediaLibraryPath, file, md5, quater*3, BIT)
      }
  
      return md5.finalize().toString();
    } catch (e) {
      addError(mediaLibraryPath + file.filePath, e)
    }
  }
  
  
 const hashgenBit = async (mediaLibraryPath: string, file: FileInfo, md5, start: Number, bytes: Number) => {
    const fileSizeInBytes = file.size;
  
    const stream = fs.createReadStream(mediaLibraryPath + file.filePath, {
      encoding: 'utf8',
      start,
      end:  start+bytes,
      autoClose: true,
    });
  
    return new Promise((resolve, reject) => {
      stream.on('error', (e)=> {
        reject(e);
      })
      stream.on('data',  (chunk) => {
        md5.update(chunk.toString());
      })
      stream.on('end', function () {
        resolve();
      });
     })
  }