import './home.scss';

import React from "react";

import { Link } from "react-router-dom";


let Home = function() {
    return (
        <div className={'home'}>
          <div className="home__title">
              {'Welcome to Fil Radio'}
          </div>
          <Link to="/radio">
              <div className="home__radio-link">{'Start listening...'}</div>
          </Link>
        </div>
    );
};

export default Home;