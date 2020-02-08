import * as fs from 'fs'

let errorReport = ''

export const MEDIA_LIBRARY_NAME = '4.media-library.json'
export const VIDEO_FORMATS = [ 'MPG', 'MP2', 'MPEG', 'MPE', 'MPV', 'MP4', 'M4P', 'M4V', 'WEBM', 'OGG', 'AVI', 'WMV', 'MOV', 'QT', 'FLV', 'SWF', 'AVCHD' ]
export const PHOTO_FORMATS = ['JPEG', 'GIF', 'PNG', 'JPG']
export const RAW_PHOTO_FORMATS = ['IIQ', '3FR', 'DCR', 'K25', 'KDC','CRW', 'CR2', 'CR3', 'ERF', 'MEF', 'MOS' , 'NEF', 'NRW', 'ORF', 'PEF' , 'RW2', 'ARW', 'SRF', 'SR2', 'DNG']

export const FileType = {
    VIDEO: 0, PHOTO: 1, RAW_PHOTO: 2, OTHER: 3
}
  
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

export const MEDIA_NAMES = [
    'videos',
    'photos',
    'raw_photos',
    'other_files'
  ]

export const takeFileStats = (filePath: string, fullpath: String): IFileInfo  => {

    const stats = fs.statSync(fullpath)
    const size = stats["size"]
    const ctimeMs = stats["ctimeMs"]

    const path = filePath.split('/')
    const name = path[path.length-1]

    const extensions = name.split('.')
    const extension = extensions[extensions.length-1].toUpperCase()

    let type = FileType.OTHER;

    if(VIDEO_FORMATS.includes(extension)) {
        type = FileType.VIDEO
    }

    if(PHOTO_FORMATS.includes(extension)) {
        type = FileType.PHOTO
    }

    if(RAW_PHOTO_FORMATS.includes(extension)) {
        type = FileType.RAW_PHOTO
    }

    return {
        filePath,
        size,
        extension,
        ctimeMs,
        type
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