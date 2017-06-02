var Datasource = require('nedb'),
    estoqueDB = new Datasource({ filename: 'estoquefile', autoload: true });