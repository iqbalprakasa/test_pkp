import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';

  
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService

  ) {}
 

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
 
  login(): void {

    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };
 

    this.authService.login(payload)
      .subscribe({
        next: (response:any) => {
        localStorage.setItem('token', response.token);
        // if (response.user) {
          localStorage.setItem(
            'user',
            JSON.stringify(response)
          );
        // }

        this.router.navigate(['/products']);
      },

      error: (err) => {
        debugger;
        console.error(err);

        this.errorMessage =
          err?.error?.message ||
          'Username atau password salah';

        this.loading = false;
      },

      complete: () => {
        this.loading = false;
      }
    });
 
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}