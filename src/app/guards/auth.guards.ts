import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Jalankan pengecekan hanya jika berada di lingkungan Browser
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');

    if (token) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  }

  // Jika sedang dieksekusi di Server (SSR), izinkan sementara agar proses render server tidak putus/error
  // Browser nantinya akan melakukan pengecekan ulang secara _real_ di client-side.
  return true; 
};