import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

import { Professor } from './clientes/Professor.js';
import { Estudante } from './clientes/Estudante.js';
import { Empresa } from './clientes/Empresa.js';
import { RelatoriosGerenciais } from './RelatoriosGerenciais.js';

export class Interface {
    #cadastro;
    #registro;
    #leitor;

    constructor(cadastroClientes, registroEntradasSaidas) {
        this.#cadastro = cadastroClientes;
        this.#registro = registroEntradasSaidas;
        this.#leitor = readline.createInterface({ input, output });
    }

    async iniciarMenu() {
        let rodando = true;

        while (rodando === true) {
            console.log("\n==================================");
            console.log("          SISTEMA ESTACME          ");
            console.log("==================================");
            console.log("1. Cadastrar Novo Cliente");
            console.log("2. Registrar Entrada de Veículo");
            console.log("3. Registrar Saída de Veículo");
            console.log("4. Relatórios");
            console.log("0. Salvar e Sair");
            console.log("==================================");

            let opcao = await this.#leitor.question("Escolha uma opção: ");

            try {
                if (opcao === '1') {
                    await this.#telaCadastrarCliente();
                } else if (opcao === '2') {
                    await this.#telaRegistrarEntrada();
                } else if (opcao === '3') {
                    await this.#telaRegistrarSaida();
                } else if (opcao === '4') {
                    // menu dos relatórios
                    console.log("\n ====== MENU DE RELATÓRIOS =======");
                    console.log("1. Faturamento Total");
                    console.log("2. Situação de um Cliente");
                    console.log("3. Histórico de Cadastrados");
                    console.log("4. Histórico de Avulsos");
                    console.log("5. Veículos Impedidos");
                    console.log("6. Ranking Top 10 Frequência");
                    console.log("==================================");

                    let opRelatorio = await this.#leitor.question("Escolha o relatório: ");

                    if (opRelatorio === '1') {
                        console.log("\n===== FILTRO DE FATURAMENTO =====");
                        console.log("1. Geral (Todos)");
                        console.log("2. Avulso");
                        console.log("3. Estudante");
                        console.log("4. Empresa");
                        console.log("5. Professor");
                        console.log("==================================");
                        
                        let opFiltro = await this.#leitor.question("Escolha uma opção de filtro: ");
                        
                        if (opFiltro === '1') {
                            RelatoriosGerenciais.relatorioFaturamento(this.#registro, null);
                        } else if (opFiltro === '2') {
                            RelatoriosGerenciais.relatorioFaturamento(this.#registro, "Avulso");
                        } else if (opFiltro === '3') {
                            RelatoriosGerenciais.relatorioFaturamento(this.#registro, "Estudante");
                        } else if (opFiltro === '4') {
                            RelatoriosGerenciais.relatorioFaturamento(this.#registro, "Empresa");
                        } else if (opFiltro === '5') {
                            RelatoriosGerenciais.relatorioFaturamento(this.#registro, "Professor");
                        } else {
                            console.log("\nOpção de filtro inválida. Retornando ao menu...");
                        }
                    }
                    else if (opRelatorio === '2') {
                        let doc = await this.#leitor.question("Digite o documento do cliente: ");
                        RelatoriosGerenciais.situacaoCliente(this.#cadastro, doc, this.#registro);
                    }
                    else if (opRelatorio === '3') {
                        // Pede o período
                        let periodo = await this.#leitor.question("Digite o período desejado (MM/AAAA) - Ex: 03/2026: ");
                        RelatoriosGerenciais.historicoPorTipo(this.#registro, "Cadastrado", periodo);
                    }
                    else if (opRelatorio === '4') {
                        // Pede o período
                        let periodo = await this.#leitor.question("Digite o período desejado (MM/AAAA) - Ex: 03/2026: ");
                        RelatoriosGerenciais.historicoPorTipo(this.#registro, "Avulso", periodo);
                    }
                    else if (opRelatorio === '5') RelatoriosGerenciais.relatorioImpedidos(this.#registro);
                    else if (opRelatorio === '6') RelatoriosGerenciais.rankingFrequencia(this.#registro);
                    else console.log("Opção de relatório inválida.");
                
                } else if (opcao === '0') {
                    console.log("\nSalvando dados e encerrando o sistema... Até logo!");
                    rodando = false;
                } else {
                    console.log("\nOpção inválida. Tente novamente.");
                }
            } catch (erro) {
                console.log("\n ERRO: " + erro.message);
            }
        }
        this.#leitor.close();
    }

    async #telaCadastrarCliente() {
        console.log("\n--- CADASTRAR CLIENTE ---");
        console.log("Tipos: 1-Professor | 2-Estudante | 3-Empresa");
        let tipo = await this.#leitor.question("Escolha o tipo de cliente: ");
        
        if (tipo !== '1' && tipo !== '2' && tipo !== '3') {
            throw new Error("Tipo de cliente inválido.");
        }

        let documento;

        // valida o documento por tipo
        if (tipo === '3') {
            documento = await this.#leitor.question("Digite o CNPJ (somente numeros): ");
            
            // Verifica se não tem 14 caracteres OU se tem algo que não seja número
            if (documento.length !== 14 || !/^\d+$/.test(documento)) {
                throw new Error("CNPJ inválido! Digite exatamente 14 números, sem pontos, traços ou letras.");
            }
        } else {
            documento = await this.#leitor.question("Digite o CPF (somente numeros): ");
            
            // Verifica se não tem 11 caracteres OU se tem algo que não seja número
            if (documento.length !== 11 || !/^\d+$/.test(documento)) {
                throw new Error("CPF inválido! Digite exatamente 11 números, sem pontos, traços ou letras.");
            }
        }

        // valida se o documento é único
        if (this.#cadastro.clientes.has(documento)) {
            throw new Error("Já existe um cliente cadastrado com este documento!");
        }

        let nome = await this.#leitor.question("Digite o nome: ");
        
        let placaDigitada = await this.#leitor.question("Digite a placa do veículo (Ex: ABC-1234): ");
        let placa = placaDigitada.replace(/-/g, '').toUpperCase();

        // impede placa repetida em outro cliente
        if (this.#cadastro.obterClientePorPlaca(placa) !== undefined) {
            throw new Error("Esta placa já está vinculada a outro cliente no sistema!");
        }

        let novoCliente;

        if (tipo === '1') {
            novoCliente = new Professor(documento, nome);
        } else if (tipo === '2') {
            let saldoStr = await this.#leitor.question("Digite o saldo inicial do estudante: R$ ");
            novoCliente = new Estudante(documento, nome, parseFloat(saldoStr));
        } else if (tipo === '3') {
            novoCliente = new Empresa(documento, nome);
        }

        novoCliente.adicionarPlaca(placa);
        this.#cadastro.cadastrarCliente(novoCliente);
        console.log("\n Cliente cadastrado com sucesso!");
    }

    async #telaRegistrarEntrada() {
        console.log("\n--- REGISTRAR ENTRADA ---");
        
        // Remove os hifens da placa!
        let placaDigitada = await this.#leitor.question("Digite a placa do veículo: ");
        let placa = placaDigitada.replace(/-/g, '').toUpperCase();
        
        // Usa a data e hora atual do sistema
        let dataAtual = new Date(); 
        
        let ticket = this.#registro.registrarEntrada(placa, dataAtual);
        console.log(`\n Entrada liberada! Veículo ${ticket.placa} registrado às ${dataAtual.toLocaleTimeString()}.`);
        console.log(`Tipo de tarifa aplicada: ${ticket.tipoCliente}`);
    }

    async #telaRegistrarSaida() {
        console.log("\n--- REGISTRAR SAÍDA ---");
        
        let placaDigitada = await this.#leitor.question("Digite a placa do veículo: ");
        let placa = placaDigitada.replace(/-/g, '').toUpperCase();
        
        // SIMULAÇÃO: Adiciona 4 horas na data atual só para testar a cobrança
        let dataSaidaSimulada = new Date();
        dataSaidaSimulada.setHours(dataSaidaSimulada.getHours() + 4); 

        // Pergunta se o valor foi pago corretamente. Se negativo, é feito o bloqueio da placa.
        let pagou = await this.#leitor.question("Cliente pagou o valor devido? (S/N): ");
        let recusouPagar = (pagou.toUpperCase() === 'N');

        let ticket = this.#registro.registrarSaida(placa, dataSaidaSimulada, recusouPagar);
        
        console.log(`\n Saída registrada para o veículo ${ticket.placa}.`);
        console.log(`Valor devido: R$ ${ticket.valorDevido.toFixed(2)}`);
        console.log(`Valor pago na hora: R$ ${ticket.valorPago.toFixed(2)}`);
        if (ticket.valorDesconto > 0) {
            console.log(`Desconto aplicado: ${ticket.nomeDesconto} (R$ ${ticket.valorDesconto.toFixed(2)})`);
        }
    }
}