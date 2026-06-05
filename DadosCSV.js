import fs from 'fs';
import { Professor } from './clientes/Professor.js';
import { Estudante } from './clientes/Estudante.js';
import { Empresa } from './clientes/Empresa.js';
import { TicketEstacionamento } from './TicketEstacionamento.js';

export class DadosCSV {
    // Nomes dos arquivos que serão salvos numa pasta do projeto
    static #pastaDados = './dados';
    static #arqClientes = './dados/clientes.csv';
    static #arqTickets = './dados/tickets.csv';

    // Salva os dados nos arquivos
    static salvarTudo(cadastro, registro) {
        if (!fs.existsSync(this.#pastaDados)) {
            fs.mkdirSync(this.#pastaDados);
        }

        this.#salvarClientes(cadastro);
        this.#salvarTickets(registro);
    }

    static #salvarClientes(cadastro) {
        let conteudoCSV = "documento;nome;tipo;placas;saldo;debito\n";

        cadastro.clientes.forEach((cliente) => {
            let tipo = cliente.constructor.name;
            let placasTexto = Array.from(cliente.placas).join(',');

            let saldo = "";
            let debito = "";
            
            if (tipo === "Estudante") {
                saldo = cliente.saldo;
            } else if (tipo === "Empresa") {
                debito = cliente.debito;
            }

            conteudoCSV += `${cliente.documento};${cliente.nome};${tipo};${placasTexto};${saldo};${debito}\n`;
        });

        fs.writeFileSync(this.#arqClientes, conteudoCSV, 'utf-8');
    }

    // NOVO: Método auxiliar para formatar a data no formato AAAA-MM-DDTHH:mm (Local, sem segundos)
    static #formatarDataLocal(data) {
        if (!data) return "";
        let ano = data.getFullYear();
        let mes = String(data.getMonth() + 1).padStart(2, '0');
        let dia = String(data.getDate()).padStart(2, '0');
        let horas = String(data.getHours()).padStart(2, '0');
        let minutos = String(data.getMinutes()).padStart(2, '0');
        
        return `${ano}-${mes}-${dia}T${horas}:${minutos}`;
    }

    static #salvarTickets(registro) {
        let conteudoCSV = "placa;tipoCliente;dataEntrada;dataSaida;valorDevido;valorDesconto;nomeDesconto;valorPago;status\n";

        // Junta os tickets que estão abertos no estacionamento com os fechados
        let todosTickets = [];
        
        registro.veiculosEstacionados.forEach((ticket) => {
            todosTickets.push(ticket);
        });
        
        for (let i = 0; i < registro.historicoTickets.length; i++) {
            todosTickets.push(registro.historicoTickets[i]);
        }

        // Monta as linhas
        for (let ticket of todosTickets) {
            // AQUI FOI ALTERADO: Usando a nossa função de data local ao invés do toISOString()
            let entradaStr = this.#formatarDataLocal(ticket.dataHoraEntrada);
            let saidaStr = this.#formatarDataLocal(ticket.dataHoraSaida);

            conteudoCSV += `${ticket.placa};${ticket.tipoCliente};${entradaStr};${saidaStr};${ticket.valorDevido};${ticket.valorDesconto};${ticket.nomeDesconto};${ticket.valorPago};${ticket.status}\n`;
        }

        fs.writeFileSync(this.#arqTickets, conteudoCSV, 'utf-8');
    }

    // Carrega os dados do arquivo
    static carregarTudo(cadastro, registro) {
        this.#carregarClientes(cadastro);
        this.#carregarTickets(registro);
    }

    static #carregarClientes(cadastro) {
        // Verifica se o arquivo existe antes de tentar ler
        if (!fs.existsSync(this.#arqClientes)) 
            return;

        let arquivo = fs.readFileSync(this.#arqClientes, 'utf-8');
        let linhas = arquivo.split('\n');

        // pula o cabeçalho do arquivo
        for (let i = 1; i < linhas.length; i++) {
            let linha = linhas[i].trim();
            if (linha === "") 
                continue; // Pula linhas em branco

            let colunas = linha.split(';');
            let documento = colunas[0];
            let nome = colunas[1];
            let tipo = colunas[2];
            let placas = colunas[3].split(',');
            
            // Se saldo/debito estiver vazio no csv, transforma em 0 pra não dar erro
            let saldo = colunas[4] !== "" ? parseFloat(colunas[4]) : 0;
            let debito = colunas[5] !== "" ? parseFloat(colunas[5]) : 0;

            let novoCliente;

            if (tipo === "Professor") {
                novoCliente = new Professor(documento, nome);
            } else if (tipo === "Estudante") {
                novoCliente = new Estudante(documento, nome, saldo);
            } else if (tipo === "Empresa") {
                novoCliente = new Empresa(documento, nome);
                novoCliente.debito = debito;
            }

            if (novoCliente) {
                for (let placa of placas) {
                    if (placa !== "") {
                        novoCliente.adicionarPlaca(placa);
                    }
                }
                cadastro.cadastrarCliente(novoCliente);
            }
        }
    }

    static #carregarTickets(registro) {
        if (!fs.existsSync(this.#arqTickets)) return;

        let arquivo = fs.readFileSync(this.#arqTickets, 'utf-8');
        let linhas = arquivo.split('\n');

        for (let i = 1; i < linhas.length; i++) {
            let linha = linhas[i].trim();
            if (linha === "") continue;

            let colunas = linha.split(';');
            
            let placa = colunas[0];
            let tipoCliente = colunas[1];
            let dataEntrada = new Date(colunas[2]);
            
            let ticket = new TicketEstacionamento(placa, tipoCliente, dataEntrada);
            
            // Preenche os dados do ticket
            if (colunas[3] !== "") ticket.dataHoraSaida = new Date(colunas[3]);
            ticket.valorDevido = parseFloat(colunas[4]);
            ticket.valorDesconto = parseFloat(colunas[5]);
            ticket.nomeDesconto = colunas[6];
            ticket.valorPago = parseFloat(colunas[7]);
            ticket.status = colunas[8];

            // Se o ticket estiver aberto, o carro continua no estacionamento. Se estiver fechado, vai para o histórico.
            if (ticket.status === 'Aberto') {
                registro.veiculosEstacionados.set(placa, ticket);
            } else {
                registro.historicoTickets.push(ticket);
                
                // Se o cliente avulso não pagou, coloca ele de volta na lista de bloqueados
                if (ticket.tipoCliente === 'Avulso' && ticket.valorDevido > 0 && ticket.valorPago === 0) {
                    registro.veiculosBloqueados.add(ticket.placa);
                }
            }
        }
    }
}