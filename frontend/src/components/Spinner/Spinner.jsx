import React from 'react';
import './Spinner.css';

const Spinner = () => (
  <div className="spinner">
    <div className="lds-css ng-scope">
      <div className="lds-spinner">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  </div>
);

Spinner.propTypes = {};

Spinner.defaultProps = {};

export default Spinner;
