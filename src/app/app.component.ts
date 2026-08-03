import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,


  ) { }

  private offlineHandler = () => {
    this.router.navigateByUrl('/no-internet');
  };


  // ✅ Centralised — checks ALL possible key names your auth service might use


  ngOnInit(): void {


    if (!navigator.onLine) {
      this.router.navigateByUrl('/no-internet');
    }

    window.addEventListener('offline', this.offlineHandler);

  }

  ngOnDestroy(): void {
    window.removeEventListener('offline', this.offlineHandler);

  }
}