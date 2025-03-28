import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',

})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router:Router){}

  onSubmit(form: NgForm){
    if(form.valid){
      this.authService.login(this.username, this.password)
      .subscribe({
        next:(res)=>{
          this.authService.saveToken(res.token);
          this.router.navigate(['/dashboard']);
        },
       error: (err)=>{
        console.error('Login failed: ', err);
        alert('Login failed '+ (err.error.error)|| 'Check credentials')
       }
      });
    }
  }
}
