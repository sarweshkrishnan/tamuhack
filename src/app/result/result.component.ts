import { Component, OnInit } from '@angular/core';

import { CognitiveService } from '../cognitive.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  keyPhrases;

  constructor(private cgService: CognitiveService) { }

  ngOnInit() {
    this.cgService.currentMessage.subscribe(keyPhrases => 
      {
        this.keyPhrases = keyPhrases;
        
        this.cgService.getBingResults(keyPhrases)
        .subscribe(
          searches => {
              console.log(searches);
          }
        );
      });
  }

}
