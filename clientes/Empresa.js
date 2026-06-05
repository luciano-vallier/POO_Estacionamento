import { Cliente } from './Cliente.js';
import { TARIFAS, calcularDiferencaDias } from '../Tarifas.js';

export class Empresa extends Cliente {
    #debito;
    #inadimplente;

    constructor(documento, nome) {
        super(documento, nome);
        this.#debito = 0;
        this.#inadimplente = false;
    }

    get debito() { 
        return this.#debito; }
    set debito(valor) { this.#debito = valor; }
    
    get inadimplente() { 
        return this.#inadimplente; }
    set inadimplente(status) { this.#inadimplente = status; }

    calcularCusto(dataEntrada, dataSaida) {
        let dias = calcularDiferencaDias(dataEntrada, dataSaida);
        let custo = (dias + 1) * TARIFAS.EMPRESA_DIARIA;

        if (dias > 0) {
            // Adiciona a multa se passou da meia noite
            custo = custo + (dias * TARIFAS.EMPRESA_MULTA_MADRUGADA);
        }
        return custo;
    }
}