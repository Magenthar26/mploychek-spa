import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router){}

  onSubmit(form: NgForm){
    if(form.valid){
      this.authService.register(this.username, this.password)
      .subscribe({
        next:()=>{
          alert('Registration successful! Please log in.');
          this.router.navigate(['/login'])
        },
        error: (err)=>{
          console.error('Registration failed.', err);
          alert('Registration failed: '+(err.error?.message || "Unknown error"))
        }
      });
    }
  }
}
