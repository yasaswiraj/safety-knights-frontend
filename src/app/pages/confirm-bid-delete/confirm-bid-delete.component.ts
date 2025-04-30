// confirm-dialog.component.ts
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-bid-delete',
  imports: [
      CommonModule,
      MatDialogModule,

    ],
  template: `
    <h2 mat-dialog-title>Confirm Deletion</h2>
    <mat-dialog-content>Are you sure you want to delete this bid?</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>No</button>
      <button mat-button color="warn" [mat-dialog-close]="true">Yes</button>
    </mat-dialog-actions>
  `
})
export class ConfirmBidDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmBidDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
