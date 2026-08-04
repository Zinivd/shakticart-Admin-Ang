import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiServicesService } from '../../apiservice/api-services.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  quotes: string[] = [
    "Small steps, taken daily, build the biggest empires.",
    "Discipline is choosing between what you want now and what you want most.",
    "Every order fulfilled is a promise kept.",
    "Growth is a series of small, consistent wins.",
    "Great businesses are built one decision at a time.",
    "Focus on progress, not perfection.",
    "The best time to act was yesterday. The next best time is now.",
    "Consistency turns effort into results.",
    "A strong foundation makes every step forward easier.",
    "Success is built in the quiet hours of preparation.",
    "Clarity today creates momentum tomorrow.",
    "Systems outlast motivation. Build the system.",
    "The details you manage today shape the trust you earn tomorrow.",
    "Every dashboard tells a story — make it a good one.",
    "Precision in the back-end creates confidence in the front-end.",
    "Data without action is just noise.",
    "Ownership is doing the right thing even when no one's watching.",
    "Efficiency is doing better what is already being done.",
    "The strongest teams move with quiet confidence.",
    "Your effort today is someone else's convenience tomorrow.",
    "Great admins don't manage chaos — they prevent it.",
    "Every login is a new chance to build something better.",
    "Simplicity is the ultimate sophistication in operations.",
    "Speed matters, but accuracy matters more.",
    "The strongest systems are the ones nobody notices — because they just work.",
    "Trust is earned in the details, not the headlines.",
    "Momentum is built one completed task at a time.",
    "Good habits compound faster than good intentions.",
    "Control the process, and the results will follow.",
    "The best dashboards make hard decisions feel simple."
  ];

  quoteOfTheDay: string = '';

  constructor(
    private apiServices: ApiServicesService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.setDailyQuote();
  }

  private setDailyQuote(): void {
    // Generates a day-of-year number so the quote changes automatically every day
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    const index = dayOfYear % this.quotes.length;
    this.quoteOfTheDay = this.quotes[index];
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.toastr.error('Please enter email and password');
      return;
    }
    // Hook your auth/login API call here
    console.log('Login attempt:', { email: this.email, password: this.password });

    const payload = {
      email: this.email,
      password: this.password
    };

    this.apiServices.loginApi(payload).subscribe({
      next: (res: any) => {
        if (res.success === true) {


          localStorage.setItem("token", res.token);
          localStorage.setItem("user_type", res.user.user_type);
          localStorage.setItem("unique_id", res.user.unique_id);
          localStorage.setItem("email", res.user.email);

          this.router.navigate(['/superadmin/dashboard']);
          this.toastr.success('Login successful');
        }
      },
      error: (err: any) => {
        console.log(err);
        this.toastr.error('Invalid email or password');
      }
    });
  }
}