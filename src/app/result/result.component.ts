import { Component, OnInit } from '@angular/core';

import { CognitiveService } from '../cognitive.service';
import { OxfordService } from '../oxford.service';
import { ArxivService } from '../arxiv.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  keyPhrases;
  searches;
  papers;

  constructor(private cgService: CognitiveService, private oxService: OxfordService, private axService: ArxivService) { }

  ngOnInit() {
    this.cgService.currentMessage.subscribe(keyPhrases => 
      {       
        this.cgService.getBingResults(keyPhrases)
        .subscribe(
          searches => {
            this.searches = searches;
          }
        );

        this.oxService.getMeanings(keyPhrases)
        .subscribe(res => {
          this.keyPhrases = res;
        });

        this.axService.getDocs(keyPhrases)
        .subscribe(res => {
          this.papers = res;
        });
      });
  }

}
