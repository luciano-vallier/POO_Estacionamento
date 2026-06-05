/*
Disciplina: Programação Orientada a Objetos
Projeto: Sistema de Controle de Estacionamento

Autor: Luciano Vallier
Data: Março/2026
*/

import { CadastroClientes } from './CadastroClientes.js';
import { RegistroDeEntradas_E_Saidas } from './RegistroDeEntradas_E_Saidas.js';
import { Interface } from './Interface.js';
import { DadosCSV } from './DadosCSV.js';

class App {
    static async iniciar() {
        let cadastro = new CadastroClientes();
        let registro = new RegistroDeEntradas_E_Saidas(cadastro);

        // Carrega os dados salvos no CSV se existirem
        DadosCSV.carregarTudo(cadastro, registro);

        let interfaceUi = new Interface(cadastro, registro);
        await interfaceUi.iniciarMenu();

        // Salva antes de sair
        DadosCSV.salvarTudo(cadastro, registro);
    }
}

App.iniciar();