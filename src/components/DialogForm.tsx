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
    ProgressIndicator,
} from 'office-ui-fabric-react';
import { ItemType, isHidden, selectedItem, format, itemsDB, truncateDay, ymd } from '.';
import { useRecoilState } from 'recoil';
import axios from 'axios';

export const DialogForm: React.FunctionComponent = () => {
    const [hidden, setHidden] = useRecoilState(isHidden);
    const [items, setItems] = useRecoilState(itemsDB);
    const [item, setItem] = useRecoilState<ItemType | undefined>(selectedItem);
    const [nameValue, setNameValue] = React.useState<string>();
    const [sliderValue, setSliderValue] = React.useState<number>();
    const [dateValue, setDateValue] = React.useState<Date | undefined | null>();
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [progress, setProgress] = React.useState(true);

    const dateOnChange = (value?: Date | null) => setDateValue(value!);
    const sliderOnChange = (value: number) => setSliderValue(value);
    const onChangeTextNameValue = (
        _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        newValue?: string,
    ) => setNameValue(newValue || '');

    React.useEffect(() => {
        if (typeof item !== 'undefined') {
            setNameValue(item?.name);
            setSliderValue(item?.periodicity);
            setDateValue(item ? truncateDay(new Date(item.last_maintenance)) : new Date());
        } else {
            setNameValue('');
            setSliderValue(1);
            setDateValue(new Date());
        }
    }, [item]);

    const modelProps = {
        isBlocking: true,
        styles: { main: { maxWidth: 450 } },
        onDismissed: () => {
            clearFields();
        },
    };

    const dialogContentProps = {
        type: DialogType.close,
        title: item ? 'Edit Item' : 'Add New Item',
    };

    const handleCancel = () => {
        setHidden(true);
        setItem(undefined);
        clearFields();
    };

    const handleDelete = () => {
        setProgress(false);
        axios
            .delete('items/' + item!._id)
            .then(() => {
                setProgress(true);
                setItems(items!.filter((itm) => itm._id !== item!._id));
                setHidden(true);
                setItem(undefined);
                clearFields();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const clearFields = () => {
        setNameValue('');
        setSliderValue(1);
        setDateValue(new Date());
        setErrorMessage('');
    };

    const handleSave = () => {
        if (nameValue) {
            setProgress(false);
            axios
                .post('items', {
                    name: nameValue,
                    periodicity: sliderValue,
                    last_maintenance: ymd(dateValue!),
                })
                .then((response) => {
                    setProgress(true);
                    setItems([...items, response.data]);
                    setHidden(true);
                    setItem(undefined);
                    clearFields();
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            setErrorMessage('You must give an item name');
        }
    };

    const handleUpdate = () => {
        if (nameValue) {
            setProgress(false);
            axios
                .put('items/' + item!._id, {
                    name: nameValue,
                    periodicity: sliderValue,
                    last_maintenance: ymd(dateValue!),
                })
                .then((response) => {
                    setProgress(true);
                    setItems(items.map((itm) => (itm._id === item!._id ? response.data : itm)));
                    setHidden(true);
                    setItem(undefined);
                    clearFields();
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            setErrorMessage('You must give an item name');
        }
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
            <TextField
                label='Item Name '
                value={nameValue}
                onChange={onChangeTextNameValue}
                errorMessage={errorMessage}
                required
            />
            <Slider
                label='Periodicity'
                min={1}
                max={5}
                step={1}
                snapToStep
                value={sliderValue}
                showValue
                onChange={sliderOnChange}
            />
            <DatePicker
                className={controlClass.control}
                firstDayOfWeek={DayOfWeek.Monday}
                label='Last Maintenance'
                isRequired={true}
                value={dateValue!}
                formatDate={format}
                onSelectDate={dateOnChange}
            />
            <ProgressIndicator progressHidden={progress} />
            <DialogFooter>
                {typeof item === 'undefined' ? (
                    <PrimaryButton onClick={handleSave} text='Save' disabled={!progress} />
                ) : (
                    <PrimaryButton onClick={handleUpdate} text='Update' disabled={!progress} />
                )}
                {typeof item === 'undefined' ? (
                    <DefaultButton onClick={handleCancel} text='Cancel' disabled={!progress} />
                ) : (
                    <DefaultButton onClick={handleDelete} text='Delete' disabled={!progress} />
                )}
            </DialogFooter>
        </Dialog>
    );
};
