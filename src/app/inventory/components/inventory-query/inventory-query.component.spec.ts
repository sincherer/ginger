import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryQueryComponent } from './inventory-query.component';

describe('InventoryQueryComponent', () => {
  let component: InventoryQueryComponent;
  let fixture: ComponentFixture<InventoryQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryQueryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
