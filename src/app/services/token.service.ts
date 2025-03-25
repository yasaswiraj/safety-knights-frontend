// token.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  decodeToken(): any {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  getUserId(): string | null {
    const decoded = this.decodeToken();
    return decoded?.sub || null; // Or change to decoded?.user_id if available
  }

  getUserType(): string | null {
    const decoded = this.decodeToken();
    return decoded?.user_type || null;
  }
}
