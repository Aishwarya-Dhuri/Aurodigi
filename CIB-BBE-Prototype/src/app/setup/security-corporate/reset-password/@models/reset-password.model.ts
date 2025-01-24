export class ResetPassword {

    corporateCode: string;
    corporateName: string;
    corporateId?: string;
    userId: string;
    userName: string;
    constructor() {
        this.corporateCode = '';
        this.corporateName = '';
        this.userId = '';
        this.userName = '';
    }
}