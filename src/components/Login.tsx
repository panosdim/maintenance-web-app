import React from 'react';
import { Stack, Text, IStackTokens, Image, PrimaryButton } from 'office-ui-fabric-react';
import { useAuth0 } from '../react-auth0-spa';
import logo from '../images/logo.png';

const sectionStackTokens: IStackTokens = { childrenGap: 15 };

export const Login: React.FunctionComponent = () => {
    const { loginWithRedirect } = useAuth0();

    return (
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
            tokens={sectionStackTokens}
        >
            <Image src={logo} alt='Maintenance App Logo' />
            <Text variant='mega'>Maintenance App</Text>
            <PrimaryButton text='Login' onClick={() => loginWithRedirect({})} />
        </Stack>
    );
};
