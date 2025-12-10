import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private baseUrl = 'https://projectbackenddeploy.onrender.com/api/contracts';

  constructor(private http: HttpClient) {}

  // 👉 Create Contact (POST)
  createContact(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data);
  }

  // 👉 Get All Contacts (Paginated)
  getAllContacts(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/all?page=${page}&size=${size}`);
  }
}