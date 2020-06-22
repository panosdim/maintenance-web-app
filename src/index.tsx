import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { Auth0Provider } from './react-auth0-spa';
import * as serviceWorker from './serviceWorker';
import { mergeStyles } from 'office-ui-fabric-react';

// Inject some global styles
mergeStyles({
    selectors: {
        ':global(body), :global(html), :global(#root)': {
            margin: 0,
            padding: 0,
            height: '100vh',
        },
    },
});

ReactDOM.render(
    <Auth0Provider>
        <App />
    </Auth0Provider>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
