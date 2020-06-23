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
} from 'office-ui-fabric-react';
import { useAuth0 } from '../react-auth0-spa';
import axios from 'axios';
import { truncateDay, format, ItemType, DialogForm } from '.';

const boldStyle = {
    root: { fontWeight: FontWeights.semibold },
};

export const Table: React.FunctionComponent = () => {
    const { isAuthenticated } = useAuth0();
    const [items, setItems] = React.useState<ItemType[]>([]);
    const [isLoading, setLoading] = React.useState(true);
    const [isDialogHidden, setDialogHidden] = React.useState(true);
    const [item, setItem] = React.useState<ItemType | null>(null);

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
    }, [isAuthenticated, isDialogHidden]);

    const _columns = [
        { key: 'name', name: 'Item', fieldName: 'name', minWidth: 400, maxWidth: 400, isResizable: false },
        {
            key: 'periodicity',
            name: 'Periodicity',
            fieldName: 'periodicity',
            minWidth: 100,
            maxWidth: 100,
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

    const selection = (item?: any, _index?: number, _ev?: React.FocusEvent<HTMLElement>) => {
        setItem(item);
        setDialogHidden(false);
    };

    const invoked = (item?: any, _index?: number, _ev?: Event) => {
        setItem(item);
        setDialogHidden(false);
    };

    const onVisibleChange = (visible: boolean) => {
        setDialogHidden(visible);
        setItem(null);
    };

    return (
        <>
            <ShimmeredDetailsList
                selectionMode={SelectionMode.none}
                onRenderItemColumn={_renderItemColumn}
                columns={_columns}
                setKey='name'
                checkboxVisibility={CheckboxVisibility.hidden}
                layoutMode={DetailsListLayoutMode.justified}
                items={items}
                enableShimmer={isLoading}
                onActiveItemChanged={selection}
                selectionPreservedOnEmptyClick={false}
                onItemInvoked={invoked}
            />
            <DialogForm hidden={isDialogHidden} onVisibleChange={onVisibleChange} item={item} />
        </>
    );
};
