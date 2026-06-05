import { Cliente } from './Cliente.js';
import { TARIFAS, calcularDiferencaDias } from '../Tarifas.js';

export class Estudante extends Cliente {
    #saldo;

    constructor(documento, nome, saldoInicial) {
        super(documento, nome);
        this.#saldo = saldoInicial;
    }

    get saldo() { 
        return this.#saldo; }
    set saldo(valor) { this.#saldo = valor; }

    adicionarPlaca(placa) {
        if (this.placas.size >= 1) { //Estudante pode ter apenas um carro
            throw new Error("Estudante só pode ter 1 placa cadastrada.");
        }
        super.adicionarPlaca(placa);
    }

    calcularCusto(dataEntrada, dataSaida) {
        let dias = calcularDiferencaDias(dataEntrada, dataSaida);
        let custo = (dias + 1) * TARIFAS.ESTUDANTE_INGRESSO;
        return custo;
    }
}