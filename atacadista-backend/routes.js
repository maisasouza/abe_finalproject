'use strict';

module.exports = function(app) {
    var controllers = require('./controllers');

    // todoList Routes
    app.route('/pedido')
        .post(controllers.novoPedido);

    app.route('/pedido/:id')
        .put(controllers.aceitaPedido)
        .delete(controllers.cancelaPedido)
        .patch(controllers.atualizaPedido)
        .get(controllers.getPedido);

    app.route('/pedido/:id/produtos')
        .get(controllers.getProdutosPedido);

};