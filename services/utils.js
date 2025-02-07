
import PDFDocument from 'pdfkit';
import fs from 'fs';


export function readJsonFile(path) {
	const json = fs.readFileSync(path, 'utf8')
	const data = JSON.parse(json)
	return data
}

export function writeJsonFile(path, data) {
    const json = JSON.stringify(data, null, 4)
    return new Promise((resolve, reject) => {
        fs.writeFile(path, json, err => {
            if (err) reject(err)
            resolve()
        })
    })
}

export function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

export function makePDF(res, bugs) {  // Accept bugs array as a parameter
    const doc = new PDFDocument();
    
    res.setHeader('Content-Disposition', 'attachment; filename="bugs_report.pdf"');
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);  // Stream PDF to response

    doc.fontSize(18).text('Bugs Report', { align: 'center' });
    doc.moveDown();

    bugs.forEach(bug => {
        doc.fontSize(14).text(`Title: ${bug.title}`, { underline: true });
        doc.fontSize(12).text(`Description: ${bug.description}`);
        doc.fontSize(12).text(`Severity: ${bug.severity}`);
        doc.fontSize(12).text(`Created At: ${new Date(bug.createdAt).toLocaleString()}`);
        doc.moveDown();
    });

    doc.end();  // Finalize the PDF
}