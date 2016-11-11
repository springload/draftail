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

// From http://stackoverflow.com/a/5782563/1798491
export const slugify = (str) => {
    let ret = str;
    ret = ret.replace(/^\s+|\s+$/g, ''); // trim
    ret = ret.toLowerCase();

    // remove accents, swap ñ for n, etc
    const fromChars = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
    const toChars   = 'aaaaeeeeiiiioooouuuunc------';

    for (let i = 0, l = fromChars.length; i < l; i++) {
        ret = ret.replace(new RegExp(fromChars.charAt(i), 'g'), toChars.charAt(i));
    }

    ret = ret
        .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return ret;
};
