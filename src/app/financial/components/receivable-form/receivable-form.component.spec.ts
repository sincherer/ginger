import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivableFormComponent } from './receivable-form.component';

describe('ReceivableFormComponent', () => {
  let component: ReceivableFormComponent;
  let fixture: ComponentFixture<ReceivableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceivableFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReceivableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
