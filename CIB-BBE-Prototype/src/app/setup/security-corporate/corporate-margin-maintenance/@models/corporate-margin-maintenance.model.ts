export class CorporateMarginMaintenance {
    corporateCode: string;
    corporateName: string;
    effectiveFrom: string;
    effectiveTill: string;
    currency1: string;
    currency2: string;
    // startSlab: string;
    // endSlab: string;
    // rateTypeCode: string;
    rate: string;
    margin: string;
    exchangeRate: number
    currencypair: CurrencyPair[];
    slab: Slab[];

    constructor() {
        this.corporateCode = ''
        this.corporateName = ''
        this.effectiveFrom = ''
        this.effectiveTill = '' 
        this.currency1 = ''
        this.currency2 = ''
        // this.startSlab = ''
        // this.endSlab = ''
        // this.rateTypeCode = ''
        this.rate = ''
        this.margin = ''
        this.exchangeRate = null
        this.currencypair = [new CurrencyPair()];
        this.slab = [new Slab()];

    }

}

export class CurrencyPair {
    slab: Slab[];

    constructor() {
        this.slab = [new Slab()];

    }
}

export class Slab {
    public startSlab: string;
    public endSlab: string;
    public rateTypeCode: string;
    public rate: string;
    public margin: string;
    public exchangeRate: string;

    constructor() {
        this.startSlab = '';
        this.endSlab = '';
        this.rateTypeCode = '';
        this.rate = '';
        this.margin = '';
        this.exchangeRate = '';

    }

}