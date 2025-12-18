importScripts('mapping.js');

self.onmessage = function(e) {
    const { text, mode } = e.data;
    let result = "";
    let len = text.length;

    for (let i = 0; i < len; i++) {
        let code = text.charCodeAt(i);

        if (mode === 'S2U') {
            // Saral to Unicode (Direct Mapping)
            // इथे वेलांटी स्वॅप (Swap) करण्याची गरज नाही
            // कारण सरलमध्ये तुम्ही 'k' नंतर 'i' टाईप करता.
            
            let mapped = self.shreeMap[code];
            result += mapped ? mapped : text[i];
        } 
        else {
            // Unicode to Saral
            let char = text[i];
            let mappedCode = self.unicodeMap[char];
            
            if (mappedCode) {
                result += mappedCode;
            } else {
                result += char;
            }
        }

        // प्रोग्रेस अपडेट
        if (i % 5000 === 0) {
            self.postMessage({ type: 'progress', value: (i / len) * 100 });
        }
    }
    self.postMessage({ type: 'done', result: result });
};
