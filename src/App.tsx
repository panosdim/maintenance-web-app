import React from 'react';
import axios from 'axios';
import { useAuth0 } from './react-auth0-spa';
import { Main, Login } from './components';
import { Spinner, Stack } from 'office-ui-fabric-react';
import { RecoilRoot } from 'recoil';

axios.defaults.baseURL = 'https://maintenance-e737.restdb.io/rest/';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('id_token');

export const App: React.FunctionComponent = () => {
    const { isLoading, isAuthenticated, getIdTokenClaims } = useAuth0();
    if (isAuthenticated) {
        getIdTokenClaims().then((resp: { __raw: any }) => {
            localStorage.setItem('id_token', resp.__raw);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + resp.__raw;
        });
    }

    return (
        <RecoilRoot>
            {isLoading ? (
                <Stack
                    horizontalAlign='center'
                    verticalAlign='center'
                    verticalFill
                    styles={{
                        root: {
                            width: '960px',
                            margin: '0 auto',
                            textAlign: 'center',
                            color: '#605e5c',
                        },
                    }}
                >
                    <div>
                        <Spinner label='Checking for active session...' />
                    </div>
                </Stack>
            ) : isAuthenticated ? (
                <Main />
            ) : (
                <Login />
            )}
        </RecoilRoot>
    );
};
