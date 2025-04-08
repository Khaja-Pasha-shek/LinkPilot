const isValidURL = (str) => {
    try {
        const url = new URL(str);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
};

const isReachableURL = async (url) => {
    try {
        const res = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
        return res.ok || res.type === 'opaque'; // opaque if CORS blocks it
    } catch {
        return false;
    }
};


export { isValidURL, isReachableURL }
