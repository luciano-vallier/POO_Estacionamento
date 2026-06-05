export class RelatoriosGerenciais {
    
    // Valor total arrecadado e faturado
    static relatorioFaturamento(registro, categoria = null) {
        let titulo = categoria ? `FATURAMENTO: ${categoria.toUpperCase()}` : "FATURAMENTO GERAL";
        console.log(`\n--- ${titulo} ---`);
        
        let totalRecebido = 0;
        let totalPendente = 0;
        let quantidade = 0;
        
        for (let ticket of registro.historicoTickets) {
            // Se não passou categoria, soma tudo. Se passou, soma só se bater com o tipo.
            if (!categoria || ticket.tipoCliente.toLowerCase() === categoria.toLowerCase()) {
                totalRecebido += ticket.valorPago;
                // O valor pendente é tudo aquilo que foi cobrado (devido) mas não foi pago na hora
                totalPendente += (ticket.valorDevido - ticket.valorPago);
                quantidade++;
            }
        }
        
        console.log(`Valor Efetivamente Recebido: R$ ${totalRecebido.toFixed(2)}`);
        
        // Só exibe a linha de pendentes se houver algum valor a receber
        if (totalPendente > 0) {
            console.log(`Valor Pendente: R$ ${totalPendente.toFixed(2)}`);
            console.log(`Volume Total Faturado (Recebido + Pendente): R$ ${(totalRecebido + totalPendente).toFixed(2)}`);
        }
        
        console.log(`Total de veículos atendidos: ${quantidade}`);
    }

    // Situação de um cliente cadastrado
    static situacaoCliente(cadastro, documento, registro) {
        console.log(`\n--- SITUAÇÃO DO CLIENTE (Doc: ${documento}) ---`);
        let clienteEncontrado = cadastro.clientes.get(documento);

        if (!clienteEncontrado) {
            console.log("Cliente não encontrado no sistema.");
            return;
        }

        console.log(`Nome: ${clienteEncontrado.nome}`);
        console.log(`Tipo: ${clienteEncontrado.constructor.name}`);
        
        let arrayPlacas = Array.from(clienteEncontrado.placas);
        console.log(`Veículos cadastrados: ${arrayPlacas.join(', ')}`);

        // verifica quais placas estão estacionados agora
        let estacionadosAgora = arrayPlacas.filter(placa => registro.veiculosEstacionados.has(placa));
        if (estacionadosAgora.length > 0) {
            console.log(`Veículos ATUALMENTE no estacionamento: ${estacionadosAgora.join(', ')}`);
        } else {
            console.log(`Nenhum veículo deste cliente no estacionamento agora.`);
        }

        if (clienteEncontrado.constructor.name === "Estudante") {
            console.log(`Saldo atual: R$ ${clienteEncontrado.saldo.toFixed(2)}`);
        } else if (clienteEncontrado.constructor.name === "Empresa") {
            console.log(`Débito atual: R$ ${clienteEncontrado.debito.toFixed(2)}`);
        }
    }

    // registros por tipo de cliente por periodo (Cadastrados e Avulsos)
    static historicoPorTipo(registro, tipoDesejado, mesAnoDigitadoPeloUsuario) {
        console.log(`\n--- HISTÓRICO: ${tipoDesejado.toUpperCase()} (${mesAnoDigitadoPeloUsuario}) ---`);
        
        let ticketsFiltrados = registro.historicoTickets.filter(ticket => {
            // verifica se o tipo de cliente bate (Avulso ou não)
            let tipoCorreto = false;
            if (tipoDesejado === "Avulso") {
                tipoCorreto = ticket.tipoCliente === "Avulso";
            } else {
                tipoCorreto = ticket.tipoCliente !== "Avulso"; // Tudo que não é avulso, é cadastrado
            }

            // Se o tipo não é o que queremos, descarta
            if (!tipoCorreto) return false;

            // verifica o período (Data de Saída) e ignora se o ticket está aberto
            if (!ticket.dataHoraSaida) return false; 

            // Extrai o mês e o ano para o formato MM/AAAA e adiciona +1 para corresponder ao mês corretamente
            let mes = String(ticket.dataHoraSaida.getMonth() + 1).padStart(2, '0');
            let ano = ticket.dataHoraSaida.getFullYear();
            let mesAnoTicket = `${mes}/${ano}`;

            // Só retorna true se o tipo bater E o mês/ano bater
            return mesAnoTicket === mesAnoDigitadoPeloUsuario;
        });

        if (ticketsFiltrados.length === 0) {
            console.log("Nenhum registro encontrado para este tipo neste período.");
            return;
        }

        for (let ticket of ticketsFiltrados) {
            let dataStr = ticket.dataHoraEntrada ? ticket.dataHoraEntrada.toLocaleDateString() : "Data Indisponível";
            console.log(`[${dataStr}] Placa: ${ticket.placa} | Pago: R$ ${ticket.valorPago.toFixed(2)}`);
        }
    }

    // Relação de veículos bloqueados
    static relatorioImpedidos(registro) {
        console.log("\n--- VEÍCULOS IMPEDIDOS DE ENTRAR ---");
    
        let bloqueados = registro.veiculosBloqueados; 
        
        if (!bloqueados || bloqueados.size === 0) {
            console.log("Nenhum veículo bloqueado no momento.");
        } else {
            bloqueados.forEach(placa => {
                console.log(`- Placa bloqueada: ${placa}`);
            });
        }
    }

    // Top 10 clientes mais frequentes
    static rankingFrequencia(registro) {
        console.log("\n--- TOP 10 CLIENTES MAIS FREQUENTES DO ANO ---");
        
        let contagemPlacas = new Map();
        let anoAtual = new Date().getFullYear(); // NOVO: Pega o ano em que estamos

        for (let ticket of registro.historicoTickets) {
            // NOVO: Só conta se o ticket tiver data e for do ano atual
            if (ticket.dataHoraSaida && ticket.dataHoraSaida.getFullYear() === anoAtual) {
                let qtdAtual = contagemPlacas.get(ticket.placa) || 0;
                contagemPlacas.set(ticket.placa, qtdAtual + 1);
            }
        }

        // Ordena a quantidade de acessos do maior para o menor
        let ranking = Array.from(contagemPlacas.entries());
        ranking.sort((a, b) => b[1] - a[1]);

        // Pega apenas os 10 primeiros
        let top10 = ranking.slice(0, 10);

        if (top10.length === 0) {
            console.log("Histórico vazio.");
            return;
        }

        let posicao = 1;
        for (let [placa, acessos] of top10) {
            console.log(`${posicao}º Lugar: Placa ${placa} com ${acessos} acessos.`);
            posicao++;
        }
    }
}