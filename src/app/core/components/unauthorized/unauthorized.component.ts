import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, NzResultModule, NzButtonModule, NzIconModule],
  template: `
    <div class="unauthorized-container">
      <nz-result
        nzStatus="403"
        nzTitle="403"
        nzSubTitle="Sorry, you are not authorized to access this page."
      >
        <div nz-result-extra class="button-group">
          <button 
            nz-button 
            nzType="default" 
            nzSize="large"
            class="back-button"
            (click)="goBack()"
          >
            <i nz-icon nzType="arrow-left"></i>
            Go Back
          </button>
          <button 
            nz-button 
            nzType="primary" 
            nzSize="large"
            class="home-button"
            (click)="goHome()"
          >
            <i nz-icon nzType="home"></i>
            Go Home
          </button>
        </div>
      </nz-result>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      background: #f5f5f5;
    }

    .unauthorized-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 500px;
    }

    .button-group {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 24px;
    }

    .back-button, .home-button {
      min-width: 120px;
      height: 40px;
      border-radius: 6px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .back-button {
      background: #fff;
      border: 1px solid #d9d9d9;
      color: #595959;
    }

    .back-button:hover {
      background: #f5f5f5;
      border-color: #40a9ff;
      color: #40a9ff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(64, 169, 255, 0.2);
    }

    .home-button {
      background: #1890ff;
      border: 1px solid #1890ff;
      color: #fff;
    }

    .home-button:hover {
      background: #40a9ff;
      border-color: #40a9ff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
    }

    .back-button:focus, .home-button:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }

    .back-button:active, .home-button:active {
      transform: translateY(0);
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .unauthorized-container {
        padding: 16px;
      }
      
      .button-group {
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }
      
      .back-button, .home-button {
        width: 100%;
        max-width: 200px;
      }
    }

    /* Custom result styling */
    ::ng-deep .ant-result {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 12px;
      padding: 48px 32px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      max-width: 500px;
      margin: 0 auto;
    }

    ::ng-deep .ant-result-title {
      color: #ff4d4f !important;
      font-weight: 600;
    }

    ::ng-deep .ant-result-subtitle {
      color: #8c8c8c;
      font-size: 16px;
      line-height: 1.5;
    }

    ::ng-deep .ant-result-icon .anticon {
      font-size: 72px;
    }
  `]
})
export class UnauthorizedComponent {
  constructor(
    private router: Router,
    private location: Location
  ) {}

  goBack() {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      this.location.back();
    } else {
      // If no history, go to home instead
      this.goHome();
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }
}