import { Provider } from '@angular/core';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';

import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  DashboardOutline,
  ShoppingCartOutline,
  InboxOutline,
  ShoppingOutline,
  DollarOutline,
  CreditCardOutline,
  BarChartOutline,
  UserOutline,
  ArrowUpOutline,
  ArrowDownOutline,
  WarningOutline,
  ClockCircleOutline,
  AlertOutline
} from '@ant-design/icons-angular/icons';

const icons = [
  MenuFoldOutline,
  MenuUnfoldOutline,
  DashboardOutline,
  ShoppingCartOutline,
  InboxOutline,
  ShoppingOutline,
  DollarOutline,
  CreditCardOutline,
  BarChartOutline,
  UserOutline,
  ArrowUpOutline,
  ArrowDownOutline,
  WarningOutline,
  ClockCircleOutline,
  AlertOutline
];

export function provideNzIcons(): Provider {
  return {
    provide: NZ_ICONS,
    useValue: icons
  };
}