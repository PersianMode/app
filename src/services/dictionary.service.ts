import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import * as convert from 'color-convert';

@Injectable()
export class DictionaryService {
  wordDictionary: any = {};
  colorDictionary: any = {};

  constructor(httpService: HttpService) {

    httpService.get('dictionary').subscribe((res: any) => {

      res.forEach(x => {
        if (x.type === 'tag') {
          this.wordDictionary[x.name] = x.value;
        } else if (x.type === 'color') {
          this.colorDictionary[x.name] = x.value;
        }
      });
    });
  }

  translateWord(word: string | number): string {
    const translation = this.wordDictionary[(word + '').toUpperCase()];
    if (translation)
      return translation;
    else if (+word) {
      return (+word).toLocaleString('fa', {useGrouping: false});
    }
    return word + '';
  }


  convertColor(color: string): string {
    let convertedColor = this.colorDictionary[color.toUpperCase()];
    if (!convertedColor) {
      convertedColor = color;
    }

    try {
      convertedColor = this.colorConverter(convertedColor);
    } catch (e) {
      return null;
    }

    return convertedColor;
  }

  colorConverter(col) {

    if(col.charAt(0) !== '#')
    {
      let arr = convert.keyword.rgb(col.toLowerCase());
      return '#' + convert.rgb.hex(arr);
    }
    else
      return col;
  };



}
