import React from 'react';
import {
    Text,
    FontWeights,
    IColumn,
    mergeStyles,
    SelectionMode,
    DetailsListLayoutMode,
    CheckboxVisibility,
    ShimmeredDetailsList,
    MessageBar,
} from 'office-ui-fabric-react';
import { useAuth0 } from '../react-auth0-spa';
import axios from 'axios';
import { truncateDay, format, ItemType, DialogForm, isHidden, selectedItem, itemsDB } from '.';
import { useSetRecoilState, useRecoilState } from 'recoil';

const boldStyle = {
    root: { fontWeight: FontWeights.semibold },
};

export const Table: React.FunctionComponent = () => {
    const { isAuthenticated } = useAuth0();
    const [items, setItems] = useRecoilState(itemsDB);
    const [isLoading, setLoading] = React.useState(true);
    const setHidden = useSetRecoilState(isHidden);
    const setItem = useSetRecoilState<ItemType | undefined>(selectedItem);
    const [message, setMessage] = React.useState('');
    const [showMessage, setMessageShow] = React.useState(false);
    const [hintShown, setHintShown] = React.useState(false);

    React.useEffect(() => {
        if (isAuthenticated) {
            axios
                .get('items')
                .then((response) => {
                    setItems(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [isAuthenticated, setItems]);

    const _columns = [
        { key: 'name', name: 'Item', fieldName: 'name', minWidth: 400, maxWidth: 400, isResizable: false },
        {
            key: 'periodicity',
            name: 'Periodicity',
            fieldName: 'periodicity',
            minWidth: 100,
            maxWidth: 100,
            data: 'number',
            isResizable: false,
        },
        {
            key: 'last_maintenance',
            name: 'Last Maintenance',
            fieldName: 'last_maintenance',
            minWidth: 150,
            maxWidth: 150,
            isResizable: false,
        },
    ];

    const _renderItemColumn = (item: ItemType, _index?: number, column?: IColumn) => {
        const fieldContent = item[column!.fieldName as keyof ItemType] as string;

        switch (column!.key) {
            case 'name':
                return (
                    <Text styles={boldStyle} variant='large'>
                        {fieldContent}
                    </Text>
                );

            case 'periodicity':
                return <Text>{fieldContent}</Text>;

            case 'last_maintenance':
                const last_maint = truncateDay(new Date(fieldContent));
                const maint_exp = truncateDay(new Date(last_maint));
                const now = truncateDay(new Date());

                maint_exp.setFullYear(maint_exp.getFullYear() + item.periodicity);

                let style;
                if (now.getTime() > maint_exp.getTime()) {
                    style = mergeStyles({ color: 'red', height: '100%', display: 'block' });
                } else {
                    style = mergeStyles({ color: 'green', height: '100%', display: 'block' });
                }

                return (
                    <Text className={style} styles={boldStyle} variant='large'>
                        {format(last_maint)}
                    </Text>
                );

            default:
                return <span>{fieldContent}</span>;
        }
    };

    const showHint = () => {
        if (!hintShown) {
            setMessageShow(true);
            setMessage('Double click on a row to edit an item');
            setTimeout(() => {
                setMessageShow(false);
            }, 3000);
            setHintShown(true);
        }
    };

    const invoked = (item?: ItemType, _index?: number, _ev?: Event) => {
        setItem(item);
        setHidden(false);
    };

    return (
        <>
            <div onMouseEnter={showHint}>
                <ShimmeredDetailsList
                    selectionMode={SelectionMode.none}
                    onRenderItemColumn={_renderItemColumn}
                    columns={_columns}
                    setKey='name'
                    checkboxVisibility={CheckboxVisibility.hidden}
                    layoutMode={DetailsListLayoutMode.justified}
                    items={items}
                    enableShimmer={isLoading}
                    onItemInvoked={invoked}
                />
            </div>
            {showMessage && <MessageBar className={mergeStyles({ width: '350px' })}>{message}</MessageBar>}
            <DialogForm />
        </>
    );
};
