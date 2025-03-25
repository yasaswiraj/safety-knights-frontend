import { Component, Input, OnInit, OnChanges, SimpleChanges, signal, effect } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeModule } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddChildDialog } from '../add-child-dialog/add-child-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-options-tree',
  standalone: true,
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
  ],
  templateUrl: './options-tree.component.html',
  styleUrls: ['./options-tree.component.css'],
})
export class OptionsTreeComponent implements OnInit, OnChanges {
  @Input() dataSource!: MatTreeFlatDataSource<any, any>;
  @Input() treeControl!: FlatTreeControl<any>;
  @Input() addChildHandler?: (node: any, childName: string) => void;

  // New signal for tree data
  treeData = signal<any[]>([]);
  
  hasChild = (_: number, node: any) => node.expandable;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    // Initialize treeData with dataSource if already set
    if (this['dataSource'] && this['dataSource'].data) {
      this.treeData.set([...this['dataSource'].data]);
    }
    effect(() => {
      if (this['dataSource']) {
        this.treeData.set([...this['dataSource'].data]);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSource && this['dataSource']) {
      this.treeData.set([...this['dataSource'].data]);
    }
  }

  // This function opens the dialog and then calls the parent’s handler if provided
  openAddChildDialog(node: any): void {
    const dialogRef = this.dialog.open(AddChildDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result && this.addChildHandler) {
        this.addChildHandler(node, result);
      }
    });
  }

  openDeleteDialog(node: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: `Are you sure you want to delete "${node.name}"?` }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // TODO: Implement deletion logic (e.g., remove node from data)
        console.log('Deleted node:', node);
      }
    });
  }
}
