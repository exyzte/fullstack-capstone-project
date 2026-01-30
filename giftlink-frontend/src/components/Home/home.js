import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
  return (
    <div className="content"> {/* Consider if you need this wrapper div */}
      <div className="container my-5">
        <div className="text-center">
          {/* Using h1 and h2 for semantic headings */}
          <h1 className="display-4 mb-7">Free gifts and trades</h1> 
          <h2 className="mb-5" id="subheading">Share your gifts and Joy with others!</h2>
          
          {/* Using a paragraph tag for the quote */}
          <p className="lead">
            "When you share gifts, you create a ripple effect of joy and generosity. 
             Sharing fills the spirit and elevates the soul."
          </p>
          
          {/* Using Link from react-router-dom for SPA navigation */}
          <Link to="/app" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
