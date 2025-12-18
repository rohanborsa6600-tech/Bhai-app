importScripts('mapping.js');

self.onmessage = function(e) {
    const text = e.data.text;
    let result = "";
    let i = 0;
    const len = text.length;
    
    // मॅपिंग डेटा लोड करा
    const map = self.mappingData;
    const maxLen = self.maxKeyLen; // तुमची JSON फाईल असल्याने हे साधारण 5-6 असेल

    while (i < len) {
        let matched = false;
        
        // सर्वात मोठ्या की (Key) पासून सुरुवात करा (Greedy Search)
        // उदा. जर 'kaR' असेल, तर आधी 3 अक्षरे तपासा, मग 2, मग 1.
        let currentMax = Math.min(maxLen, len - i);
        
        for (let l = currentMax; l >= 1; l--) {
            let substr = text.substr(i, l); // i पासून l अक्षरे कापून घ्या
            
            if (map[substr]) {
                result += map[substr]; // सापडले! मॅप करा
                i += l; // तेवढी अक्षरे पुढे जा
                matched = true;
                break; // लूप थांबवा आणि पुढे जा
            }
        }
        
        if (!matched) {
            // जर मॅपमध्ये काहीच सापडले नाही, तर ते अक्षर जसेच्या तसे ठेवा
            result += text[i];
            i++;
        }
        
        // दर ५००० अक्षरांनंतर प्रोग्रेस अपडेट करा
        if (i % 5000 === 0) {
             self.postMessage({ type: 'progress', value: (i / len) * 100 });
        }
    }
    
    self.postMessage({ type: 'done', result: result });
};
