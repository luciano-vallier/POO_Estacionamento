import { TicketEstacionamento } from './TicketEstacionamento.js';
import { TARIFAS, calcularDiferencaDias, calcularDiferencaHoras } from './Tarifas.js';
import { Professor } from './clientes/Professor.js';
import { Estudante } from './clientes/Estudante.js';
import { Empresa } from './clientes/Empresa.js';

export class RegistroDeEntradas_E_Saidas {
    #cadastro;
    #capacidadeTotal;
    #veiculosEstacionados;
    #veiculosBloqueados;
    #historicoTickets;
    

    constructor(cadastroClientes) {
        this.#cadastro = cadastroClientes;
        this.#capacidadeTotal = 9000;
        this.#veiculosEstacionados = new Map();
        this.#veiculosBloqueados = new Set();
        this.#historicoTickets = [];
    }

    get veiculosEstacionados() { 
        return this.#veiculosEstacionados; 
    }
    get historicoTickets() { 
        return this.#historicoTickets; 
    }
    get veiculosBloqueados() { 
        return this.#veiculosBloqueados; 
    }

    registrarEntrada(placa, dataHora) {
        if (this.#veiculosEstacionados.has(placa)) {
            throw new Error("Veículo já está no estacionamento.");
        }

        let cliente = this.#cadastro.obterClientePorPlaca(placa);
        let tipoCliente = "Avulso";

        // Se encontra o cliente no cadastro
        if (cliente != null) {
            
            // Verifica se o cliente é um professor
            if (cliente instanceof Professor) {
                tipoCliente = "Professor";
                
                // Percorre as placas do professor para ver se alguma já está lá dentro
                for (let placaDoProfessor of cliente.placas) {
                    if (this.#veiculosEstacionados.has(placaDoProfessor)) {
                        throw new Error("Professor já tem um carro estacionado.");
                    }
                }
            } 
            // Verifica se o cliente é um estudante
            else if (cliente instanceof Estudante) {
                tipoCliente = "Estudante";
                
                if (cliente.saldo < 0) {
                    throw new Error("Estudante com saldo negativo.");
                }
            } 
            // Verifica se o cliente é uma empresa
            else if (cliente instanceof Empresa) {
                tipoCliente = "Empresa";
                
                if (cliente.inadimplente === true) {
                    throw new Error("Empresa está inadimplente.");
                }
            }
            
        } else {
            // Se for cliente avulso (cliente == null)
            if (this.#veiculosBloqueados.has(placa)) {
                throw new Error("Cliente avulso bloqueado por não pagar anteriormente.");
            }
        }

        // Cria o ticket e guarda
        let ticket = new TicketEstacionamento(placa, tipoCliente, dataHora);
        this.#veiculosEstacionados.set(placa, ticket);
        return ticket;
    }

    registrarSaida(placa, dataHora, recusouPagar = false) {
        let ticket = this.#veiculosEstacionados.get(placa);

        if (ticket == null) {
            throw new Error("Veículo não encontrado.");
        }

        ticket.dataHoraSaida = dataHora;
        let cliente = this.#cadastro.obterClientePorPlaca(placa);

        if (cliente != null) {
            //calculo o custo conforme o tipo de cliente
            ticket.valorDevido = cliente.calcularCusto(ticket.dataHoraEntrada, ticket.dataHoraSaida);
            
            // Verifica o tipo de cliente pra aplicar a regra de pagamento correta
            if (cliente instanceof Estudante) {
                cliente.saldo = cliente.saldo - ticket.valorDevido;
                ticket.valorPago = ticket.valorDevido;
            } 
            else if (cliente instanceof Empresa) {
                cliente.debito = cliente.debito + ticket.valorDevido;
                ticket.valorPago = 0;
            } 
            else if (cliente instanceof Professor) {
                ticket.valorPago = 0;
            }
            
        } else {
            // Lógica do cliente avulso
            ticket.valorDevido = this.#calcularCustoAvulso(ticket.dataHoraEntrada, ticket.dataHoraSaida);
            
            // cliente frquente
            if (this.#ehClienteFrequente(placa, dataHora) === true) {
                ticket.nomeDesconto = "ClienteFrequente";
                ticket.valorDesconto = ticket.valorDevido * 0.20; // 20% de desconto
                ticket.valorDevido = ticket.valorDevido - ticket.valorDesconto;
            }
            // bloqueia veiculos por falta de pagamento
            if (recusouPagar === true) {
                this.#veiculosBloqueados.add(placa);
                ticket.valorPago = 0;
            } else {
                ticket.valorPago = ticket.valorDevido;
            }
        }

        ticket.status = "Fechado";
        this.#veiculosEstacionados.delete(placa);
        this.#historicoTickets.push(ticket);
        
        return ticket;
    }
    // calculo do cliente avulso
    #calcularCustoAvulso(dataEntrada, dataSaida) {
        let dias = calcularDiferencaDias(dataEntrada, dataSaida);
        let horas = calcularDiferencaHoras(dataEntrada, dataSaida);

        if (dias === 0) {
            if (horas <= 6) {
                return horas * TARIFAS.AVULSO_HORA;
            } else {
                return TARIFAS.AVULSO_DIARIA;
            }
        } else {
            return (dias + 1) * TARIFAS.AVULSO_DIARIA;
        }
    }
    // verifica os clientes mais frequentes
    #ehClienteFrequente(placa, dataAtual) {
        let cincoDiasAtras = new Date(dataAtual);
        cincoDiasAtras.setDate(cincoDiasAtras.getDate() - 5);

        let contadorVisitas = 0;

        for (let i = 0; i < this.#historicoTickets.length; i++) {
            let ticketAntigo = this.#historicoTickets[i];

            if (ticketAntigo.placa === placa) {
                if (ticketAntigo.dataHoraSaida >= cincoDiasAtras && ticketAntigo.dataHoraSaida <= dataAtual) {
                    contadorVisitas++;
                }
            }
        }

        if (contadorVisitas >= 3) {
            return true;
        } else {
            return false;
        }
    }
}