import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl = 'https://projectbackenddeploy.onrender.com/api/clients';

  constructor(private http: HttpClient) {}

  // CREATE CLIENT (with image upload)
  createClient(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}`, formData);
  }

  // GET ALL CLIENTS (paginated)
  getAllClients(page: number = 0, size: number = 5): Observable<any> {
    return this.http.get(`${this.baseUrl}?page=${page}&size=${size}`);
  }

  // GET CLIENT BY ID
  getClientById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // UPDATE CLIENT
  updateClient(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, formData);
  }

  // DELETE CLIENT
  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`,{ responseType: 'text' });
  }
}