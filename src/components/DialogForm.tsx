import React from 'react';
import {
    DialogType,
    Dialog,
    DialogFooter,
    PrimaryButton,
    DefaultButton,
    Slider,
    TextField,
} from 'office-ui-fabric-react';
import { ItemType } from '.';

interface IProps {
    hidden: boolean;
    item: ItemType | null;
    onVisibleChange: (visible: boolean) => void;
}
export const DialogForm: React.FunctionComponent<IProps> = (props: IProps) => {
    const { hidden, item, onVisibleChange } = props;
    const [isHidden, setHidden] = React.useState(hidden);

    React.useEffect(() => {
        setHidden(hidden);
    }, [hidden]);

    const modelProps = {
        isBlocking: true,
        styles: { main: { maxWidth: 450 } },
    };
    const dialogContentProps = {
        type: DialogType.largeHeader,
        title: item ? 'Edit Item' : 'Add New Item',
    };

    const handleCancel = () => {
        setHidden(true);
        onVisibleChange(true);
    };

    const handleOk = () => {
        setHidden(true);
        onVisibleChange(true);
    };

    return (
        <Dialog
            hidden={isHidden}
            onDismiss={handleCancel}
            dialogContentProps={dialogContentProps}
            modalProps={modelProps}
        >
            <TextField label='Item Name ' defaultValue={item?.name} required />
            <Slider
                label='Periodicity'
                min={1}
                max={5}
                step={1}
                defaultValue={item?.periodicity}
                showValue
                snapToStep
            />
            <DialogFooter>
                <PrimaryButton onClick={handleOk} text='Save' />
                <DefaultButton onClick={handleCancel} text='Cancel' />
            </DialogFooter>
        </Dialog>
    );
};
