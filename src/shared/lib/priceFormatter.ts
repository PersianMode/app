export function priceFormatter(p) {
  if (Number.isInteger(+p)) {
    let ret = '';
    (p + '').split('').reverse().forEach((digit, ind) => {
      ret = (+digit).toLocaleString('fa') + ret;
      if (ind % 3 === 2 && ind !== Math.floor(Math.log10(p))) {
        ret = '٫' + ret;
      }
    });
    return ret;
  }else
    return p;
}
