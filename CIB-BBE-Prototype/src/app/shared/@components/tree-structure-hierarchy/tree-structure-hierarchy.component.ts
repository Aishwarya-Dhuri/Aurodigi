import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tree-structure-hierarchy',
  templateUrl: './tree-structure-hierarchy.component.html',
  styleUrls: ['./tree-structure-hierarchy.component.scss'],
})
export class TreeStructureHierarchyComponent implements OnInit {
  @Input('treeStructureHierarchy') treeStructureHierarchy: any;

  @Output() nodeSelected = new EventEmitter<any>();

  zoom = 100;
  constructor() {}

  ngOnInit(): void {}

  onSelectNode(node: any) {
    this.nodeSelected.emit(node);
  }
}
