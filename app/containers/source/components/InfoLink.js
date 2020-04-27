import React from 'react';
import { Link } from 'react-router-dom';

export const InfoLink = ({
    length,
    to
  }) => {
    if(!length || length < 1) {
      return (<>{length}</>)
    }

    return ( <Link to={to}>{length}</Link> )
}

export default InfoLink