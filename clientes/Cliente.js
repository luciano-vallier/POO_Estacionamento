
// Classe base que representa um cliente do estacionamento.
export class Cliente {
    #documento;
    #nome;
    #placas;

    constructor(documento, nome) {
        this.#documento = documento;
        this.#nome = nome;
        this.#placas = new Set(); //set para evitar placas duplicadas
    }

    // Getters para acessar as propriedades privadas externamente de forma segura
    get documento() { 
        return this.#documento; }
    get nome() { 
        return this.#nome; }
    get placas() { 
        return this.#placas; }

    adicionarPlaca(placa) {
        this.#placas.add(placa);
    }

    removerPlaca(placa) {
        this.#placas.delete(placa);
    }

    calcularCusto(dataEntrada, dataSaida) {
        return 0;
    }
}