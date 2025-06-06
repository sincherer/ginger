import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface StockEntry {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  supplier: string;
  purchaseOrderNo: string;
  receivedDate: Date;
  notes: string;
}

@Component({
  selector: 'app-stock-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './stock-in.component.html',
  styleUrl: './stock-in.component.scss'
})
export class StockInComponent implements OnInit {
  stockInForm: FormGroup;
  recentEntries: StockEntry[] = [];

  constructor(private fb: FormBuilder) {
    this.stockInForm = this.fb.group({
      itemId: ['', Validators.required],
      itemName: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      unitPrice: ['', [Validators.required, Validators.min(0)]],
      supplier: ['', Validators.required],
      purchaseOrderNo: ['', Validators.required],
      receivedDate: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadRecentEntries();
  }

  onSubmit(): void {
    if (this.stockInForm.valid) {
      const entry: StockEntry = {
        id: this.generateEntryId(),
        ...this.stockInForm.value,
        receivedDate: new Date(this.stockInForm.value.receivedDate)
      };
      this.saveStockEntry(entry);
    }
  }

  private generateEntryId(): string {
    return `STK-${Date.now()}`;
  }

  private saveStockEntry(entry: StockEntry): void {
    // TODO: Implement API call to save entry
    this.recentEntries.unshift(entry);
    this.stockInForm.reset();
  }

  private loadRecentEntries(): void {
    // TODO: Load recent entries from API
    this.recentEntries = [];
  }
}