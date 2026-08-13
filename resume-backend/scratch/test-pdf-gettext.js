const { PDFParse } = require('pdf-parse');
async function test() {
    try {
        const parser = new PDFParse({ data: Buffer.from('%PDF-1.4...') });
        const data = await parser.getText();
        console.log("getText result:", data);
    } catch (err) {
        console.error("Error during getText:", err.message);
    }
}
test();
