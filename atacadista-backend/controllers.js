'use strict';

exports.novoPedido = function(req, res) {
    res.send('Novo Pedido !');
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