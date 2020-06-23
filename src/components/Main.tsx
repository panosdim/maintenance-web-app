import React from 'react';
import { Stack, DefaultButton, Text, Image, IStackTokens, PrimaryButton } from 'office-ui-fabric-react';
import { useAuth0 } from '../react-auth0-spa';
import { Table, isHidden, selectedItem } from '.';
import logo from '../images/logo.png';
import { useSetRecoilState } from 'recoil';

const sectionStackTokens: IStackTokens = { childrenGap: 10 };

export const Main: React.FunctionComponent = () => {
    const { logout } = useAuth0();
    const setHidden = useSetRecoilState(isHidden);
    const setItem = useSetRecoilState(selectedItem);

    const addNewItem = () => {
        setHidden(false);
        setItem(undefined);
    };

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
            <Stack horizontalAlign='center' verticalAlign='center' horizontal tokens={sectionStackTokens}>
                <Image width={32} height={32} src={logo} alt='Logo' />
                <Text variant='xxLarge'>Maintenance App</Text>
            </Stack>
            <Stack horizontalAlign='space-between' verticalAlign='center' horizontal tokens={sectionStackTokens}>
                <PrimaryButton iconProps={{ iconName: 'Add' }} text='Add New' onClick={() => addNewItem()} />
                <DefaultButton iconProps={{ iconName: 'SignOut' }} text='Log out' onClick={() => logout()} />
            </Stack>
            <Table />
        </Stack>
    );
};
