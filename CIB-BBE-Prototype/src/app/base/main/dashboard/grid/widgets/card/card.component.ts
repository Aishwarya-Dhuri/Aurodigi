import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input('index') index: any;
  @Input('title') title: any;
  @Input('id') id: any;
  @Input('serviceUrl') serviceUrl: any;
  @Input('showChangeChartOption') showChangeChartOption: any;

  @Output() action = new EventEmitter<{ type: string; i?: number }>();
  expandedCard: number;

  type = 'Invoice';
  supplierName = 'all';

  totalList = [];
  pendingList = [];

  allSupplierTotalInvoices = [
    {
      number: 'IN1234567890',
      amount: '50000',
    },
    {
      number: 'IN1234567891',
      amount: '80000',
    },
    {
      number: 'IN1234567892',
      amount: '60000',
    },
    {
      number: 'IN1234567893',
      amount: '450000',
    },
    {
      number: 'IN1234567894',
      amount: '750000',
    },
  ];

  allSupplierPendingInvoices = [
    {
      number: 'IN1234567890',
      amount: '50000',
    },
    {
      number: 'IN1234567892',
      amount: '60000',
    },
  ];

  toyotaSupplierTotalInvoices = [
    {
      number: 'IN1234567890',
      amount: '50000',
    },
    {
      number: 'IN1234567891',
      amount: '80000',
    },
    {
      number: 'IN1234567894',
      amount: '750000',
    },
  ];

  toyotaSupplierPendingInvoices = [
    {
      number: 'IN1234567890',
      amount: '50000',
    },
  ];

  tataSupplierTotalInvoices = [
    {
      number: 'IN1234567892',
      amount: '60000',
    },
    {
      number: 'IN1234567893',
      amount: '450000',
    },
  ];

  tataSupplierPendingInvoices = [
    {
      number: 'IN1234567892',
      amount: '60000',
    },
  ];

  allSupplierTotalPOs = [
    {
      number: 'PO1234567890',
      amount: '50000',
    },
    {
      number: 'PO1234567891',
      amount: '80000',
    },
    {
      number: 'PO1234567892',
      amount: '60000',
    },
    {
      number: 'PO1234567893',
      amount: '450000',
    },
    {
      number: 'PO1234567894',
      amount: '750000',
    },
  ];

  allSupplierPendingPOs = [
    {
      number: 'PO1234567890',
      amount: '50000',
    },
    {
      number: 'PO1234567892',
      amount: '60000',
    },
  ];

  toyotaSupplierTotalPOs = [
    {
      number: 'PO1234567890',
      amount: '50000',
    },
    {
      number: 'PO1234567891',
      amount: '80000',
    },
    {
      number: 'PO1234567894',
      amount: '750000',
    },
  ];

  toyotaSupplierPendingPOs = [
    {
      number: 'PO1234567890',
      amount: '50000',
    },
  ];

  tataSupplierTotalPOs = [
    {
      number: 'PO1234567892',
      amount: '60000',
    },
    {
      number: 'PO1234567893',
      amount: '450000',
    },
  ];

  tataSupplierPendingPOs = [
    {
      number: 'PO1234567892',
      amount: '60000',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  expandCard(i: number) {
    this.expandedCard = i;
  }

  changeSupplierType() {
    const total = this.supplierName + 'SupplierTotal' + this.type + 's';
    const pending = this.supplierName + 'SupplierPending' + this.type + 's';

    this.totalList = this[total];
    this.pendingList = this[pending];
  }

  shrinkCard() {
    this.expandedCard = null;
  }

  actionEvent(e: { type: string; event?: any }) {
    this.action.emit({ type: e.type, i: this.index });
  }
}
