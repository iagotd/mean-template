import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { of, Observable } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class DataGuard implements CanActivate {

  constructor(private _authService: AuthService,
    private _router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    if (!localStorage.getItem("token") || !localStorage.getItem("userType")) {
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      this._router.navigate(["/login"]);
      return false;
    }

    if(localStorage.getItem("userType") != "premium" && localStorage.getItem("userType") != "admin") {
      this._router.navigate(["/not-found"]);
      return false;
    }

    return this._authService.verifyToken().pipe(
      catchError(err => {
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        this._router.navigate(['/login']);
        return of(false);
      })
    );
  }

}