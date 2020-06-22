import React from 'react';
import {
    Text,
    FontWeights,
    IColumn,
    mergeStyles,
    DetailsList,
    SelectionMode,
    DetailsListLayoutMode,
    CheckboxVisibility,
} from 'office-ui-fabric-react';
import { useAuth0 } from '../react-auth0-spa';
import axios from 'axios';
import { truncateDay, format } from '.';

const boldStyle = {
    root: { fontWeight: FontWeights.semibold },
};

type ItemsType = {
    name: string;
    periodicity: number;
    last_maintenance: Date;
};
export const Table: React.FunctionComponent = () => {
    const { isAuthenticated } = useAuth0();
    const [items, setItems] = React.useState<ItemsType[]>([]);

    React.useEffect(() => {
        if (isAuthenticated) {
            axios
                .get('items')
                .then((response) => {
                    setItems(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [isAuthenticated]);

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
            minWidth: 200,
            maxWidth: 200,
            isResizable: false,
        },
    ];

    const _renderItemColumn = (item: ItemsType, index?: number, column?: IColumn) => {
        const fieldContent = item[column!.fieldName as keyof ItemsType] as string;

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

    const selection = (item?: any, index?: number, ev?: React.FocusEvent<HTMLElement>) => {
        console.log(item);
    };

    return (
        <DetailsList
            selectionMode={SelectionMode.single}
            onRenderItemColumn={_renderItemColumn}
            columns={_columns}
            setKey='none'
            checkboxVisibility={CheckboxVisibility.hidden}
            layoutMode={DetailsListLayoutMode.justified}
            items={items}
            onActiveItemChanged={selection}
            selectionPreservedOnEmptyClick={false}
            enterModalSelectionOnTouch={true}
        />
    );
};
