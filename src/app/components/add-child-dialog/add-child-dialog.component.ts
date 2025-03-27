import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'add-child-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <div class="p-4">
      <h1 class="text-xl font-bold mb-4">Add Option</h1>

      <div class="mb-4">
        <input
          class="rounded-2xl py-2 px-4 text-(--text-color) w-100"
          [(ngModel)]="childName"
          placeholder="Enter new option name" />
      </div>

      <div class="flex justify-end space-x-2">
        <button mat-button (click)="onCancel()" class="px-4 py-2">
          Cancel
        </button>
        <button
          [disabled]="!childName.trim()"
          (click)="onAdd()"
          class="px-6 py-2 bg-(--text-color) disabled:bg-(--text-color)/20 text-white rounded-full">
          Add
        </button>
      </div>
    </div>
  `,
})
export class AddChildDialog {
  childName: string = '';

  constructor(public dialogRef: MatDialogRef<AddChildDialog>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    if (this.childName.trim()) {
      this.dialogRef.close(this.childName);
    }
  }
}
