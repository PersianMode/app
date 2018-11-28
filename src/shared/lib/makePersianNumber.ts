export function makePersianNumber(a: string, isPrice) {
  if (isNaN((+a)))
    return a;
  return (+a).toLocaleString('fa', {useGrouping: isPrice});
}
