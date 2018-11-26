import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import * as convert from 'color-convert';
import {AuthService} from './auth.service';

@Injectable()
export class DictionaryService {
  wordDictionary: any = {};
  colorDictionary: any = {};
  shoesSizeMap: any = {};
  isEU = false;

  constructor(httpService: HttpService, private auth: AuthService) {

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

  setShoesSize(oldSize, gender, type) {
    // this.isEU = this.auth.userDetails.shoesType === 'EU';
    this.isEU = true;
    if (type) {
      if (type.name)
        type = type.name;
      if (this.isEU && type.toUpperCase() === 'FOOTWEAR')
        return this.USToEU(oldSize, gender);
    }
    return this.translateWord(oldSize);
  }

  USToEU(oldSize, gender) {
    let returnValue: any;
    const g = (gender && gender.toUpperCase() === 'WOMENS') ? 'women' : 'men';
    if (this.shoesSizeMap[g])
      returnValue = this.shoesSizeMap[g].find(size => size.us === oldSize);

    if (!returnValue || !returnValue.eu)
      return this.translateWord(oldSize);

    return this.translateWord(returnValue.eu);
  }

}
