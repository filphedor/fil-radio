import './spotify-radio.scss';

import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from '/components/home/home';
import Auth from '/components/auth/auth';
import Radio from '/components/radio/radio';

import NavBar from '/components/nav-bar/nav-bar';


let SpotifyRadio = function() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home/>,
        },
        {
            path: "/home",
            element: <Home/>,
        },
        {
          path: "/auth",
          element: <Auth/>,
        },
        {
          path: "/radio",
          element: <Radio/>,
        }
      ]);


    return (
        <div className={'spotify-radio'}>
            <div className={'spotify-radio__nav'}>
                <NavBar/>
            </div>
            <div className={'spotify-radio__content'}>
                <RouterProvider router={router} />
            </div>
        </div>
    );
};

export default SpotifyRadio;