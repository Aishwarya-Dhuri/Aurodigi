export class ChangePassword {
    branchCode: string;

    branchName: string;
    userId: string;
    newPassword: string;
    confirmPassword: string;
    constructor() {
        this.branchName = '';
        this.branchCode = '';

        this.userId = '';
        this.newPassword = ''
        this.confirmPassword = ''
    }
}