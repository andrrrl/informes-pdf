let fs = require('fs');
let scss = require('node-sass');
let path = require('path');
let pdf = require('html-pdf');

module.exports = function descargar(res) {

    // Se leen header y footer (si se le pasa un encoding, devuelve un string)
    let html = fs.readFileSync(path.join(__dirname, '../assets/informe.html'), 'utf8');
    let header = fs.readFileSync(path.join(__dirname, '../assets/includes/header.html'), 'utf8');
    let footer = fs.readFileSync(path.join(__dirname, '../assets/includes/footer.html'), 'utf8');

    html = header + html + footer;

    // Se cargan logos
    let logoEfector = fs.readFileSync(path.join(__dirname, '../assets/img/logo-efector.png'));
    let logoAdicional = fs.readFileSync(path.join(__dirname, '../assets/img/logo-adicional.png'));
    let logoAndes = fs.readFileSync(path.join(__dirname, '../assets/img/logo-andes-h.png'));
    let logoPDP = fs.readFileSync(path.join(__dirname, '../assets/img/logo-pdp.png'));
    let logoPDP2 = fs.readFileSync(path.join(__dirname, '../assets/img/logo-pdp-h.png'));

    // Firmas
    let firma1 = fs.readFileSync(path.join(__dirname, '../assets/img/firmas/firma-1.png'));
    let firma2 = fs.readFileSync(path.join(__dirname, '../assets/img/firmas/firma-2.png'));

    html = html
        .replace('<!--logoOrganizacion-->', `<img class="logo-efector" src="data:image/png;base64,${logoEfector.toString('base64')}">`)
        .replace('<!--logoAdicional-->', `<img class="logo-adicional" src="data:image/png;base64,${logoAdicional.toString('base64')}">`)
        .replace('<!--logoAndes-->', `<img class="logo-andes" src="data:image/png;base64,${logoAndes.toString('base64')}">`)
        .replace('<!--firma1-->', `<img class="logo-andes" src="data:image/png;base64,${firma1.toString('base64')}">`)
        .replace('<!--firma2-->', `<img class="logo-andes" src="data:image/png;base64,${firma2.toString('base64')}">`)
        .replace('<!--logoPDP-->', `<img class="logo-pdp" src="data:image/png;base64,${logoPDP.toString('base64')}">`)
        .replace('<!--logoPDP2-->', `<img class="logo-pdp-h" src="data:image/png;base64,${logoPDP2.toString('base64')}">`);

    // Se agregan los estilos CSS
    let scssFile = path.join(__dirname, '../assets/sass/main.scss');

    // Se agregan los estilos
    let css = '<style>\n\n';

    // SCSS => CSS
    css += scss.renderSync({
        file: scssFile,
    }).css;
    css += '</style>';
    html += css;

    // PhantomJS PDF rendering options
    // https://www.npmjs.com/package/html-pdf
    // http://phantomjs.org/api/webpage/property/paper-size.html
    const phantomPDFOptions = {
        format: 'A4',
        border: {
            // default is 0, units: mm, cm, in, px
            top: '.25cm',
            right: '0cm',
            bottom: '3cm',
            left: '0cm'
        },
        header: {
            height: '6.5cm',
        },
        footer: {
            height: '1cm',
            contents: {}
        }
    };

    // console.log(html);

    pdf.create(html, phantomPDFOptions).toFile((err2, file) => {

        console.log(file);

        if (err2) {
            res.json({
                err2: err2
            });
        }

        // res.setHeader('Content-disposition', 'attachment; filename=' + file.filenam);
        res.download(file.filename, (err3) => {
            if (err3) {
                res.json({
                    err3: err3
                });
            }
            // console.log(html);
        });
    });
}