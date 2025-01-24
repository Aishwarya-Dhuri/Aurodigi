import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TransactionEnquiryService {
  private transactionEnquiryData: any;
  private transactionEnquiryExtraData: any;
  private id: string;
  private actionName: string;

  setTransactionEnquiryData(transactionEnquiryData: any): void {
    this.transactionEnquiryData = transactionEnquiryData;
  }

  getTransactionEnquiryData(): any {
    return this.transactionEnquiryData;
  }

  setTransactionEnquiryExtraData(transactionEnquiryExtraData: any): void {
    this.transactionEnquiryExtraData = transactionEnquiryExtraData;
  }

  getTransactionEnquiryExtraData(): any {
    return this.transactionEnquiryExtraData;
  }

  setId(id: string): void {
    this.id = id;
  }

  getId(): string {
    return this.id;
  }

  setActionName(actionName: string): void {
    this.actionName = actionName;
  }

  getActionName(): string {
    return this.actionName;
  }

  clearAll(): void {
    this.transactionEnquiryData = null;
    this.transactionEnquiryExtraData = null;
    this.actionName = null;
    this.id = null;
  }
}
