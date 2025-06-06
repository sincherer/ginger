import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAdjustmentFormComponent } from './inventory-adjustment-form.component';

describe('InventoryAdjustmentFormComponent', () => {
  let component: InventoryAdjustmentFormComponent;
  let fixture: ComponentFixture<InventoryAdjustmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryAdjustmentFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryAdjustmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
