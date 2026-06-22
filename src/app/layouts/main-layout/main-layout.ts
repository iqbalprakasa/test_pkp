import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayoutComponent implements OnInit {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  userData: any = {
    firstName: '',
    email: ''
  };

  ngOnInit(): void {
    // Pastikan kode hanya berjalan di browser (aman dari error SSR)
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          // Parse string JSON dari localStorage menjadi object
          this.userData = JSON.parse(savedUser);
        } catch (e) {
          console.error('Gagal memproses data user dari localStorage', e);
        }
      }
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.router.navigate(['/login']);
  }
}