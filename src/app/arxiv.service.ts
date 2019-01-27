import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArxivService {

  constructor(private http: HttpClient) { }

  getDocs(keyPhrases){
    return this.http.get('/api/getDocuments?keyPhrases=' + keyPhrases);
  }
}
