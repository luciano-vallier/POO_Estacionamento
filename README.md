## 👨‍💻 Autoria
Desenvolvido por **Luciano Vallier** em Março/2026.
Projeto acadêmico - Análise e Desenvolvimento de Sistemas (PUCRS).


# Sistema de Controle de Estacionamento - EstACME 🚗

Este é um projeto acadêmico desenvolvido para a disciplina de Programação Orientada a Objetos. O sistema gerencia o estacionamento de um grande complexo composto por um shopping center, um edifício corporativo e uma universidade.

O sistema controla a entrada, saída, cobrança e gera relatórios gerenciais para diferentes tipos de clientes, aplicando regras de negócio e tarifas específicas para cada categoria.

## 🛠️ Tecnologias Utilizadas
* **Linguagem:** JavaScript (Node.js)
* **Paradigma:** Orientação a Objetos (POO)
* **Módulos:** ES Modules (`import`/`export`) e `fs` (File System) para persistência de dados.
* **Estruturas de Dados:** Arrays, `Map` e `Set`.

## ⚙️ Funcionalidades Implementadas

### Fase 1: Modelagem e Domínio
* **Cadastro de Clientes:** Suporte para clientes pré-cadastrados (`Professor`, `Estudante`, `Empresa`) e clientes `Avulsos`.
* **Controle de Acesso:** Validação de regras de entrada (ex: limite de vagas por professor, inadimplência de empresas, saldo de estudantes e bloqueio de caloteiros avulsos).
* **Cálculo de Tarifas:** Polimorfismo aplicado para calcular custos baseados em horas, diárias e multas de madrugada.
* **Sistema de Descontos:** Desconto automático de 20% para clientes avulsos frequentes (3 visitas nos últimos 5 dias).

### Fase 2: Persistência, Interface e Relatórios
* **Interface via Terminal:** Menu interativo utilizando `readline`.
* **Persistência de Dados (CSV):** Salvamento e carregamento automático de dados (`clientes.csv` e `tickets.csv`) mantendo o estado da aplicação entre execuções.
* **Relatórios Gerenciais Avançados:**
  1. Faturamento Total (Regime de Caixa e Competência com filtro por categoria).
  2. Situação detalhada de um cliente (saldo/débito e veículos atualmente estacionados).
  3. Histórico de acessos de clientes Cadastrados por período (MM/AAAA).
  4. Histórico de acessos de clientes Avulsos por período (MM/AAAA).
  5. Relação de veículos impedidos de entrar (caloteiros).
  6. Ranking dos 10 clientes mais frequentes do ano.
