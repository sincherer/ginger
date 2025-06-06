import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAdjustmentsComponent } from './inventory-adjustments.component';

describe('InventoryAdjustmentsComponent', () => {
  let component: InventoryAdjustmentsComponent;
  let fixture: ComponentFixture<InventoryAdjustmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryAdjustmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryAdjustmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
