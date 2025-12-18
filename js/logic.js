// logic.js - Main Controller
let worker;

function startConversion() {
    const fileInput = document.getElementById('fileInput');
    const mode = document.getElementById('mode').value;
    const btn = document.getElementById('convertBtn');

    if (fileInput.files.length === 0) {
        alert("कृपया आधी फाईल निवडा!");
        return;
    }

    const file = fileInput.files[0];
    
    // UI अपडेट करा
    btn.disabled = true;
    btn.innerText = "प्रोसेसिंग सुरू आहे...";
    document.getElementById('progress-area').style.display = 'block';
    updateProgress(0, "फाईल वाचत आहे...");

    const reader = new FileReader();
    
    reader.onload = function(e) {
        const textContent = e.target.result;

        // जुना Worker असेल तर बंद करा
        if (worker) worker.terminate();

        // नवीन Worker सुरू करा
        worker = new Worker('js/converter.worker.js');

        // Worker ला डेटा पाठवा
        worker.postMessage({
            text: textContent,
            mode: mode
        });

        // Worker कडून मेसेज स्वीकारा
        worker.onmessage = function(e) {
            const data = e.data;

            if (data.type === 'progress') {
                updateProgress(data.value, `कन्व्हर्ट होत आहे: ${Math.round(data.value)}%`);
            } 
            else if (data.type === 'done') {
                updateProgress(100, "पूर्ण झाले! फाईल डाऊनलोड होत आहे...");
                downloadFile(data.result, file.name, mode);
                btn.disabled = false;
                btn.innerText = "Convert File";
            }
        };
        
        worker.onerror = function(err) {
            console.error(err);
            alert("काहीतरी चूक झाली. पुन्हा प्रयत्न करा.");
            btn.disabled = false;
        };
    };

    reader.readAsText(file);
}

function updateProgress(percent, text) {
    document.getElementById('progressBar').style.width = percent + "%";
    document.getElementById('status-text').innerText = text;
}

function downloadFile(content, originalName, mode) {
    // फाईलचे नाव ठरवणे
    const prefix = mode === "S2U" ? "Unicode_" : "Shree_";
    const fileName = prefix + originalName;

    // फाईल बनवणे
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    
    // ऑटोमॅटिक क्लिक करणे
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
