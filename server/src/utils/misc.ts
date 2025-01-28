

export const wait = (ms: number) =>
    new Promise(s => {
        setTimeout(s, ms);
    });