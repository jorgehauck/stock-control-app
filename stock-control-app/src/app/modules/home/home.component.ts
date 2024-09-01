import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loginCard = true;

  constructor(private formBuilder: FormBuilder) { }

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
    console.log("DADOS DO FORMULÁRIO DE LOGIN", this.loginForm.value);
  }

  public onSubmitSingnUpForm(): void {
    console.log("DADOS DO FORMULÁRIO DE CRIAÇÃO DE CONTA", this.singnUpForm.value);
  }


}
