import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class CloudProvider {
  files:any = [
    { url: 'http://localhost:3000/musics/BeliefSystemDarrenHardy_SookhteJet_ir.mp4',
      name: 'Perfect by Ed Sheeran'
    },
    { url: '../assets/perfect.mp3',
      name: 'perfect 2Cellos'
    }
  ];
  getFiles() {
    return of(this.files);
  }
}
