// converter.worker.js - Advanced Logic Engine
importScripts('mapping.js');

self.onmessage = function(e) {
    const text = e.data.text;
    const mode = e.data.mode;
    
    // मोठी फाईल असल्यास ब्राउझर हँग होऊ नये म्हणून आपण ती एकाच वेळी 
    // मेमरीमध्ये न घेता लाइन-बाय-लाइन प्रोसेस करू शकतो, 
    // पण सध्या Worker असल्यामुळे डायरेक्ट प्रोसेस केली तरी चालेल.
    
    let result = "";
    if (mode === 'S2U') {
        result = convertShreeToUnicode(text);
    } else {
        result = convertUnicodeToShree(text);
    }

    self.postMessage({ type: 'done', result: result });
};

// ----------------------------------------------------
// लॉजिक १: श्री-लिपी ते युनिकोड (Shree -> Unicode)
// ----------------------------------------------------
function convertShreeToUnicode(text) {
    let res = "";
    let len = text.length;

    for (let i = 0; i < len; i++) {
        let char = text[i];

        // --- रूल १: पहिली वेलांटी (f) ---
        // श्री-लिपीत वेलांटी (f) अक्षराच्या आधी येते, युनिकोडमध्ये नंतर.
        // लॉजिक: जर 'f' दिसला, तर तो रिझल्टमध्ये न टाकता, पुढचं अक्षर आधी घ्या, मग वेलांटी लावा.
        if (char === 'f') {
            if (i + 1 < len) {
                let nextChar = text[i+1];
                
                // पुढचे अक्षर जर जोडाक्षर असेल (उदा. f + k + x + t = क्ति)
                // तर हे लॉजिक आणखी कॉम्प्लेक्स होते, पण साध्या अक्षरांसाठी:
                let mappedNext = self.shreeMap[nextChar] || nextChar;
                res += mappedNext + "ि"; 
                i++; // पुढचे अक्षर वापरले, म्हणून स्किप करा
                continue;
            }
        }

        // --- रूल २: रफार (Rafar) ---
        // श्री-लिपीच्या काही फॉन्ट्समध्ये रफार (´) अक्षराच्या नंतर येतो.
        // युनिकोडमध्ये 'र्' + अक्षर असे लिहावे लागते. 
        // SHREE708 मध्ये साधारणपणे रफार हा स्पेशल कॅरेक्टर म्हणून येतो.

        // --- रूल ३: सामान्य मॅपिंग ---
        let mapped = self.shreeMap[char];
        if (mapped) {
            res += mapped;
        } else {
            // जर मॅपमध्ये अक्षर सापडले नाही (उदा. English words), तर ते तसेच ठेवा.
            res += char;
        }
    }
    return res;
}

// ----------------------------------------------------
// लॉजिक २: युनिकोड ते श्री-लिपी (Unicode -> Shree)
// ----------------------------------------------------
function convertUnicodeToShree(text) {
    let res = "";
    let len = text.length;

    for (let i = 0; i < len; i++) {
        let char = text[i];

        // --- रूल १: पहिली वेलांटी (Reverse) ---
        // युनिकोड: क + ि -> श्री: f + k
        if (i + 1 < len && text[i+1] === 'ि') {
            let mappedChar = self.unicodeMap[char] || char;
            res += "f" + mappedChar;
            i++; // 'ि' वापरला म्हणून स्किप करा
            continue;
        }

        let mapped = self.unicodeMap[char];
        res += mapped ? mapped : char;
    }
    return res;
}
