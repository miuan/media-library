// @flow
import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Counter.css';
import routes from '../constants/routes.json';
import { remote } from 'electron';


const dialog = remote.dialog

type Props = {
  increment: () => void,
  incrementIfOdd: () => void,
  incrementAsync: () => void,
  decrement: () => void,
  showfile: () => void,
  start: () => void,
  counter: number,
  scan: any,
  unlinked: any,
};

export default class Counter extends Component<Props> {
  props: Props;

  render() {
    const {
      increment,
      incrementIfOdd,
      incrementAsync,
      decrement,
      showfile,
      start,
      counter,
      stats,
      unlinked
    } = this.props;

    const startdefault = () => start();
    
    const opendialog = () => {
      const mediaDir = dialog.showOpenDialogSync({ properties: ['openDirectory'] })
      start(mediaDir);
    }

    const unlinkedFiles = (stats && stats.totalFiles > 0 && unlinked && unlinked.files && unlinked.files.length > 0 ? Math.round((unlinked.files.length/stats.totalFiles)*100) : `NaN`)

    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to={routes.HOME}>
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={`counter `} >
          {`Total size: ` + Math.round(stats.totalSize/1000000) + `Mb`} 
        </div>
        
        <div className={`counter `} >
          {`Unlined files total: ` + (unlinked && unlinked.files ? unlinked.files.length : 0 ) + `(` + unlinkedFiles  + `%)`} 
        </div>
        
        <div className={`counter ${styles.counter}`} data-tid="counter">
          {counter}
        </div>
        <div className={styles.btnGroup}>
          <button
            className={styles.btn}
            onClick={startdefault}
            data-tclass="btn"
            type="button"
          >
            <i className="fa fa-plus" />
          </button>
          <button
            className={styles.btn}
            onClick={opendialog}
            data-tclass="btn"
            type="button"
          >
            <i className="fa fa-minus" />
          </button>
          <button
            className={styles.btn}
            onClick={incrementIfOdd}
            data-tclass="btn"
            type="button"
          >
            odd
          </button>
          <button
            className={styles.btn}
            onClick={() => incrementAsync()}
            data-tclass="btn"
            type="button"
          >
            async
          </button>
        </div>
      </div>
    );
  }
}
