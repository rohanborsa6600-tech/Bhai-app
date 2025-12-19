// logic.js - Core ShreeLipi to Unicode Logic

// तुमचे मॅपिंग arrays
const array_shreelipi = [
  'u', 'ª', '}', 'n', 'p', 'H', '·', 'I', '»', 'J', '½', 'K',
  'M', 'À', 'N', 'µO', 'O', 'µÁ', 'Á', 'P', 'Q', 'R', '¶S', 'S',
  '¶T', 'T', 'U', 'Ê', 'W', 'Ï', 'V', 'Ë', 'Y', 'Ü', 'X', 'Z',
  'Ý', '\\', 'â', '[', 'ß', '^', 'ä', ']', 'ã', '_', 'å', '`',
  'a', 'c', 'ë', 'd', 'ì', 'e', 'û', 'í', 'f', 'î', 'g', 'ñ',
  'h', 'j', 'ú', 'k', 'Ô', 'Û', 'Ú', 'à', 'Þ', 'Q­', 'º$', 'Ì',
  'Ð', 'Õ', 'l', 'Îm', '¸', '„', 'ˆ', 'œ', 'Å', 'Am¡', 'Am{',
  'Am|', 'Am', 'A', 'B©', 'B', 'C', 'D', 'E{', 'E', 'F', 'm°',
  'm{', 'm|', '{', '|', 'm¡', 'm¢', '¡', '¢', 'm', 'r', 's',
  't', 'w', 'þ', 'y', '§', '±', '•', '¥', '²', 'Ñ', '«', 'é',
  'ê', '&', '$', '>', 'µ'
];

const array_unicode = [
  '©', '©ं', '{©', 'o', 'o', "क", 'क्‌', "ख", 'ख्‌', "ग", 'ग्', "घ",
  'च', 'च्‌', 'छ', 'ज़', 'ज', 'ज़्‌', 'ज्‌', 'झ', "ट", "ठ", 'ड़', "ड",
  'ढ़', 'ढ', "ण", 'ण्', "थ", 'थ्', "त", 'त्', "ध", 'ध्', "द", "न",
  'न्', "फ", 'फ्‌', "प", 'प्‌', "भ", 'भ्', "ब", 'ब्‌', "म", 'म्',
  "य", "र", "ल", 'ल्‌', "व", 'व्‌', "श", 'श्', 'श्', 'ष', 'ष्‌',
  "स", 'स्', "ह", 'क्ष', 'क्ष्', 'ज्ञ', 'द्द', 'द्व', 'द्य', 'प्र',
  'न्न', 'ट्र', 'क्त', 'त्र', 'द्र', 'द्ध', 'श्र', 'त्त', 'क्क',
  'ल्ल', 'ह्व', 'श्व', 'ट्ट', 'औ', 'ओ', 'ओं', 'आ', 'अ', 'ई', 'इ',
  'उ', 'ऊ', 'ऐ', 'ए', 'ऋ', 'ॉ', "ो", "ों", "े", "ें", "ौ", "ौं",
  "ै", 'ैं', "ा", "ी", "ी", "ीं", "ु", 'ु', "ू", 'ं', 'ँ', 'ः',
  'ृ', '्‌', 'दृ', '्र', 'रु', 'रू', '।', '', '', ''
];

// हे फंक्शन फक्त टेक्स्ट इनपुट घेते आणि टेक्स्ट आउटपुट देते
function convertShreeLipiToUnicode(text) {
    if (!text) return "";
    let modified = text;

    // 1. Basic Mapping
    for (let i = 0; i < array_shreelipi.length; i++) {
        if (array_shreelipi[i] && array_unicode[i]) {
            // ग्लोबल रिप्लेसमेंटसाठी split/join वापरले आहे
            modified = modified.split(array_shreelipi[i]).join(array_unicode[i]);
        }
    }

    // 2. 'i' Matra Fix (o -> ि)
    let pos_i = modified.indexOf("o");
    while (pos_i !== -1) {
        let char_next = modified.charAt(pos_i + 1);
        modified = modified.replace("o" + char_next, char_next + "ि");
        pos_i = modified.indexOf("o", pos_i + 1);
    }

    // 3. 'i' Matra on Halant Fix
    let pos_wrong = modified.indexOf("ि्");
    while (pos_wrong !== -1) {
        let cons = modified.charAt(pos_wrong + 2);
        modified = modified.replace("ि्" + cons, "्" + cons + "ि");
        pos_wrong = modified.indexOf("ि्", pos_wrong + 2);
    }

    // 4. 'q' Logic Fix
    let pos_q = modified.indexOf("q");
    while (pos_q !== -1) {
        let char_next = modified.charAt(pos_q + 1);
        modified = modified.replace("q" + char_next, char_next + "o");
        pos_q = modified.indexOf("q", pos_q + 1);
    }

    // 5. 'o' + Halant Fix
    let pos_o_halant = modified.indexOf("o्");
    while (pos_o_halant !== -1) {
        let cons = modified.charAt(pos_o_halant + 2);
        modified = modified.replace("o्" + cons, "्" + cons + "िं");
        pos_o_halant = modified.indexOf("o्", pos_o_halant + 3);
    }

    // Cleanup leftover 'o'
    modified = modified.replace(/o/g, "िं");

    // 6. Reph (Rafar) Fix
    const matras = "ािीुूृेैोौंःँॅ";
    let pos_reph = modified.indexOf("©");
    
    while (pos_reph > 0) {
        let prob_pos = pos_reph - 1;
        let char_at = modified.charAt(prob_pos);

        while (matras.includes(char_at)) {
            prob_pos--;
            char_at = modified.charAt(prob_pos);
        }

        let chunk = modified.substring(prob_pos, pos_reph);
        let before = modified.substring(0, prob_pos);
        let after = modified.substring(pos_reph + 1);
        
        modified = before + "र्" + chunk + after;
        pos_reph = modified.indexOf("©", prob_pos + chunk.length + 1);
    }

    return modified;
}
