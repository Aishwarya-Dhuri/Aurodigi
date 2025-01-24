export class DynamicDiscounting {
    templateCode: string;
    dynamicDiscountingtemplateName: string;
    effectiveFrom: string
    effectiveTill: string;
    discountApplicableAt: string;
    autoApplyDiscount: boolean;
    discountBasis: string;
    discountOnPartialPayment: boolean;
    discountApply: string;
    minTotalPeriod: string;
    maxTotalPeriod: string;
    totalPeriodFrom: string;
    constructor() {
        this.templateCode = ''
        this.dynamicDiscountingtemplateName = ''
        this.effectiveFrom = ''
        this.effectiveTill = ''
        this.discountApplicableAt = '',
            this.autoApplyDiscount = false,
            this.discountBasis = ''
        this.discountOnPartialPayment = false;
        this.discountApply = ''
        this.minTotalPeriod = ''
        this.maxTotalPeriod = ''
        this.totalPeriodFrom = ''

    }

}