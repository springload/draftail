// From http://stackoverflow.com/a/10903003/1798491.
const shortString = (s, l, reverse = false) => {
    const stopChars = [' ', '/', '&'];
    const acceptableShortness = l * 0.80; // When to start looking for stop characters
    const str = reverse ? s.split('').reverse().join('') : s;
    let ret = '';

    let i;
    for (i = 0; i < l - 1; i++) {
        ret += str[i];
        if (i >= acceptableShortness && stopChars.indexOf(str[i]) >= 0) {
            break;
        }
    }

    if (reverse) { return ret.split('').reverse().join(''); }
    return ret;
};

// From http://stackoverflow.com/a/10903003/1798491.
export const truncateURL = (url, l = 50) => {
    const chunkLength = (l / 2);
    let ret = url.replace('http://', '').replace('https://', '');

    if (url.length > l) {
        const start = shortString(ret, chunkLength, false);
        const end = shortString(ret, chunkLength, true);

        ret = `${start}…${end}`;
    }

    return ret;
};
