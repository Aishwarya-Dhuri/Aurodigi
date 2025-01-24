export class InterestTemplate {
    templateCode: string;
    interestTemplateName: string
    templateFor: string;
    rateTypeCode: string;
    effectiveFrom: string
    effectiveTill: string;
    AED?: string;
    USD?: string;
    EURO?: string;
    GBP?: string;
    THB?: string;
    slabInfo: SlabInfo[];

    constructor(public slabFields: any[] = []) {
        this.templateCode = ''
        this.interestTemplateName = ''
        this.templateFor = ''
        this.rateTypeCode = ''
        this.effectiveFrom = ''
        this.effectiveTill = ''
        this.AED = ''
        this.USD = ''
        this.EURO = ''
        this.GBP = '',
            this.THB = ''
        this.slabInfo = [new SlabInfo()];

    }
}


export class SlabInfo {

    public AEDstartSlab: string;
    public AEDendSlab: string;
    public AEDrateTypeCode: string;
    public AEDmargin: string;
    public AEDinterest: string;

    public USDstartSlab: string;
    public USDendSlab: string;
    public USDrateTypeCode: string;
    public USDmargin: string;
    public USDinterest: string;


    public EUROstartSlab: string;
    public EUROendSlab: string;
    public EUROrateTypeCode: string;
    public EUROmargin: string;
    public EUROinterest: string;

    public GBPstartSlab: string;
    public GBPendSlab: string;
    public GBPrateTypeCode: string;
    public GBPmargin: string;
    public GBPinterest: string;

    public THBstartSlab: string;
    public THBendSlab: string;
    public THBrateTypeCode: string;
    public THBmargin: string;
    public THBinterest: string;

    constructor() {
        this.AEDstartSlab = '';
        this.AEDendSlab = '';
        this.AEDrateTypeCode = '';
        this.AEDmargin = '';
        this.AEDinterest = '';

        this.USDstartSlab = '';
        this.USDendSlab = '';
        this.USDrateTypeCode = '';
        this.USDmargin = '';
        this.USDinterest = '';


        this.EUROstartSlab = '';
        this.EUROendSlab = '';
        this.EUROrateTypeCode = '';
        this.EUROmargin = '';
        this.EUROinterest = '';

        this.GBPstartSlab = '';
        this.GBPendSlab = '';
        this.GBPrateTypeCode = '';
        this.GBPmargin = '';
        this.GBPinterest = '';

        this.THBstartSlab = '';
        this.THBendSlab = '';
        this.THBrateTypeCode = '';
        this.THBmargin = '';
        this.THBinterest = '';




    }
}