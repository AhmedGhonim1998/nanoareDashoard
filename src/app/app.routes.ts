import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../app/admin/admin-layout/admin-layout..component';
import { OrdersManagementComponent } from './admin/orders-management/orders-management.component';
import { LoginComponent } from './admin/login/login.component';
import { authGuard } from './guard/auth.guard';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // مسار واحد فقط ومحمي بالـ Guard
  { 
    path: 'admin/orders', 
    component: OrdersManagementComponent, 
    canActivate: [authGuard] 
  },

  { path: 'admin-dashboard', component: AdminLayoutComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];