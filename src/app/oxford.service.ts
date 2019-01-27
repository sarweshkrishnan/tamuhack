import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OxfordService {

  constructor(private http: HttpClient) { }

  getMeanings(keyPhrases)
  {
    return this.http.get('/api/getMeanings?keyPhrases=' + keyPhrases);
  }
}
