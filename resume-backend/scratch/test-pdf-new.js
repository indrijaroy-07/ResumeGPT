const { PDFParse } = require('pdf-parse');
try {
    const parser = new PDFParse({ data: Buffer.from('%PDF-1.4...') });
    console.log("Parser created:", typeof parser);
    console.log("getText exists:", typeof parser.getText);
} catch (err) {
    console.error("Error creating parser:", err.message);
}
