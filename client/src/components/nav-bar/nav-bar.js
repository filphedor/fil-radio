import './nav-bar.scss';

import React, {useState, useEffect} from "react";

import Dependencies from '/util/dependencies';


const NavBar = function() {
    const [user, setUser] = useState(null);

    const spotifyService = Dependencies.getDependency('spotifyService');
    const notificationService = Dependencies.getDependency('notificationService');

    const setUpUser = async function() {
        try {
            let currentUser = await spotifyService.getUser();
            setUser(currentUser);
        } catch(error) {
            setUser(null);
        }
    };

    useEffect(() => {
        return notificationService.listen((notif) => {
            alert(notif.message);
        });
    }, []);

    useEffect(() => {
        setUpUser();
    }, []);

    const logIn = function() {
        spotifyService.authenticate('http://localhost:3000/auth');
    };

    const logOut = function() {
        spotifyService.logOut();
    };

    const getUserSection = function() {
        if (user) {
            return (
                <>
                    <div className={'nav-bar__user'}>
                        {user.display_name}
                    </div>
                    <div className={'nav-bar__log-in'} onClick={logOut}>
                        {'Log Out'}
                    </div>
                </>
            );
        }

        return (
            <div className={'nav-bar__log-in'} onClick={logIn}>
                {'Log In'}
            </div>
        );
    };

    return (
        <div className={'nav-bar'}>
            <div className={'nav-bar__spacer'}></div>
            <div className={'nav-bar__auth'}>{getUserSection()}</div>
            
        </div>
    )
};

export default NavBar;