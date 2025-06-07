import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, NzResultModule, NzButtonModule],
  template: `
    <div class="h-full flex items-center justify-center p-6">
      <nz-result
        nzStatus="403"
        nzTitle="403"
        nzSubTitle="Sorry, you are not authorized to access this page."
      >
        <div nz-result-extra>
          <button nz-button nzType="primary" (click)="goBack()">Go Back</button>
          <button nz-button (click)="goHome()">Go Home</button>
        </div>
      </nz-result>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goBack() {
    window.history.back();
  }

  goHome() {
    this.router.navigate(['/']);
  }
}