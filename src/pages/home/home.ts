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
    hor: Hor, //[top, center, bottom] -> title[2, 36, 75] & subtitle[18, 52, 91]
    ver: Ver  //[left, center, right] -> title[l2, , r2] & subtitle[l2, , r2]
  };
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
      collection: 'تنیس'
    }, {
      url: 'http://www.psdgraphics.com/file/orange-light-burst.jpg',
      title: 'بدمینتون کار حرفه ای',
      subtitle: 'بیست و یک برد متوالی',
      position: {
        hor: Hor.center,
        ver: Ver.right
      },
      collection: 'بدمینتون'
    }, {
      url: 'https://metrouk2.files.wordpress.com/2018/01/911285518.jpg',
      title: 'رونالدو',
      subtitle: 'بازیکن سال',
      position: {
        hor: Hor.bottom,
        ver: Ver.left
      },
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
      styles['top'] = '75%';

    if(feed.position.ver == Ver.left) {
      styles['text-align'] = 'left';
      styles['left'] = '2%';
    }
    else if(feed.position.ver == Ver.center) {
      styles['text-align'] = 'center';
    }
    else if(feed.position.ver == Ver.right) {
      styles['text-align'] = 'right';
      styles['right'] = '2%';
    }

    return styles;
  }

  setSubtitleStyles(feed: Feed) {
    let styles = {};
    if(feed.position.hor == Hor.top)
      styles['top'] = '18%';
    else if(feed.position.hor == Hor.center)
      styles['top'] = '52%';
    else if(feed.position.hor == Hor.bottom)
      styles['top'] = '91%';

    if(feed.position.ver == Ver.left) {
      styles['text-align'] = 'left';
      styles['left'] = '2%';
    }
    else if(feed.position.ver == Ver.center) {
      styles['text-align'] = 'center';
    }
    else if(feed.position.ver == Ver.right) {
      styles['text-align'] = 'right';
      styles['right'] = '2%';
    }

    return styles;
  }

}
