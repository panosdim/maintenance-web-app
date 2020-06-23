import React from 'react';
import {
    DialogType,
    Dialog,
    DialogFooter,
    PrimaryButton,
    DefaultButton,
    Slider,
    TextField,
    DatePicker,
    mergeStyleSets,
    DayOfWeek,
} from 'office-ui-fabric-react';
import { ItemType, isHidden, selectedItem, format } from '.';
import { useRecoilState } from 'recoil';

export const DialogForm: React.FunctionComponent = () => {
    const [hidden, setHidden] = useRecoilState(isHidden);
    const [item, setItem] = useRecoilState<ItemType | undefined>(selectedItem);

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
        setItem(undefined);
    };

    const handleOk = () => {
        setHidden(true);
        setItem(undefined);
    };

    const controlClass = mergeStyleSets({
        control: {
            margin: '0 0 15px 0',
            maxWidth: '300px',
        },
    });

    return (
        <Dialog
            hidden={hidden}
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
            <DatePicker
                className={controlClass.control}
                firstDayOfWeek={DayOfWeek.Monday}
                label='Last Maintenance'
                isRequired={true}
                value={item ? new Date(item.last_maintenance) : new Date()}
                formatDate={format}
            />
            <DialogFooter>
                <PrimaryButton onClick={handleOk} text='Save' />
                <DefaultButton onClick={handleCancel} text='Cancel' />
            </DialogFooter>
        </Dialog>
    );
};
