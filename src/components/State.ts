import { atom } from "recoil";
import { ItemType } from "./model";

export const isHidden = atom({
    key: 'isHidden',
    default: true,
});

export const selectedItem = atom<ItemType | undefined>({
    key: 'selectedItem',
    default: undefined,
});

export const itemsDB = atom<ItemType[]>({
    key: 'items',
    default: [],
});