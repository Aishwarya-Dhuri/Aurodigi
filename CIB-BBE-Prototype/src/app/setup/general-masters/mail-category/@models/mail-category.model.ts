export class MailCategory {
  constructor(
    public categoryCode: string = '',
    public categoryName: string = '',
    public typeName: string = '',
    public belongsTo: string = '',
    public belongsToName: string = '',
    public recipientName: string = '',
    public effectiveFrom: string = '',
    public effectiveTill: string = '',
  ) {}
}
