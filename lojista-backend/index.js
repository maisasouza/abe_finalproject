'use strict';
var express = require('express'),
    cors = require('cors'),
    bodyparser = require('body-parser'),
    server = express();

server.use(cors());
server.use(bodyparser.json());
server.use(bodyparser.urlencoded({ extended: true }));

server.listen(8000);

console.log('API Lojista listening to port 8000...');

server.route('/atualizacaoPedido')
    .post(function(req, res) {
        var pedidoAtualizado = req.body;

        console.log('APP LOJISTA - Recebida notificação de atualização de pedido:');
        console.log('APP LOJISTA - Pedido de numero: ' + pedidoAtualizado.numero + ' atualizado para o status: ' + pedidoAtualizado.status);

        res.status(200);
        res.send('Atualização de status recebida com sucesso !');
    });

exports.closeServer = function() {
    server.close();
};