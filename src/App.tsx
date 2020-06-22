import React from 'react';
import axios from 'axios';
import { useAuth0 } from './react-auth0-spa';
import { Main, Login } from './components';

axios.defaults.baseURL = 'https://maintenance-e737.restdb.io/rest/';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('id_token');

export const App: React.FunctionComponent = () => {
    const { isAuthenticated, getIdTokenClaims } = useAuth0();
    if (isAuthenticated) {
        getIdTokenClaims().then((resp: { __raw: any }) => {
            localStorage.setItem('id_token', resp.__raw);
        });
    }

    return <>{isAuthenticated ? <Main /> : <Login />}</>;
};
