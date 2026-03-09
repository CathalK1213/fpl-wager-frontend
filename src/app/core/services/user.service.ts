import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FplEntry } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  linkFplTeam(fplTeamId: number): Observable<FplEntry> {
    return this.http.post<FplEntry>(`${this.apiUrl}/fpl-team`, { fplTeamId });
  }
}
