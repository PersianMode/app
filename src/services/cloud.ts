import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class CloudProvider {
  files:any = [
    { url: 'https://ia801504.us.archive.org/3/items/EdSheeranPerfectOfficialMusicVideoListenVid.com/Ed_Sheeran_-_Perfect_Official_Music_Video%5BListenVid.com%5D.mp3',
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
