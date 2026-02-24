import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('adminToken');

  console.log('Token Status:', token); // 👈 ضيف ده عشان تشوف في الـ Console التوكن موجود ولا لا

  if (token && token !== 'undefined' && token !== 'null') {
    return true; 
  } else {
    console.log('Access Denied! Redirecting...');
    router.navigate(['/login']); 
    return false; 
  }
};