'use strict';

var Datasource = require('nedb'),
    estoqueDB = new Datasource({ filename: 'estoquefile', autoload: true }),
    pedidosDB = new Datasource({ filename: 'pedidosfile', autoload: true });

exports.novoPedido = function(req, res) {
    // cod, qtd, obs
    var listaSolicitacao = req.body,
        deliveryDate = new Date();

    deliveryDate.setDate(deliveryDate.getDate() + 10);
    deliveryDate.setUTCHours(0, 0, 0);

    var pedido = {
        deliveryDate: deliveryDate,
        products: listaSolicitacao,
        status: 'Aguardando confirmação'
    };

    pedidosDB.insert(pedido, function(err, newPedido) {
        if (err !== null) {
            console.log('Deu erro na inserção');
        } else {
            var orcamento = {
                codPedido: newPedido._id,
                dtEntrega: newPedido.deliveryDate,
                status: newPedido.status
            };

            res.send(orcamento);
        }
    });
};

exports.aceitaPedido = function(req, res) {
    res.send('Aceita pedido !');
};

exports.cancelaPedido = function(req, res) {
    res.send('cancela pedido !');
};

exports.atualizaPedido = function(req, res) {
    res.send('atualiza pedido !');
};

exports.getPedido = function(req, res) {
    res.send('get pedido !');
};

exports.getProdutosPedido = function(req, res) {
    res.send('get Produtos pedido !');
};