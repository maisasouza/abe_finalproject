var request = require("request"),
    lojista = require('../index.js');

var atacadistaBaseUrl = 'http://localhost:8000';

describe("Teste API Atacadista", function() {
    it("para solicitar um pedido", function() {
        var bodyResponse = undefined;
        request.post({
            headers: { 'content-type': 'application/json' },
            url: atacadistaBaseUrl + '/atualizacaoPedido',
            json: {
                numero: 123,
                dataEntrega: '07/07/2017',
                status: 'Solicitado'
            }
        }, function(error, response, body) {
            bodyResponse = body;
            /*lojista.closeServer();*/
        });

        waitsFor(function() {
            return bodyResponse !== undefined;
        }, 'esperando a resposta da chamada async.', 1000);

        runs(function() {
            expect(bodyResponse).toEqual('Atualização de status recebida com sucesso !');
            done();
            lojista.closeServer();
        });
    });
});