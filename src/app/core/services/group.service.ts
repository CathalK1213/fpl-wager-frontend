import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateGroupRequest, GroupResponse, LeaderboardResponse } from '../models/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = `${environment.apiUrl}/groups`;

  constructor(private http: HttpClient) {}

  createGroup(request: CreateGroupRequest): Observable<GroupResponse> {
    return this.http.post<GroupResponse>(this.apiUrl, request);
  }

  joinGroup(inviteCode: string): Observable<GroupResponse> {
    return this.http.post<GroupResponse>(`${this.apiUrl}/join/${inviteCode}`, {});
  }

  getMyGroups(): Observable<GroupResponse[]> {
    return this.http.get<GroupResponse[]>(this.apiUrl);
  }

  getGroup(groupId: number): Observable<GroupResponse> {
    return this.http.get<GroupResponse>(`${this.apiUrl}/${groupId}`);
  }

  getLeaderboard(groupId: number): Observable<LeaderboardResponse> {
    return this.http.get<LeaderboardResponse>(`${this.apiUrl}/${groupId}/leaderboard`);
  }
}
