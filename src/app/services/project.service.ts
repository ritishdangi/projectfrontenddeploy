import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private baseUrl = 'https://projectbackenddeploy.onrender.com/api/projects';

  constructor(private http: HttpClient) { }

  // 👉 Create Project (POST)
  createProject(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}`, formData);
  }

  // 👉 Get All Projects (Paginated)
  getAllProjects(page: number = 0, size: number = 5): Observable<any> {
    return this.http.get(`${this.baseUrl}?page=${page}&size=${size}`);
  }

  // 👉 Get Project By ID
  getProjectById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // 👉 Update Project (PUT)
  updateProject(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, formData);
  }

  // 👉 Delete Project (DELETE)
  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }
}