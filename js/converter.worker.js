importScripts('mapping.js');

self.onmessage = function(e) {
    const text = e.data.text;
    const chunkSize = 5000; // ५००० अक्षरे एका वेळी (हँग होऊ नये म्हणून)
    let result = "";
    
    for (let i = 0; i < text.length; i += chunkSize) {
        let chunk = text.substring(i, i + chunkSize);
        result += convertLogic(chunk);
        
        // प्रोग्रेस दाखवण्यासाठी
        self.postMessage({ type: 'progress', value: (i / text.length) * 100 });
    }
    
    self.postMessage({ type: 'done', result: result });
};

function convertLogic(text) {
    let modified_substring = text;
    
    // १. तुमच्या जुन्या कोडमधील Array Replacement लॉजिक
    const array_one = self.unicodeList; // क, ख...
    const array_two = self.shreeList;   // k, K...
    
    // लूप उलट फिरवणे (Longest match first - तुमच्या कोडनुसार)
    for (let i = 0; i < array_two.length; i++) {
        // साधे replace न वापरता, global replace करण्यासाठी split/join वापरू
        // (हे तुमच्या replaceAll लॉजिकसारखे काम करेल)
        if (modified_substring.includes(array_two[i])) {
            modified_substring = modified_substring.split(array_two[i]).join(array_one[i]);
        }
    }

    // २. रफार (Reph) लॉजिक - हे तुमच्या 'convert.js' मधून घेतले आहे
    // © (Code for Reph) शोधून त्याला अक्षराच्या मागे (र्) नेणे.
    
    const matras = "ािीुूृेैोौंःँॅ"; // मात्रांची यादी
    let position_of_reph = modified_substring.indexOf("©");

    while (position_of_reph > 0) {
        let probable_position = position_of_reph - 1;
        
        // जर अलीकडे मात्रा असेल, तर अजून मागे जा
        while (probable_position >= 0 && matras.includes(modified_substring.charAt(probable_position))) {
            probable_position--;
        }

        if (probable_position < 0) probable_position = 0;

        let part_to_move = modified_substring.substring(probable_position, position_of_reph);
        
        // रफार (©) काढून टाका आणि 'र्' जोडा
        modified_substring = 
            modified_substring.substring(0, probable_position) + 
            "र्" + part_to_move + 
            modified_substring.substring(position_of_reph + 1);

        position_of_reph = modified_substring.indexOf("©", position_of_reph + 1);
    }

    // ३. वेलांटी लॉजिक (f -> ि)
    // Shree Lipi: f + क = कि -> Unicode: क + ि = कि
    // हे लॉजिक सर्वात शेवटी रन करणे सुरक्षित आहे.
    
    let chars = modified_substring.split('');
    for (let i = 0; i < chars.length; i++) {
        if (chars[i] === 'f') { // f म्हणजे वेलांटी
             if (i + 1 < chars.length) {
                 let nextChar = chars[i+1];
                 // अदलाबदल (Swap)
                 chars[i] = nextChar;
                 chars[i+1] = "ि";
                 i++; 
             }
        }
    }

    return chars.join('');
}
