export class LatePaymentPenaltyTemplate {
  id?: number | string;
  version?: number | string;
  templateCode: string;
  templateName: string;
  calculatelatepenaltyfrom: string;
  penaltyBasis: string;
  effectiveFrom: string;
  effectiveTill: string;

  constructor() {
    this.templateCode = '';
    this.templateName = '';
    this.calculatelatepenaltyfrom = '';
    this.penaltyBasis = '';
    this.effectiveFrom = '';
    this.effectiveTill = '';
  }
}
