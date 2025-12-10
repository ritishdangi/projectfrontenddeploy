import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  private baseUrl = 'https://projectbackenddeploy.onrender.com/api/newsletter';

  constructor(private http: HttpClient) {}

  // Subscribe a user (POST)
  subscribe(data: { email: string; subscribedAt?: string  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/subscribe`, data);
  }

  // Get all subscribed users (GET with pagination)
  getAllSubscribers(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/all?page=${page}&size=${size}`);
  }
}