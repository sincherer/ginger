import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReminderFormComponent } from './payment-reminder-form.component';

describe('PaymentReminderFormComponent', () => {
  let component: PaymentReminderFormComponent;
  let fixture: ComponentFixture<PaymentReminderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentReminderFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentReminderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
