// converter.worker.js - Background Logic
importScripts('mapping.js'); // मॅपिंग फाईल लोड करणे

self.onmessage = function(e) {
    const text = e.data.text;
    const mode = e.data.mode;
    
    let result = "";
    const totalLength = text.length;
    
    // बॅच साईज (1000 अक्षरे एका वेळी - हँग टाळण्यासाठी)
    const chunkSize = 2000; 

    // मोडनुसार फंक्शन निवडणे
    if (mode === 'S2U') {
        processS2U(text, totalLength, chunkSize);
    } else {
        processU2S(text, totalLength, chunkSize);
    }
};

// 1. Shree Lipi to Unicode Logic
function processS2U(text, total, chunkSize) {
    let result = "";
    
    for (let i = 0; i < total; i++) {
        let char = text[i];
        
        // --- वेलांटी लॉजिक (f + k -> कि) ---
        if (char === 'f') { 
            // जर 'f' आला, तर पुढचे अक्षर बघा
            if (i + 1 < total) {
                let nextChar = text[i + 1];
                let mappedNext = self.shreeMap[nextChar] || nextChar;
                result += mappedNext + "ि"; // आधी अक्षर, मग वेलांटी
                i++; // पुढचे अक्षर वापरले, म्हणून skip करा
                continue;
            }
        }
        
        // --- सामान्य मॅपिंग ---
        result += self.shreeMap[char] || char;

        // प्रोग्रेस रिपोर्ट करणे
        if (i % chunkSize === 0) {
            self.postMessage({ type: 'progress', value: (i / total) * 100 });
        }
    }
    // फायनल रिझल्ट
    self.postMessage({ type: 'done', result: result });
}

// 2. Unicode to Shree Lipi Logic
function processU2S(text, total, chunkSize) {
    let result = "";

    for (let i = 0; i < total; i++) {
        let char = text[i];

        // --- वेलांटी लॉजिक (कि -> f + k) ---
        // जर पुढचे अक्षर 'ि' असेल
        if (i + 1 < total && text[i + 1] === 'ि') {
            let mappedChar = self.unicodeMap[char] || char;
            result += "f" + mappedChar; // आधी 'f', मग अक्षर
            i++; // 'ि' वापरला, म्हणून skip करा
            continue;
        }

        // --- सामान्य मॅपिंग ---
        result += self.unicodeMap[char] || char;

        // प्रोग्रेस रिपोर्ट करणे
        if (i % chunkSize === 0) {
            self.postMessage({ type: 'progress', value: (i / total) * 100 });
        }
    }
    // फायनल रिझल्ट
    self.postMessage({ type: 'done', result: result });
}
