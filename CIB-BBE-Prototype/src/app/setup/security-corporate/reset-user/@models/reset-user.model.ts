export class ResetUser {

    corporateCode: string;
    corporateName: string;
    corporateId?: string;
    userId: string;
    constructor() {
        this.corporateCode = '';
        this.corporateName = '';
        this.userId = '';
    }
}