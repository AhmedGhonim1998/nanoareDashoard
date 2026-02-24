import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = { username: '', password: '' };
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    this.http.post('https://api.nanocareegypt.com/api/admin/auth/login', this.loginData)
      .subscribe({
        next: (res: any) => {
          // حفظ التوكن في المتصفح
          localStorage.setItem('adminToken', res.token);
          // توجيه الأدمن لصفحة الطلبات
          this.router.navigate(['/admin/orders']);
        },
        error: (err) => {
          this.errorMessage = 'بيانات الدخول غير صحيحة يا مدير!';
        }
      });
  }
}