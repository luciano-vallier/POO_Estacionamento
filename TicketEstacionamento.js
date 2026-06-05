export class TicketEstacionamento {
    constructor(placa, tipoCliente, dataHoraEntrada) {
        this.placa = placa;
        this.tipoCliente = tipoCliente;
        this.dataHoraEntrada = dataHoraEntrada;
        this.dataHoraSaida = null;
        this.valorDevido = 0;
        this.valorDesconto = 0;
        this.nomeDesconto = "Nenhum";
        this.valorPago = 0;
        this.status = 'Aberto';
    }
}