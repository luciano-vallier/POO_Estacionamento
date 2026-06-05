export const TARIFAS = {
    AVULSO_HORA: 10.00,
    AVULSO_DIARIA: 50.00,
    ESTUDANTE_INGRESSO: 15.00,
    EMPRESA_DIARIA: 30.00,
    EMPRESA_MULTA_MADRUGADA: 20.00
};

// calcula diferenca de dias inteiros
export function calcularDiferencaDias(dataEntrada, dataSaida) {
    let d1 = new Date(dataEntrada.getFullYear(), dataEntrada.getMonth(), dataEntrada.getDate());
    let d2 = new Date(dataSaida.getFullYear(), dataSaida.getMonth(), dataSaida.getDate());  
    let diferencaTempo = d2.getTime() - d1.getTime();
    return diferencaTempo / (1000 * 3600 * 24);
}

// calcula horas arredondando pra cima
export function calcularDiferencaHoras(dataEntrada, dataSaida) {
    let diferencaTempo = dataSaida.getTime() - dataEntrada.getTime();
    let diferencaHoras = diferencaTempo / (1000 * 3600); 
    return Math.ceil(diferencaHoras);
}