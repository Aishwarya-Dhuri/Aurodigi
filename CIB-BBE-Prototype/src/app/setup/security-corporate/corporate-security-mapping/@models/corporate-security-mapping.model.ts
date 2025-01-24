export class CorporateSecurityMapping {

    corporateId: string;
    corporateName: string;
    encryptionType: string;
    uploadType: string;
    keyId: string
    encryptionKey: string;
    encryptionRequired: string;
    hostName: string;
    userName: string;
    password: string;
    sorceFolderName: string;
    destinationFolderName: string;
    reportsTobeGenerated: string;
    reportPasswordProtection: boolean;
    webServiceAlertResponse: string;
    keyFile: []
    constructor() {
        this.corporateId = ''
        this.corporateName = ''
        this.encryptionType = 'Symmetric'
        this.uploadType = ''
        this.keyId = '',
            this.encryptionKey = ''
        this.encryptionRequired = 'No',
            this.hostName = ''
        this.userName = '',
            this.password = '',
            this.sorceFolderName = '',
            this.destinationFolderName = ''
        this.reportsTobeGenerated = 'Yes',
            this.reportPasswordProtection = false
        this.webServiceAlertResponse = ''
        this.keyFile = []
    }
}