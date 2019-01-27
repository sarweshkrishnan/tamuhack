import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CognitiveService {
  private messageSource = new BehaviorSubject<Object>('default message');
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient) { }

  getKeyPhrases(formData: FormData)
  {
    return this.http.post('/api/getKeyPhrases', formData).subscribe(res => {
      this.messageSource.next(res);
    })
  }

  getBingResults(keyPhrases)
  {
    return this.http.get('/api/getBingSearch?keyPhrases=' + keyPhrases);
  }
  
}
