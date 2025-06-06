import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReturnFormComponent } from './sales-return-form.component';

describe('SalesReturnFormComponent', () => {
  let component: SalesReturnFormComponent;
  let fixture: ComponentFixture<SalesReturnFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesReturnFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesReturnFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
