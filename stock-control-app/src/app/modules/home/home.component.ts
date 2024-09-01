import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from './../../services/user/user.service';
import { SinupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loginCard = true;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService
  ) { }

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  singnUpForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  public onSubmit(): void {
    if (this.loginForm.value && this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as AuthRequest)
      .subscribe({
        next: (response) => {
          if (response) {
            this.cookieService.set('USER_INFO', response?.token);
            this.loginForm.reset();
          }
        },
        error: (err) => console.log(err),
      });
    }
  }

  public onSubmitSingnUpForm(): void {
    if (this.singnUpForm.value && this.singnUpForm.valid) {
      this.userService.signUpUser(this.singnUpForm.value as SinupUserRequest)
      .subscribe({
        next: (response) => {
          if (response) {
            alert('Conta criada com sucesso!');
            this.singnUpForm.reset();
            this.loginCard = true;
          }
        },
        error: (err) => console.log(err),
      });
    }
  }


}
