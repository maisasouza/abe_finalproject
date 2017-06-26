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

    var validacao = validarSolicitacao(listaSolicitacao);

    if (validacao.validate === false) {
        res.status(400);
        res.send(validacao.erroMsg);
    } else {

        var pedido = {
            deliveryDate: deliveryDate,
            products: listaSolicitacao,
            status: 'Aguardando confirmação'
        };

        pedidosDB.insert(pedido, function(err, newPedido) {
            if (err !== null) {
                res.status(400);
                res.send('Erro na inserção do pedido. Por favor contate o suporte');
            } else {
                var orcamento = {
                    numero: newPedido._id,
                    dataEntrega: newPedido.deliveryDate,
                    status: newPedido.status,
                    _links: [
                        { rel: 'verPedido', href: 'http://localhost:3000/pedido/' + newPedido._id }
                    ]
                };
                res.status(200);
                res.send(orcamento);
            }
        });
    }
};

function validarSolicitacao(listaSolicitacao) {
    if (listaSolicitacao === undefined || listaSolicitacao === null || listaSolicitacao.length === 0)
        return {
            validate: false,
            erroMsg: "Não houve solicitação de nenhum item na requisição"
        };
    var returned = undefined;
    listaSolicitacao.forEach(function(element, ind, arr) {
        if (!typeof element.quantidade === 'number' || element.quantidade < 0) {
            returned = {
                validate: false,
                erroMsg: "Campo quantidade deve ser valores numéricos inteiros e positivos."
            };
        }

        if (element.codProduto !== '001' && element.codProduto !== '002' && element.codProduto !== '003') {
            returned = {
                validate: false,
                erroMsg: "Código de produto inválido. Inexistente."
            };
        }
    });

    if (returned !== undefined) {
        return returned;
    } else {
        return { validate: true };
    }
};

exports.aceitaPedido = function(req, res) {
    pedidosDB.find({ '_id': req.params.id }, function(err, pedidos) {
        if (pedidos.length > 0) {
            var pedido = pedidos[0];
            if (pedido.status === 'Aguardando confirmação') {
                pedidosDB.update({ _id: req.params.id }, { $set: { status: 'Solicitado' } }, {}, function(err, numReg) {
                    if (numReg > 0) {
                        res.status(200);
                        res.send({
                            numero: pedido._id,
                            status: 'Solicitado',
                            dataEntrega: pedido.deliveryDate
                        });
                    }
                });
            } else {
                res.status(400);
                res.send('Aceita-se apenas pedidos de status Aguardando confirmação.');
            }
        } else {
            res.status(400);
            res.send('Pedido não encontrado.');
        }
    });
};

exports.cancelaPedido = function(req, res) {
    pedidosDB.find({ '_id': req.params.id }, function(err, pedidos) {
        if (pedidos.length > 0) {
            var pedido = pedidos[0];
            if (pedido.status === 'Aguardando confirmação') {
                pedidosDB.update({ _id: req.params.id }, { $set: { status: 'Cancelado' } }, {}, function(err, numReg) {
                    if (numReg > 0) {
                        res.status(200);
                        res.send({
                            numero: pedido._id,
                            status: 'Cancelado',
                            dataEntrega: pedido.deliveryDate
                        });
                    }
                });
            } else {
                res.status(400);
                res.send('Só é possivel cancelar pedidos de status Aguardando confirmação.');
            }
        } else {
            res.status(400);
            res.send('Pedido não encontrado.');
        }
    });
};

exports.atualizaPedido = function(req, res) {
    var id = req.params.id,
        novoStatus = req.query.novoStatus;

    if (novoStatus !== 'Aguardando confirmação' && novoStatus !== 'Solicitado' && novoStatus !== 'Cancelado' &&
        novoStatus !== 'Em fabricação' && novoStatus !== 'Despachado' && novoStatus !== 'Finalizado') {
        res.status(400);
        res.send('Status inválido.');
    } else {
        pedidosDB.update({ _id: id }, { $set: { status: novoStatus } }, {}, function(err, numReg) {
            if (numReg > 0) {
                res.status(200);
                res.send('Pedido atualizado com sucesso !');
            } else {
                res.status(400);
                res.send('Pedido não encontrado.');
            }
        });
    }
};

exports.getPedido = function(req, res) {
    pedidosDB.find({ '_id': req.params.id }, function(err, pedidos) {
        if (err !== null || pedidos.length === 0) {
            res.status(400);
            res.send('Pedido não encontrado.');
        } else {
            var retorno = {
                numero: pedidos[0]._id,
                dataEntrega: pedidos[0].deliveryDate,
                status: pedidos[0].status
            };
            res.status(200);
            res.send(retorno);
        }
    });
};

exports.getProdutosPedido = function(req, res) {
    pedidosDB.findOne({ '_id': req.params.id }, function(err, pedido) {
        if (err != null) {
            res.status(400);
            res.send('Erro ao encontrar o pedido.');
        } else if (pedido === undefined || pedido == null) {
            res.status(400);
            res.send('Pedido não encontrado');
        } else {
            res.status(200);
            res.send(pedido.products);
        }
    });
};