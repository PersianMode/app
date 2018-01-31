import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

enum Hor {
  top,
  center,
  bottom
}

enum Ver {
  left,
  center,
  right
}

interface Feed {
  url: string;
  title: string;
  subtitle: string;
  position: {
    hor: Hor, //[top, center, bottom] -> title[2, 36, 70] & subtitle[18, 52, 86]
    ver: Ver  //[left, center, right] -> title[l2, , r2] & subtitle[l2, , r2]
  };
  textColor: string;
  collection: string;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  private feeds: Feed[] = [
    {
      url: 'https://metrouk2.files.wordpress.com/2018/01/911285518.jpg?w=748&h=498&crop=1',
      title: 'راجر فدرر',
      subtitle: 'او تمام مسابقات را برده است',
      position: {
        hor: Hor.top,
        ver: Ver.center
      },
      textColor: 'cyan',
      collection: 'تنیس'
    }, {
      url: 'http://www.psdgraphics.com/file/orange-light-burst.jpg',
      title: 'بدمینتون کار حرفه ای',
      subtitle: 'بیست و یک برد متوالی',
      position: {
        hor: Hor.center,
        ver: Ver.right
      },
      textColor: 'black',
      collection: 'بدمینتون'
    }, {
      url: 'http://e0.365dm.com/17/12/16-9/20/skysports-cristiano-ronaldo-real-madrid_4176213.jpg?20171207091750',
      title: 'رونالدو',
      subtitle: 'بازیکن سال',
      position: {
        hor: Hor.bottom,
        ver: Ver.left
      },
      textColor: 'magenta',
      collection: 'فوتبال'
    }
  ];

  constructor(public navCtrl: NavController) {

  }

  setTitleStyles(feed: Feed) {
    let styles = {};
    if(feed.position.hor == Hor.top)
      styles['top'] = '2%';
    else if(feed.position.hor == Hor.center)
      styles['top'] = '36%';
    else if(feed.position.hor == Hor.bottom)
      styles['top'] = '70%';

    if(feed.position.ver == Ver.left) {
      styles['text-align'] = 'left';
      styles['left'] = '2%';
      styles['padding-left'] = '5px';
    }
    else if(feed.position.ver == Ver.center) {
      styles['text-align'] = 'center';
    }
    else if(feed.position.ver == Ver.right) {
      styles['text-align'] = 'right';
      styles['right'] = '2%';
      styles['padding-right'] = '5px';
    }
    styles['color'] = feed.textColor;

    return styles;
  }

  setSubtitleStyles(feed: Feed) {
    let styles = {};
    if(feed.position.hor == Hor.top)
      styles['top'] = '18%';
    else if(feed.position.hor == Hor.center)
      styles['top'] = '52%';
    else if(feed.position.hor == Hor.bottom)
      styles['top'] = '86%';

    if(feed.position.ver == Ver.left) {
      styles['text-align'] = 'left';
      styles['left'] = '2%';
      styles['padding-left'] = '5px';
    }
    else if(feed.position.ver == Ver.center) {
      styles['text-align'] = 'center';
    }
    else if(feed.position.ver == Ver.right) {
      styles['text-align'] = 'right';
      styles['right'] = '2%';
      styles['padding-right'] = '5px';
    }
    styles['color'] = feed.textColor;

    return styles;
  }

}
