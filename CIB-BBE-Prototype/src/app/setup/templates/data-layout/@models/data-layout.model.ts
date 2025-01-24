export class DataLayout {
    dataLayoutCode: string;
    dataLayoutName: string;
    moduleName: string;
    formatType: string;
    fileType: string;
    submoduleName: string;
    defaultDateFormat: string;
    dataLayoutFormat: string;
    noOfLinesHeader: string;
    noOfLinesFooter: string;
    textType: string;
    delimiterValue: string;
    datafield: string;
    sequenceNumber: string
    dataType: string;
    defaultData: string;
    dataValue: string;
    validatecheck: string;
    allowNull: string;
    minLength: string;
    maxLenghh: string;
    newColumn?: columnDetails[];
    newDetailColumn?: columnDetails[];
    newFooterColumn?: columnDetails[];
    newEnrichmentColumn?: columnDetails[];


    constructor() {
        this.dataLayoutCode = ''
        this.dataLayoutName = ''
        this.moduleName = ''
        this.submoduleName = ''
        this.formatType = 'upload'
        this.fileType = 'textCSV'
        this.defaultDateFormat = '',
            this.dataLayoutFormat = '',
            this.noOfLinesHeader = ''
        this.noOfLinesFooter = ''
        this.textType = 'delimiter'
        this.delimiterValue = ''
        this.datafield = ''

        this.sequenceNumber = '',
            this.dataType = ''
        this.defaultData = ''
        this.dataValue = ''
        this.validatecheck = ''
        this.allowNull = ''
        this.minLength = ''
        this.maxLenghh = ''
        this.newColumn = []
        this.newDetailColumn = []
        this.newFooterColumn = []
        this.newEnrichmentColumn = []

    }

}




export class columnDetails {

    initActions?: any;
    reviewActions?: any;
    columnName: string;
    // dataType: string;
    // sequenceNumber: string;

    constructor(
        public id: string = new Date().getTime().toString(),
        public sequenceNumber = '', public dataType = '', public validatecheck = '', public defaultData = '', public dataValue = '',
        public allowNull = '', public minLength = '', public maxLength = '', public datafield = '',
        public detaildatafield = '', public detailsequenceNumber = '', public detaildataType = '', public detaildataValue = '',
        public detaildefaultData = '', public detailminLength = '', public detailmaxLength = '', public detailEndPosition = '',
        public detailStartPosition = '', public detailPaddingCharacter = '', public footerdatafield = '',
        public footersequenceNumber = '',
        public footerdataType = '',
        public footerdataValue = '',
        public footerdefaultData = '',
        public footerminLength = '',
        public footermaxLength = '',

        public enrichmentdatafield = '',
        public enrichmentsequenceNumber = '',
        public enrichmentdataType = '',
        public enrichmentdataValue = '',
        public enrichmentdefaultData = '',
        public enrichmentminLength = '',
        public enrichmentmaxLength = '',

    ) {

        this.initActions = [];
        this.reviewActions = [];
        this.columnName = '';
        this.dataType = '',
            this.sequenceNumber = '',
            this.datafield = ''
        this.defaultData = ''
        this.dataValue = ''
        this.validatecheck = ''
        this.allowNull = ''
        this.minLength = ''
        this.maxLength = ''


        //Details
        this.detaildatafield = ''
        this.detailsequenceNumber = ''
        this.detaildataType = ''
        this.detaildataValue = ''
        this.detaildefaultData = '',
            this.detailminLength = ''
        this.detailmaxLength = '',
            this.detailEndPosition = '',
            this.detailStartPosition = '',
            this.detailPaddingCharacter = ''


        //Footer
        this.footerdatafield = ''
        this.footersequenceNumber = ''
        this.footerdataType = ''
        this.footerdataValue = ''
        this.footerdefaultData = '',
            this.footerminLength = ''
        this.footermaxLength = ''


        //Enrichment
        this.enrichmentdatafield = ''
        this.enrichmentsequenceNumber = ''
        this.enrichmentdataType = ''
        this.enrichmentdataValue = ''
        this.enrichmentdefaultData = '',
            this.enrichmentminLength = ''
        this.enrichmentmaxLength = ''
    }
}