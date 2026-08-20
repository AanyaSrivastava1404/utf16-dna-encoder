
export class TerModeNucConverter {

  static dict = [
    { A: 'C', C: 'G', G: 'T', T: 'A' },
    { A: 'G', C: 'T', G: 'A', T: 'C' },    
    { A: 'T', C: 'A', G: 'C', T: 'G' }
  ]

  static encode(data) {
    let code = TerModeNucConverter._toTer(data);
    let ans = "";
    for(let i=0; i<code.length; i++) {
      if(i == 0) {
        ans += TerModeNucConverter.dict[code[i]].A;
      } else {
        ans += TerModeNucConverter.dict[code[i]][ans[i-1]];
      }
    }
    return {
      terCode: code,
      dnaCode: ans
    };
  }

  static decode(code) {

  }

  static _toTer(data) {
      var ter, i;
      var result = "";
      for (i=0; i<data.length; i++) {
          ter = data.charCodeAt(i).toString(3);
          result += ("00000000000"+ter).slice(-12);
      }
      return result
  }
}
