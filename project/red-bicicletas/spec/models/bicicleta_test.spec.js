// Referencia a mongoose
var mongoose = require('mongoose');
// Referencia al modelo bicicleta
var Bicicleta = require('../../models/bicicleta');

describe('Testing Bicicletas', function(){
    beforeEach(function(done) {
        var mongoDB = 'mongodb://localhost/testdb';
        mongoose.connect(mongoDB, { useNewUrlParser: true });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function() {
            console.log('we are connected to test database!');
            done();
        });
    });

    afterEach(function(done) {
        Bicicleta.deleteMany({}, function(err, success){
            if (err) console.log(err);
            mongoose.disconnect(err);
            done();
        });
    });


    // Primer test que crearemos entonces vamos hacer el de crear una instancia
    describe('Bicicleta.createInstance', () => {
        it('crea una instancia de Bicicleta', () => {
            var bici = Bicicleta.createInstance(1, "verde", "urbana", [-34.5, -54.1]);

            expect(bici.code).toBe(1);
            expect(bici.color).toBe("verde");
            expect(bici.modelo).toBe("urbana");
            expect(bici.ubicacion[0]).toEqual(-34.5);
            expect(bici.ubicacion[1]).toEqual(-54.1);
        });
    });

    // Todas las bicicletas
    describe('Bicicleta.allBicis', () => {
        it('comienza vacia', (done) => {
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(0);
                done();
            });
        });
    });

    // Add
    describe('Bicicleta.add', () => {
        it('agrega solo una bici', (done) => {
            var aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
            Bicicleta.add(aBici, function(err, newBici){
                if (err) console.log(err);
                Bicicleta.allBicis(function(err, bicis){
                    expect(bicis.length).toEqual(1);
                    expect(bicis[0].code).toEqual(aBici.code);

                    done();
                });
            });
        });
    });

    //find by Code
    describe('Bicicleta.findByCode', () => {
        it('debe devolver la bici con code 1', (done) => {
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(0);

                var aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
                Bicicleta.add(aBici, function(err, newBici){
                    if (err) console.log(err);

                    var aBici2 = new Bicicleta({code: 2, color: "roja", modelo: "urbana"});
                    Bicicleta.add(aBici2, function(err, newBici){
                        if (err) console.log(err);
                        Bicicleta.findByCode(1, function (error, targetBici){
                            expect(targetBici.code).toBe(aBici.code);
                            expect(targetBici.color).toBe(aBici.color);
                            expect(targetBici.modelo).toBe(aBici.modelo);

                            done();
                        });
                    });
                });
            });
        });
    });

});






/*
// Con el metodo beforeEach le decimos que antes de cada test ( en este caso allBicis este vacio)
beforeEach(() => { Bicicleta.allBicis = []; });

// Testeamos que la lista de bicicletas comienza en 0
describe('Bicicleta.allBicis', () => {
    it('comienza vacia', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});

// Testeamos el add
describe('Bicicleta.add', () => {
    it('agregamos una', () => {
        // Estado previo
        expect(Bicicleta.allBicis.length).toBe(0);

        // Creamos la Bicicleta
        var a = new Bicicleta(1, 'rojo', 'urbana', [-34.6012424,-58.3861497]);
        // Agregamos la Bicicleta
        Bicicleta.add(a);

        // Estado posterior
        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0]).toBe(a);
    });
});

// Testeamos el find by
describe('Bicicleta.findById', () => {
    it('debe devolver la bici con id 1', () => {
        // Estado previo desde 0
        expect(Bicicleta.allBicis.length).toBe(0);
        // Creamos dos bicicletas
        var aBici = new Bicicleta(1, 'verde', 'urbana');
        var aBici2 = new Bicicleta(2, 'rojo', 'montaña');
        Bicicleta.add(aBici);
        Bicicleta.add(aBici2);
        // Usamos el metodo findById
        var targetBici = Bicicleta.findById(1);
        expect(targetBici.id).toBe(1);
        expect(targetBici.color).toBe(aBici.color);
        expect(targetBici.modelo).toBe(aBici.modelo);
    });
});

// Testeamos el remove
describe('Bicicleta.removeById', () => {
    it('debe borrar la bici 1', () => {
        // Estado previo desde 0
        expect(Bicicleta.allBicis.length).toBe(0);
        // Creamos la bicicleta
        var aBici = new Bicicleta(1, 'verde', 'urbana');
        Bicicleta.add(aBici);
        // Usamos el metodo remove
        var targetBici = Bicicleta.findById(1);
        expect(targetBici.id).toBe(1);
        var removeBici = Bicicleta.removeById(1);
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});
*/
