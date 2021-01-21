var Bicicleta = require('../../models/bicicleta');

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
