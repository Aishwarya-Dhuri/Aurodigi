import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

interface TreeNode {
  label: string;
  data: any;
  count?: number;
  isExpanded?: boolean;
  children?: TreeNode[];
}

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent implements OnInit, OnChanges {
  @Input('treeNode') treeNode: TreeNode[];
  @Input('showData') showData: boolean = true;
  @Input('selectedNode') selectedNode: TreeNode;
  @Input('childLevel') childLevel: number = 0;
  @Input('background') background?: boolean;

  @Output() leafNodeSelected = new EventEmitter<TreeNode>();
  @Output() nodeLabelClicked = new EventEmitter<TreeNode>();

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {}

  onLabelClick(node: TreeNode) {
    this.onLabelClickEvent(node);
  }

  onLabelClickEvent(event: any) {
    this.nodeLabelClicked.emit(event);
  }

  // Trigger From Leaf Node
  triggerLeafNodeChecked(treeNode: TreeNode) {
    const leafNode: TreeNode = { ...treeNode };

    delete leafNode.isExpanded;
    delete leafNode.children;

    this.leafNodeSelected.emit(leafNode);
  }

  // On Leaf Node Selected event
  onLeafNodeSelected(node: any) {
    this.leafNodeSelected.emit(node);
  }

  // Expand Tree Node
  expandNode(isExpanded: boolean, i: number) {
    if (this.treeNode[i].children && this.treeNode[i].children.length > 0) {
      this.treeNode[i].isExpanded = isExpanded;
    } else {
      this.onLeafNodeSelected(this.treeNode[i]);
    }
  }
}
