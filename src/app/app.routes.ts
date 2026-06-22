import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { authGuard } from './guards/auth.guards';
import { Products } from './pages/products/products';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard], // Guard otomatis mengamankan semua halaman di dalam layout ini
    children: [
      { 
        path: 'products', 
        component: Products 
      }
    ]
  },
  { 
    path: '**', 
    redirectTo: 'login' 
  }
];