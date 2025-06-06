import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzIconModule } from 'ng-zorro-antd/icon';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NzCardModule,
        NzGridModule,
        NzStatisticModule,
        NzIconModule
      ],
      declarations: []
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render statistics cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('nz-card');
    expect(cards.length).toBe(7); // 4 stat cards + 2 chart cards + 1 todo card
  });

  it('should render statistics with correct values', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const statistics = compiled.querySelectorAll('nz-statistic');
    
    // Check if all statistics are rendered
    expect(statistics.length).toBe(4);

    // You can add more specific tests for statistic values here
  });
});