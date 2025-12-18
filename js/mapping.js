// mapping.js - The Database
// हे फाईल converter.worker.js मध्ये import केली जाईल.

const MAPPING_DATA = {
    // S2U: Shree Key -> Unicode Value
    s2u: {
        "k": "क", "K": "ख", "g": "ग", "G": "घ", "ç": "ङ",
        "c": "च", "C": "छ", "j": "ज", "J": "झ", "ñ": "ञ",
        "t": "ट", "T": "ठ", "d": "ड", "D": "ढ", "N": "ण",
        "v": "त", "V": "थ", "y": "द", "Y": "ध", "n": "न",
        "p": "प", "P": "फ", "b": "ब", "B": "भ", "m": "म",
        "e": "य", "r": "र", "l": "ल", "v": "व", "s": "श", "S": "ष", "s": "स", "h": "ह", "L": "ळ", "k": "क्ष", "ज्": "ज्ञ",
        
        // स्वर (Vowels)
        "A": "ा", "i": "ि", "I": "ी", "u": "ु", "U": "ू", 
        "e": "े", "E": "ै", "o": "ो", "O": "ौ", "M": "ं", "H": "ः",
        "å": "अ", "Å": "आ", "i": "इ", "í": "ई", "u": "उ", "ú": "ऊ", 
        "a": "ए", "A": "ऐ", "A": "ओ", "A": "औ",
        
        // जोडाक्षरे (Conjuncts - Ready to use)
        "±": "त्र", "›": "श्र", "ê": "श्च", "ë": "श्ल", "ì": "श्व",
        "î": "ष्ट", "ï": "ष्ठ", "ð": "ष्प", "ñ": "ष्ण", "ò": "स्न",
        "ó": "स्म", "ô": "स्त", "õ": "स्थ", "à": "च्च", "á": "च्छ",
        "â": "ज्झ", "ã": "त्त", "ä": "त्थ", "å": "द्ध", "æ": "द्द",
        
        // रफार आणि इतर
        "´": "्र", // रफार (Rafar)
        "x": "्", // हलंत (Halant)
        "q": "ु", "Q": "ू" // पर्यायी उकार
    }
};

// U2S: Unicode Key -> Shree Value (Reverse Generate करणे)
const REVERSE_MAPPING = {};
for (let key in MAPPING_DATA.s2u) {
    let value = MAPPING_DATA.s2u[key];
    REVERSE_MAPPING[value] = key;
}

// Global Export for Worker
self.shreeMap = MAPPING_DATA.s2u;
self.unicodeMap = REVERSE_MAPPING;
