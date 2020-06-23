export const format = (date?: Date): string => {
    const [yyyy, mm, dd] = date!.toISOString().split(/[^\d]/);
    return `${dd}-${mm}-${yyyy}`;
};

export const ymd = (t: Date = new Date()): string => {
    return t.toISOString().slice(0, 10)
}

export const truncateDay = (t = new Date()) => {
    return new Date(ymd(t))
}

export const getYear = (date: string): number => {
    return Number(date.split('-')[0]);
};