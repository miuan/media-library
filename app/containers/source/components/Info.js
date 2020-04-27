import React from 'react';
import { InfoLink } from './InfoLink';

export const Info = ({
    source,
    copy
  }) => {
    return (
        <table>
          <thead>
            <tr>
            
            <td align="center">Copy of Total</td>
            <td align="center">video</td>
            <td align="center">photo</td>
            <td align="center">raw photo</td>
            <td align="center">audio</td>
            <td align="center">others</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td align="center"><b>{copy.media.totalFiles}</b> of {source.media.totalFiles} </td>
              <td align="center"><InfoLink to={'/files/copy/videos'} length={copy.media.videos.length} /></td>
              <td align="center"><InfoLink to={'/files/copy/audio'} length={copy.media.audio.length} /></td>
              <td align="center"><InfoLink to={'/files/copy/photos'} length={copy.media.photos.length} /></td>
              <td align="center"><InfoLink to={'/files/copy/raw_photos'} length={copy.media.raw_photos.length} /></td>
              <td align="center"><InfoLink to={'/files/copy/other_files'} length={copy.media.other_files.length}/></td>
            </tr>
          </tbody>
        </table>
    )

}

export default Info