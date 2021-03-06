import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertService } from '@full-fledged/alerts';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string = `${environment.server}/api`;

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  // api request url at backend
  private authUrl: string = `${environment.server}/auth`;

  private defaultLanguage = 'C++';
  private defaultTheme = 'monokai';

  // Todo: Fetched From server (fetch user's all data not only mode and theme)
  private userPreferedLanguage = undefined;
  private userPreferedTheme = undefined;

  private choosen = {
    language: this.userPreferedLanguage || this.defaultLanguage,
    theme: this.userPreferedTheme || this.defaultTheme
  };

  curUser = { userData: { username: "" } };
  constructor(
    private http: HttpClient,
    public router: Router,
    public _alertService: AlertService
  ) { }

  getLanguage() {
    return this.choosen.language;
  }
  // Todo: update in sevrer
  setLanguage(language: String) {
    this.choosen.language = language;
  }
  getTheme() {
    return this.choosen.theme;
  }
  // Todo: update in server
  setTheme(theme: string) {
    this.choosen.theme = theme;
  }

  // API Calls
  getAllUser(type: string, val: any): Observable<any> {
    let existingUser: Observable<any>;
    this.http.get<any>(this.authUrl + '/getAllUsernames').subscribe((data) => {
      existingUser = data.result;
      return existingUser;
    });
    return existingUser;
  }

  signupUser(data: any): Observable<any> {
    return this.http.post<any>(this.authUrl + '/signup', data);
  }

  loginUser(data: any) {
    return this.http.post<any>(this.authUrl + '/signin', data).subscribe((res: any) => {
      localStorage.setItem('access_token', res.result.token);
      this.curUser = res.result;
      console.log(this.curUser);
      this.currentUser = this.curUser.userData;
      this._alertService.success("welcome!");
      this.router.navigate(['/']);
    }, err => {
      this.handleError(err.error.err, err.status);
    });
  }
  itemValue = new Subject<string>();
  get userData(): JSON {
    return JSON.parse(localStorage.getItem('userData'));
  }
  set currentUser(data: any) {
    console.log(data);
    this.itemValue.next(data);
    localStorage.setItem('userData', JSON.stringify(data));
    localStorage.setItem('currentUserName', data.username);
  }
  get currentUser() {
    return localStorage.getItem('currentUserName');
  }
  getToken() {
    return localStorage.getItem('access_token');
  }
  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }
  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    let removeUser = localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserName');
    if (removeToken == null && removeUser == null) {
      this.router.navigate(['/login']);
    }
  }
  verifyToken(token: string) {
    var obj = {
      token: token
    }
    this.http.post<any>(this.authUrl + '/verify-email', obj).subscribe((res) => {
      if (!res.err) {
        // alert("Email verified!");
        this._alertService.success('Email Verified!');
        this.router.navigate(['/login']);
      } else {
        // alert("Invalid token or token expired!");
        this._alertService.warning("Invalid token or token expired!");
      }
    });
  }
  compileRun(data): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/code/compile', data);
  }
  getAllPublicCodes(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/code/all');
  }
  getCodeById(data): Observable<any> {
    return this.http.get<any>(this.apiUrl + `/code/view/${data.currentUser}/${data.id}`);
  }
  getCodesByUser(user: string): Observable<any> {
    console.log(user, this.currentUser);
    console.log(this.apiUrl + '/code/view/' + user);

    if (this.currentUser === user)
      return this.http.get<any>(this.apiUrl + '/code/view/' + user);
    // else
    // return this.http.get<any>(this.apiUrl + '/code/view/public');
  }
  saveCode(data): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/code/save', data);
  }
  updateCode(id, data): Observable<any> {
    return this.http.put<any>(this.apiUrl + `/code/update/${id}`, data);
  }
  getDefaultTemplates(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/code/defaults');
  }
  deleteCodeById(id: string): Observable<any> {
    return this.http.delete<any>(this.apiUrl + `/code/delete/${id}`);
  }
  handleError(error, port) {
    let errorMessage = '';
    errorMessage = `Error Code: ${port}\nMessage: ${error}`;
    this._alertService.danger(errorMessage);
    // window.alert(errorMessage);
    return throwError(errorMessage);
  }
}