import { Cliente } from './Cliente.js';

export class Professor extends Cliente {
    constructor(documento, nome) {
        super(documento, nome);
    }

    adicionarPlaca(placa) {
        if (this.placas.size >= 2) {    // Professores podem cadastrar no máximo 2 veículos
            throw new Error(`Professor ${this.nome} já atingiu o limite de 2 placas.`);
        }
        super.adicionarPlaca(placa);
    }

    calcularCusto(dataEntrada, dataSaida) {
        return 0; 
    }
}