import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CoreModule, AuthModule],
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class AppComponent {
  title = 'ERP Lite';
}