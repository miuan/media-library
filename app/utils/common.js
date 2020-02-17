import * as fs from 'fs'
import * as path from 'path'

let errorReport = ''

export const MEDIA_LIBRARY_NAME = '4.media-library.json'
export const AUDIO_FORMATS = [ 'ACC', 'MP2', 'MP3', 'VAW']
export const VIDEO_FORMATS = [ 'MPG', 'MP2', 'MPEG', 'MPE', 'MPV', 'MP4', 'M4P', 'M4V', 'WEBM', 'OGG', 'AVI', 'WMV', 'MOV', 'QT', 'FLV', 'SWF', 'AVCHD' ]
export const PHOTO_FORMATS = ['JPEG', 'GIF', 'PNG', 'JPG', 'HEIC']
export const RAW_PHOTO_FORMATS = ['IIQ', '3FR', 'DCR', 'K25', 'KDC','CRW', 'CR2', 'CR3', 'ERF', 'MEF', 'MOS' , 'NEF', 'NRW', 'ORF', 'PEF' , 'RW2', 'ARW', 'SRF', 'SR2', 'DNG']
  
export interface IFileInfo {
    name: String;
    fullpath: String;
    size: String;
    extension: String;
    type: FileType;
    ctimeMs: Number;
}

export interface IFindData {
    totalSize: Number;
    totalFiles: Number;
    videos: IFileInfo[];
    video_size: Number;
    photos: IFileInfo[];
    photos_size: Number;
    raw_photos: IFileInfo[];
    raw_photos_size: Number;
    other_files: IFileInfo[];
    other_files_size: Number;
}

export const FileType = {
    AUIDIO:'audios', VIDEO: 'videos', PHOTO: 'photos', RAW_PHOTO: 'raw_photos', OTHER: 'other_files'
}

export const MEDIA_NAMES = [
    'audio',
    'videos',
    'photos',
    'raw_photos',
    'other_files'
]

export const MEDIA_TYPES = [
    {
        category: 'audio',
        extensions: AUDIO_FORMATS
    },
    {
        category: 'videos',
        extensions: VIDEO_FORMATS
    },
    {
        category: 'photos',
        extensions: PHOTO_FORMATS
    },
    {
        category: 'raw',
        extensions: RAW_PHOTO_FORMATS
    },
    {
        category: 'other_files',
        extensions: null
    }
]

export const takeFileStats = (filePath: string, fullpath: String): IFileInfo  => {

    const stats = fs.statSync(fullpath)
    const size = stats["size"]
    const ctimeMs = stats["ctimeMs"]

    const {name, ext} = path.parse(filePath)
    const extension = ext.substr(1).toUpperCase()

    let category = FileType.OTHER;

    // keep hidden in OTHER
    if(name.indexOf('.') !== 0) {
        for(const mtype of MEDIA_TYPES) {
            if(mtype.extensions && mtype.extensions.includes(extension)) {
                category = mtype.category
                break
            }
        }
    }
    
    return {
        filePath,
        size,
        extension,
        ctimeMs,
        category
    };
}
  


export const writeScan = (libraryPath: String, media: IFindData) => {

    const reducedMedia = {
        totalSize: media.totalSize,
        totalFiles: media.totalFiles
    }

    MEDIA_NAMES.forEach((mediaName)=> {
        if(media[mediaName] && media[mediaName].length > 0){
            const mnd = media[mediaName]
            reducedMedia[mediaName] = mnd.map(file=>({
                    filePath: file.filePath,
                    hash: file.hash,
                    ctimeMs: file.ctimeMs,
                    size: file.size
                }))
            reducedMedia[mediaName + '_size'] = media[mediaName + '_size']
        }
    })


    let data = JSON.stringify(reducedMedia, null, 2);
    fs.writeFileSync(libraryPath + '/' + MEDIA_LIBRARY_NAME, data);

    if(errorReport) {
        fs.writeFileSync(libraryPath + '/' + MEDIA_LIBRARY_NAME + '.error', errorReport);
    }
}

export const cleanError = () => {
    errorReport = ''
}

export const addError = (file, error) => {
    console.error(file, error)

    errorReport += `
    ${file}
    ${error.toString()}
    --
    `
}