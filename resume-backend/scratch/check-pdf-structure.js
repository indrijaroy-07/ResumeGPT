const { PDFParse } = require('pdf-parse');
const fs = require('fs');

async function checkStructure() {
    try {
        // Create a minimal valid PDF buffer if possible, or just mock it
        const parser = new PDFParse({ data: Buffer.from('%PDF-1.4...') });
        const data = await parser.getText().catch(e => ({ error: e.message }));
        console.log("Data structure keys:", Object.keys(data));
        console.log("Data sample:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error:", err.message);
    }
}
checkStructure();
