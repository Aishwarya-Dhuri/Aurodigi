export class AntiPhishingImage {
  id?: number | string;
  version?: number | string;
  categoryCode: string;
  categoryName: string;
  imageCategory: [];
  // imageCount: string;

  constructor(
    public imageCount: number = 0,
  ) {
    this.categoryCode = '';
    this.categoryName = '';
    this.imageCategory = []
    // this.imageCount = ''
  }
}
