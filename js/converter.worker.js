importScripts('mapping.js');

self.onmessage = function(e) {
    const text = e.data.text;
    let result = "";
    let i = 0;
    const len = text.length;
    
    const map = self.mappingData;
    const maxK = self.maxKeyLen;

    while (i < len) {
        let matched = false;
        
        // Greedy Search: मोठी जोडी आधी शोधा
        let checkLimit = Math.min(maxK, len - i);
        
        for (let l = checkLimit; l >= 1; l--) {
            let substr = text.substr(i, l);
            
            if (map[substr]) {
                result += map[substr];
                i += l; 
                matched = true;
                break; 
            }
        }
        
        if (!matched) {
            result += text[i];
            i++;
        }

        // प्रोग्रेस रिपोर्ट
        if (i % 5000 === 0) {
            self.postMessage({ type: 'progress', value: (i / len) * 100 });
        }
    }
    self.postMessage({ type: 'done', result: result });
};
