import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProposeWagerRequest, WagerResponse, DebtSummary } from '../models/wager';

@Injectable({
  providedIn: 'root'
})
export class WagerService {
  private apiUrl = `${environment.apiUrl}/wagers`;

  constructor(private http: HttpClient) {}

  proposeWager(request: ProposeWagerRequest): Observable<WagerResponse> {
    return this.http.post<WagerResponse>(this.apiUrl, request);
  }

  respondToWager(wagerId: number, action: 'ACCEPT' | 'DECLINE'): Observable<WagerResponse> {
    return this.http.post<WagerResponse>(`${this.apiUrl}/${wagerId}/respond?action=${action}`, {});
  }

  getGroupWagers(groupId: number): Observable<WagerResponse[]> {
    return this.http.get<WagerResponse[]>(`${this.apiUrl}/group/${groupId}`);
  }

  getMyWagers(): Observable<WagerResponse[]> {
    return this.http.get<WagerResponse[]>(`${this.apiUrl}/my`);
  }

  resolveWager(wagerId: number, winnerId: number): Observable<WagerResponse> {
    return this.http.post<WagerResponse>(`${this.apiUrl}/${wagerId}/resolve?winnerId=${winnerId}`, {});
  }

  getMyDebts(groupId: number): Observable<DebtSummary> {
    return this.http.get<DebtSummary>(`${environment.apiUrl}/groups/${groupId}/debts`);
  }
}
