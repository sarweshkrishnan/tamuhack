import { Component, OnInit } from '@angular/core';

import { CognitiveService } from '../cognitive.service';
import { OxfordService } from '../oxford.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  keyPhrases;

  constructor(private cgService: CognitiveService, private oxService: OxfordService) { }

  ngOnInit() {
    this.cgService.currentMessage.subscribe(keyPhrases => 
      {       
        this.cgService.getBingResults(keyPhrases)
        .subscribe(
          searches => {
              console.log(searches);
          }
        );

        this.oxService.getMeanings(keyPhrases)
        .subscribe(res => {
          this.keyPhrases = res;
        });
      });
  }

}
