import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PoNotificationService } from '@po-ui/ng-components';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router,
    private poNotification: PoNotificationService,
    private loginService: LoginService) { }

  ngOnInit(): void {
  }

  login(formData: any){
    this.loginService.login(formData.login,formData.password)
    .subscribe(res =>
      {
        if (res.success)
        {
          this.router.navigateByUrl('product',{state: {success: res.success}});
        }
        else
          this.poNotification.error("Incorrect Login");

      });

  }

}
