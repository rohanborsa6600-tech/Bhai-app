importScripts('mapping.js');

self.onmessage = function(e) {
    const { text, mode } = e.data;
    let result = "";
    let len = text.length;

    for (let i = 0; i < len; i++) {
        // अक्षराचा कोड मिळवणे
        let code = text.charCodeAt(i);
        
        if (mode === 'S2U') {
            // १. पहिली वेलांटी स्वॅप (f चा कोड १०२ आहे)
            if (code === 102) { 
                let nextCode = text.charCodeAt(i+1);
                let mappedNext = self.shreeMap[nextCode] || String.fromCharCode(nextCode);
                result += mappedNext + "ि"; 
                i++;
                continue;
            }
            result += self.shreeMap[code] || text[i];
        } 
        else {
            // २. Unicode ते Shree रिव्हर्स लॉजिक
            let char = text[i];
            if (i + 1 < len && text[i+1] === "ि") {
                let mappedCode = self.unicodeMap[char];
                result += "f" + (mappedCode ? String.fromCharCode(mappedCode) : char);
                i++;
                continue;
            }
            let mappedCode = self.unicodeMap[char];
            result += mappedCode ? String.fromCharCode(mappedCode) : char;
        }

        // प्रोग्रेस रिपोर्ट (दर ५००० अक्षरांनंतर)
        if (i % 5000 === 0) {
            self.postMessage({ type: 'progress', value: (i / len) * 100 });
        }
    }
    self.postMessage({ type: 'done', result: result });
};
