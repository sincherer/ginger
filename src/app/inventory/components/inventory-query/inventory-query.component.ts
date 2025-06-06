import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  location: string;
  lastUpdated: Date;
}

@Component({
  selector: 'app-inventory-query',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './inventory-query.component.html',
  styleUrl: './inventory-query.component.scss'
})
export class InventoryQueryComponent implements OnInit {
  queryForm: FormGroup;
  inventoryItems: InventoryItem[] = [];
  categories: string[] = ['Raw Materials', 'Finished Goods', 'Packaging', 'Spare Parts'];

  constructor(private fb: FormBuilder) {
    this.queryForm = this.fb.group({
      searchTerm: [''],
      category: [''],
      minQuantity: [''],
      maxQuantity: [''],
      location: ['']
    });
  }

  ngOnInit(): void {
    // Initialize with sample data
    this.loadInventoryItems();
  }

  loadInventoryItems(): void {
    // TODO: Replace with actual API call
    this.inventoryItems = [
      {
        id: 'INV001',
        name: 'Widget A',
        category: 'Finished Goods',
        quantity: 100,
        unitPrice: 25.99,
        location: 'Warehouse A',
        lastUpdated: new Date()
      }
    ];
  }

  onSearch(): void {
    const filters = this.queryForm.value;
    // TODO: Implement filtering logic
    console.log('Searching with filters:', filters);
  }

  exportToExcel(): void {
    // TODO: Implement export functionality
    console.log('Exporting to Excel...');
  }
}