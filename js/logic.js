// logic.js - Connecting everything together
const legacyInput = document.getElementById('legacy_text');
const unicodeOutput = document.getElementById('unicode_text');
const convertBtn = document.getElementById('convert_btn');
const copyBtn = document.getElementById('copy_btn');
const statusText = document.getElementById('status');
const fileInput = document.getElementById('file_input');

let worker;

// Worker सुरू करणे
function initWorker() {
    if (worker) worker.terminate();
    worker = new Worker('js/converter.worker.js'); // वर्करची लिंक
    
    worker.onmessage = function(e) {
        const data = e.data;
        if (data.type === 'progress') {
            statusText.innerText = `Processing... ${Math.round(data.value)}%`;
        } else if (data.type === 'done') {
            unicodeOutput.value = data.result;
            statusText.innerText = "Conversion Successful! ✅";
            convertBtn.disabled = false;
            convertBtn.innerText = "Convert Now";
        }
    };

    worker.onerror = function(err) {
        console.error(err);
        statusText.innerText = "Error in processing!";
        convertBtn.disabled = false;
    };
}

// --- फाईल अपलोड हँडलर ---
fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    statusText.innerText = "Reading file...";
    legacyInput.value = ""; // जुना डेटा साफ करा

    // 1. जर Word (.docx) फाईल असेल
    if (file.name.endsWith('.docx')) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const arrayBuffer = event.target.result;
            
            // Mammoth वापरून मजकूर काढणे
            mammoth.extractRawText({arrayBuffer: arrayBuffer})
                .then(function(result) {
                    legacyInput.value = result.value;
                    statusText.innerText = "Word File Loaded! Ready to Convert.";
                })
                .catch(function(err) {
                    console.log(err);
                    statusText.innerText = "Error: Word file is corrupted or protected.";
                });
        };
        reader.readAsArrayBuffer(file);
    } 
    // 2. जर Text (.txt) फाईल असेल
    else {
        const reader = new FileReader();
        reader.onload = function(event) {
            legacyInput.value = event.target.result;
            statusText.innerText = "Text File Loaded! Ready to Convert.";
        };
        reader.readAsText(file);
    }
});

// --- कन्व्हर्ट बटण ---
convertBtn.addEventListener('click', () => {
    const text = legacyInput.value;
    if (!text) { 
        alert("Please enter text or upload a file first!"); 
        return; 
    }

    convertBtn.disabled = true;
    convertBtn.innerText = "Working...";
    statusText.innerText = "Starting conversion engine...";
    
    if (!worker) initWorker();
    
    // वर्करला डेटा पाठवा
    worker.postMessage({ text: text });
});

// --- कॉपी बटण ---
copyBtn.addEventListener('click', () => {
    if (!unicodeOutput.value) return;
    navigator.clipboard.writeText(unicodeOutput.value).then(() => {
        statusText.innerText = "Copied to Clipboard! 📋";
        setTimeout(() => statusText.innerText = "Done! ✅", 2000);
    });
});

// सुरुवातीलाच वर्कर रेडी ठेवा
initWorker();
