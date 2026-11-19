// Membangun index.html mandiri: src/app.html + pustaka PDF yang disisipkan (inline).
// Pakai:  npm ci && npm run build
// Opsional: SITE_URL=https://username.github.io/lembar npm run build   (mengisi og:url / og:image)
import { readFileSync, writeFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL('./node_modules/' + p, import.meta.url), 'utf8');
const libs = [
  'pdf-lib/dist/pdf-lib.min.js',
  'pdfjs-dist/build/pdf.min.js',
  'pdfjs-dist/build/pdf.worker.min.js',
  'jszip/dist/jszip.min.js',
];
const inline = libs
  .map((p) => '<script>' + read(p).replaceAll('</script', '<\\/script') + '</script>\n')
  .join('');

let html = readFileSync(new URL('./src/app.html', import.meta.url), 'utf8').replace('<!--LIBS-->', () => inline);
html = html.replaceAll('\uFFFD', '\\ufffd');

const site = (process.env.SITE_URL || '').replace(/\/+$/, '');
if (site) html = html.replaceAll('https://ALAMAT-SITUSMU/', site + '/');

writeFileSync(new URL('./index.html', import.meta.url), html);
console.log(`index.html dibangun (${(html.length / 1024).toFixed(0)} KB)` + (site ? ` untuk ${site}` : ''));
