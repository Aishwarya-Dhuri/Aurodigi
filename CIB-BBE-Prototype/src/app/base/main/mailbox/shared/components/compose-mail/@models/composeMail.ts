export class ComposeMail {
  constructor(
    public category: string = '',
    public categoryId: string = '',
    public subCategory: string = '',
    public subCategoryId: string = '',
    public mailTo: string = '',
    public mailCc: string = '',
    public copyToRm: boolean = false,
    public subject: string = '',
    public message: string = '',
    public userTypeCc: string = 'Bank',
    public userTypeTo: string = 'Bank',
    public isDraft: boolean = false,
    public isRead: boolean = false,
    public isStarred: boolean = false,
    public mailStatus: string = 'draft',
  ) {}
}
