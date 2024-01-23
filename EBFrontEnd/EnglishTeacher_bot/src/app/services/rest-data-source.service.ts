import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat } from '../models/chat';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8000/api/englishteacher_bot';

@Injectable({
  providedIn: 'root'
})
export class RestDataSourceService {

  constructor(private http: HttpClient) { }

  getId(body:any): Observable<Chat> {
    return this.http.post<Chat>(`${baseUrl}/initialization`,body);
  }

  chat(data: any): Observable<Chat> {
    return this.http.post(`${baseUrl}/chat`,data);
  }

  getChat(): Observable<any> {
    return this.http.get<any>(`${baseUrl}/getChat`);
  }

  getByDate(date: any): Observable<any> {
    const params = new HttpParams().set('date', date);
    return this.http.get(`${baseUrl}/getByDate/`, { params });
  }
}
