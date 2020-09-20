
export class EncuestaData {
    private alternativas: string[] = ['a', 'b', 'c', 'd'];
    private valores: number[] = [1, 2, 3, 4];

    constructor() { }

    getDataEncuesta() {
        return [
            { data: this.valores, label: 'Alternativas' }
        ];
    }

    incrementarValor( alts: string, valor: number ) {
        alts = alts.toLowerCase().trim();

        for( let i in this.alternativas ) {
            if ( this.alternativas[i] === alts ) {
                this.valores[i] += valor;
            }
        }

        return this.getDataEncuesta();
    }
}