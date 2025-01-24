import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';

interface AccordionTreeNode {
  label: string;
  data: string | number;
  isExpanded?: boolean;
  partialCheck?: boolean;
  check?: boolean;
  children?: AccordionTreeNode[];
  [key: string]: any;
}

@Component({
  selector: 'app-accordion-tree',
  templateUrl: './accordion-tree.component.html',
  styleUrls: ['./accordion-tree.component.scss'],
})
export class AccordionTreeComponent implements OnInit {
  @ViewChildren('subTreeNodes')
  public subTreeNodesList: QueryList<AccordionTreeComponent>;

  @ViewChild('subTreeNodes')
  public subTreeNodes: AccordionTreeComponent;

  @Input('treeNode') treeNode: AccordionTreeNode[];
  @Input('childLevel') childLevel: number = 0;
  @Input('background') background?: boolean;
  @Input('checkboxSelection') checkboxSelection?: boolean = true;

  @Output() nodeChecked = new EventEmitter<{
    node: AccordionTreeNode;
    checked: boolean;
    indexes?: number[];
  }>();

  @Output() leafNodeChecked = new EventEmitter<{
    leafNode: AccordionTreeNode;
    checked: boolean;
    indexes?: number[];
  }>();

  @Output() checkboxChecked = new EventEmitter<{
    treeNode?: AccordionTreeNode;
    checked?: boolean;
    isAllChecked: boolean;
    isAllUnchecked: boolean;
  }>();

  @Output() labelClicked = new EventEmitter<AccordionTreeNode>();

  constructor() {}

  ngOnInit(): void {
    if (this.checkboxSelection) {
      this.treeNode = this.treeNode.map((node: AccordionTreeNode) => {
        node.isExpanded = node.isExpanded !== undefined ? node.isExpanded : false;
        node.partialCheck = node.partialCheck !== undefined ? node.partialCheck : false;
        node.check = node.check !== undefined ? node.check : false;
        return node;
      });
    }
  }

  // Check All Child Nodes
  checkboxCheckedAll(checked: boolean) {
    let n = this.treeNode.length;

    for (let i = 0; i < n; i++) {
      this.treeNode[i].check = checked;
      this.treeNode[i].partialCheck = false;

      if (this.treeNode[i].children && this.treeNode[i].children.length > 0) {
        this.subTreeNodes.checkboxCheckedAll(checked);
      } else {
        this.triggerLeafNodeChecked(this.treeNode[i], checked);
      }
    }
  }

  // Trigger From Leaf Node
  triggerLeafNodeChecked(treeNode: AccordionTreeNode, checked: boolean) {
    const leafNode: AccordionTreeNode = { ...treeNode };

    delete leafNode.isExpanded;
    delete leafNode.partialCheck;
    delete leafNode.check;
    delete leafNode.children;

    this.leafNodeChecked.emit({ leafNode, checked });
  }

  // On Leaf Node Checked event
  onLeafNodeChecked(event: any) {
    // Trigger Parent Node
    this.leafNodeChecked.emit(event);
  }

  // Check All Current Nodes
  onCheckboxChecked(checked: boolean, i: number) {
    this.treeNode[i].check = checked;
    this.treeNode[i].partialCheck = false;

    if (this.treeNode[i].children && this.treeNode[i].children.length > 0) {
      const subTreeNodes = this.subTreeNodesList.toArray();
      subTreeNodes[i].checkboxCheckedAll(checked);
    } else {
      this.triggerLeafNodeChecked(this.treeNode[i], checked);
    }

    // Trigger Parent Node
    this.triggerCheckboxChecked(this.treeNode[i], checked);
  }

  onLabelClicked(treeNode: AccordionTreeNode) {
    this.onLabelClickedEvent(treeNode);
  }

  // On Label Clicked Event
  onLabelClickedEvent(event: any) {
    this.labelClicked.emit(event);
  }

  // Check All Current Nodes are Checked
  private isAllChecked(): boolean {
    let n = this.treeNode.length;

    for (let i = 0; i < n; i++) {
      if (this.treeNode[i].check === false) {
        return false; // Unchecked
      }
    }
    return true; // Checked
  }

  // Check All Current Nodes are Unchecked or Partially Checked
  private isAllUnchecked() {
    let n = this.treeNode.length;

    for (let i = 0; i < n; i++) {
      if (this.treeNode[i].check === true || this.treeNode[i].partialCheck === true) {
        return false; // Partially Checked
      }
    }

    return true; // Unchecked
  }

  // Trigger from child node to set current node checkbox
  onCurrentNodeChecked(selectCheck: any, i: number) {
    this.treeNode[i].check = selectCheck.isAllUnchecked ? false : selectCheck.isAllChecked;
    this.treeNode[i].partialCheck = selectCheck.isAllUnchecked ? false : !selectCheck.isAllChecked;

    // Trigger Parent Node
    this.triggerCheckboxChecked(selectCheck.treeNode, selectCheck.checked);
  }

  // Trigger Parent Node
  triggerCheckboxChecked(treeNode: AccordionTreeNode, checked?: boolean) {
    this.checkboxChecked.emit({
      treeNode,
      checked,
      isAllChecked: this.isAllChecked(),
      isAllUnchecked: this.isAllUnchecked(),
    });
  }

  // Expand Tree Node
  expandNode(isExpanded: boolean, i: number) {
    if (this.treeNode[i].children && this.treeNode[i].children.length > 0) {
      this.treeNode[i].isExpanded = isExpanded;
    }
  }
}
