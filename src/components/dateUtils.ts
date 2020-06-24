export const format = (date?: Date): string => {
    return date!.getDate() + '-' + (date!.getMonth() + 1) + '-' + date!.getFullYear();
};

export const ymd = (t: Date = new Date()): string => {
    return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate();
}

export const truncateDay = (t = new Date()) => {
    return new Date(ymd(t))
}