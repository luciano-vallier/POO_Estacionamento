export class CadastroClientes {
    #clientes;
    #placaCliente;

    constructor() {
        this.#clientes = new Map(); 
        this.#placaCliente = new Map(); 
    }

    get clientes() { return this.#clientes; }

    cadastrarCliente(cliente) {
        this.#clientes.set(cliente.documento, cliente);
        cliente.placas.forEach(placa => {
            this.#placaCliente.set(placa, cliente);
        });
    }

    obterClientePorPlaca(placa) {
        return this.#placaCliente.get(placa);
    }
}