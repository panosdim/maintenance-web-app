import React from 'react';
import { Stack, List, FontWeights, DefaultButton, Text, IStackTokens } from 'office-ui-fabric-react';
import { useAuth0 } from '../react-auth0-spa';
import axios from 'axios';

const boldStyle = {
    root: { fontWeight: FontWeights.semibold },
};

const sectionStackTokens: IStackTokens = { childrenGap: 10 };

export const Main: React.FunctionComponent = () => {
    const { logout } = useAuth0();
    const [items, setItems] = React.useState();

    React.useEffect(() => {
        axios
            .get('items')
            .then((response) => {
                setItems(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const onRenderCell = (item: any, index: number | undefined): JSX.Element => {
        return (
            <Text styles={boldStyle} variant='large'>
                {item.name}
            </Text>
        );
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
            <List items={items} onRenderCell={onRenderCell} />
            <DefaultButton text='Log out' onClick={() => logout()} />
        </Stack>
    );
};
