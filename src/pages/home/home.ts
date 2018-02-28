import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

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
  // private feeds: Feed[] = [
  //   {
  //     url: 'https://metrouk2.files.wordpress.com/2018/01/911285518.jpg?w=748&h=498&crop=1',
  //     title: 'راجر فدرر',
  //     subtitle: 'او تمام مسابقات را برده است',
  //     position: {
  //       hor: Hor.top,
  //       ver: Ver.center
  //     },
  //     textColor: 'cyan',
  //     collection: 'تنیس'
  //   }, {
  //     url: 'http://www.psdgraphics.com/file/orange-light-burst.jpg',
  //     title: 'بدمینتون کار حرفه ای',
  //     subtitle: 'بیست و یک برد متوالی',
  //     position: {
  //       hor: Hor.center,
  //       ver: Ver.right
  //     },
  //     textColor: 'black',
  //     collection: 'بدمینتون'
  //   }, {
  //     url: 'http://e0.365dm.com/17/12/16-9/20/skysports-cristiano-ronaldo-real-madrid_4176213.jpg?20171207091750',
  //     title: 'رونالدو',
  //     subtitle: 'بازیکن سال',
  //     position: {
  //       hor: Hor.bottom,
  //       ver: Ver.left
  //     },
  //     textColor: 'magenta',
  //     collection: 'فوتبال'
  //   }
  // ];

  private feed_placement: any = [
    {
      'component_name': 'main',
      'variable_name': '',
      'start_date': '',
      'end_date': '',
      'info': {
        'panel_type': 'full',
        'imgUrl': 'https://metrouk2.files.wordpress.com/2018/01/911285518.jpg?w=748&h=498&crop=1',
        'href': '#',
        'topTitle': {
          'title': 'تصاویر این هفته',
          'text': '',
          'color': 'black',
        },
        'areas': [
          {
            'pos': 'left-center',
            'title': 'راجر فدرر',
            'text': 'او تمام مسابقات را برده است',
          },
          {
            'pos': 'card-button',
            'text': 'خرید',
          },
          {
            'pos': 'card-icon'
          }
        ]
      }
    },
    {
      "component_name": "main",
      "variable_name": "",
      "start_date": "",
      "end_date": "",
      "info": {
        "panel_type": "full",
        "imgUrl": "http://www.psdgraphics.com/file/orange-light-burst.jpg",
        "href": "#",
        "areas": [
          {
            "pos": "right-center",
            "title": "بدمینتون کار حرفه ای",
            "text": "بیست و یک برد متوالی",
            "color": "black"
          },
          {
            'pos': 'card-button',
            'text': 'خرید',
          },
          {
            'pos': 'card-icon',
            'color': 'white',
          }
          ]
      }
    },
    {
      "component_name": "main",
      "variable_name": "",
      "start_date": "",
      "end_date": "",
      "info": {
        "panel_type": "full",
        "imgUrl": "http://e0.365dm.com/17/12/16-9/20/skysports-cristiano-ronaldo-real-madrid_4176213.jpg?20171207091750",
        "href": "#",
        "areas": [
          {
            "pos": "left-bottom",
            "title": "رونالدو",
            "text": "بازیکن سال",
          },
          {
            'pos': 'card-button',
            'text': 'خرید'
          },
          {
            'pos': 'card-icon',
            'color': 'white',
          }
        ]
      }
    },
    {
      "component_name": "main",
      "variable_name": "",
      "start_date": "",
      "end_date": "",
      "info": {
        "panel_type": "full",
        "imgUrl": "../../assets/imgs/shoeSample.png",
        "href": "#",
        'topTitle': {
          'title': 'داره مد میشه...',
          'text': '',
          'color': 'black',
        },
        "areas": [
          {
            "pos": "left-bottom",
            "title": "طوسی بی نظیر",
            "text": "زمان درخشیدن توست",
            "color": "black"
          },
          {
            'pos': 'card-button',
            'text': 'خرید',
            'color': 'DARK'
          },
          {
            'pos': 'card-icon',
            'color': 'black',
          }
        ]
      }
    },
    {
      "component_name": "main",
      "variable_name": "",
      "start_date": "",
      "end_date": "",
      "info": {
        "panel_type": "full",
        "imgUrl": "../../assets/imgs/q1.png",
        "href": "#",
        "areas": [
          {
            "pos": "left-top",
            "title": "کفش ورزشی زنانه نایک",
            "text": "مدل پگاسوس",
            "color": "black"
          },
          {
            'pos': 'card-button',
            'text': 'خرید',
            'color': 'DARK'

          },
          {
            'pos': 'card-icon',
            'color': 'black',
          }
        ]
      }
    }
  ]

  constructor(public navCtrl: NavController) {
  }
}
