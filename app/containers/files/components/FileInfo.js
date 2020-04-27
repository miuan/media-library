import React from 'react';


export const FileInfo = ({
    file
  }) => {

    const size = Math.round(file.size/10000000) * 10
    return (
      <tr>
        <td>{file.basename}</td>
        <td>{file.filePath}</td>
        <td>{size}Mb</td>
      </tr>
    )

}

export default FileInfo