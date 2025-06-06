import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRemindersComponent } from './payment-reminders.component';

describe('PaymentRemindersComponent', () => {
  let component: PaymentRemindersComponent;
  let fixture: ComponentFixture<PaymentRemindersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentRemindersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentRemindersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
