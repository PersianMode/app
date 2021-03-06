import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Navbar, Content, LoadingController} from 'ionic-angular';
import {AuthService} from '../../services/auth.service';
import {FormControl} from '@angular/forms';
import {trigger, state, style, animate, transition} from '@angular/animations';
import {AudioProvider} from '../../services/audio';
import {CANPLAY, LOADEDMETADATA, PLAYING, TIMEUPDATE, LOADSTART, RESET} from './store';
import {Store} from '@ngrx/store';
import {pluck, filter, map, distinctUntilChanged} from 'rxjs/operators';
import {HttpService} from "../../services/http.service";
import {LoadingService} from "../../services/loadingService";
import {PageService} from "../../services/page.service";

@Component({
  selector: 'page-music-player',
  templateUrl: 'music-player.html',
  animations: [
    trigger('showHide', [
      state(
        'active',
        style({
          opacity: 1
        })
      ),
      state(
        'inactive',
        style({
          opacity: 0
        })
      ),
      transition('inactive => active', animate('250ms ease-in')),
      transition('active => inactive', animate('250ms ease-out'))
    ])
  ]
})
export class musicPlayerPage {
  files: any = [];
  seekbar: FormControl = new FormControl("seekbar");
  state: any = {};
  onSeekState: boolean;
  currentFile: any = {};
  displayFooter: string = "inactive";
  loggedIn: Boolean;
  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public audioProvider: AudioProvider,
              public loadingCtrl: LoadingController,
              private store: Store<any>,
              public auth: AuthService,
              private httpService: HttpService,
              private loadingService: LoadingService,
              private pageService: PageService) {
  }

  ionViewWillEnter() {

    this.loadingService.enable({}, 0, () => {
      this.pageService.getPage('my_shop').then(() => {
        this.getTrackInfo();
        this.loadingService.disable();
      }).catch(err => {
        this.loadingService.disable();
      });
    });
  }

  getTrackInfo() {
    this.httpService.get('trackList/get_tracklist').subscribe(
      data => {
        this.files = data;
      },
      err => {
        console.error('Cannot get tracklist ', err);
        let loading = this.loadingCtrl.create({
          content: 'قادر به دریافت لیست آهنگ ها نیستیم. دوباره تلاش کنید'
        });
      }
    );
  }

  presentLoading() {
    let loading = this.loadingCtrl.create({
      content: 'لطفا کمی صبر کنید..'
    });
    loading.present();
    return loading;
  }

  ngOnInit() {
    this.getTrackInfo();
    this.store.select('appState').subscribe((value: any) => {
      this.state = value.media;
    });

    // Resize the Content Screen so that Ionic is aware of footer
    this.store
      .select('appState')
      .pipe(pluck('media', 'canplay'), filter(value => value === true))
      .subscribe(() => {
        this.displayFooter = 'active';
        this.content.resize();
      });

    // Updating the Seekbar based on currentTime
    this.store
      .select('appState')
      .pipe(
        pluck('media', 'timeSec'),
        filter(value => value !== undefined),
        map((value: any) => Number.parseInt(value)),
        distinctUntilChanged()
      )
      .subscribe((value: any) => {
        this.seekbar.setValue(value);
      });
  }

  openFile(track, index) {
    this.currentFile = {index, track};
    this.playStream(`http://localhost:3000${track.path}`);
  }

  resetState() {
    this.audioProvider.stop();
    this.store.dispatch({type: RESET});
  }

  playStream(url) {
    this.resetState();
    this.audioProvider.playStream(url).subscribe(event => {
      const audioObj = event.target;

      switch (event.type) {
        case 'canplay':
          return this.store.dispatch({type: CANPLAY, payload: {value: true}});

        case 'loadedmetadata':
          return this.store.dispatch({
            type: LOADEDMETADATA,
            payload: {
              value: true,
              data: {
                time: this.audioProvider.formatTime(
                  audioObj.duration * 1000,
                  'HH:mm:ss'
                ),
                timeSec: audioObj.duration,
                mediaType: 'mp3'
              }
            }
          });

        case 'playing':
          return this.store.dispatch({type: PLAYING, payload: {value: true}});

        case 'pause':
          return this.store.dispatch({type: PLAYING, payload: {value: false}});

        case 'timeupdate':
          return this.store.dispatch({
            type: TIMEUPDATE,
            payload: {
              timeSec: audioObj.currentTime,
              time: this.audioProvider.formatTime(
                audioObj.currentTime * 1000,
                'HH:mm:ss'
              )
            }
          });

        case 'loadstart':
          return this.store.dispatch({type: LOADSTART, payload: {value: true}});
      }
    });
  }

  pause() {
    this.audioProvider.pause();
  }

  play() {
    this.audioProvider.play();
  }

  stop() {
    this.audioProvider.stop();
  }

  next() {
    let index = this.currentFile.index + 1;
    let file = this.files[index];
    this.openFile(file, index);
  }

  previous() {
    let index = this.currentFile.index - 1;
    let file = this.files[index];
    this.openFile(file, index);
  }

  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }

  onSeekStart() {
    this.onSeekState = this.state.playing;
    if (this.onSeekState) {
      this.pause();
    }
  }

  onSeekEnd(event) {
    if (this.onSeekState) {
      this.audioProvider.seekTo(event.value);
      this.play();
    } else {
      this.audioProvider.seekTo(event.value);
    }
  }

  reset() {
    this.resetState();
    this.currentFile = {};
    this.displayFooter = "inactive";
  }


}





