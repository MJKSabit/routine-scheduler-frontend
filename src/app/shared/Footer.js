import React, { Component } from 'react';

class Footer extends Component {
  render () {
    return (
      <footer className="footer">
        <div className="d-sm-flex justify-content-center justify-content-sm-between py-2">
          <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">Copyright © <a href="https://cse.buet.ac.bd/" target="_blank" rel="noopener noreferrer">cse.buet.ac.bd </a>2023</span>
          <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">Created by <a href="https://www.github.com/MJKSabit" target="_blank" rel="noopener noreferrer">Md. Jehadul Karim</a>, <a href="https://www.github.com/" target="_blank" rel="noopener noreferrer">Abdullah Al Fahad</a> and <a href="https://www.github.com/" target="_blank" rel="noopener noreferrer">Somonindro Roy</a></span>
        </div>
      </footer> 
    );
  }
}

export default Footer;