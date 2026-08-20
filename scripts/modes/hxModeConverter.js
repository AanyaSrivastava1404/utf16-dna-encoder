
export class HexModeNucConverter {
  static dict = {
    0: "AA",
    1: "AG",
    2: "AC",
    3: "AT",
    4: "GA",
    5: "GG",
    6: "GC",
    7: "GT",
    8: "CA",
    9: "CG",
    a: "CC",
    b: "CT",
    c: "TA",
    d: "TG",
    e: "TC",
    f: "TT",
    AA: 0,
    AG: 1,
    AC: 2,
    AT: 3,
    GA: 4,
    GG: 5,
    GC: 6,
    GT: 7,
    CA: 8,
    CG: 9,
    CC: 'a',
    CT: 'b',
    TA: 'c',
    TG: 'd',
    TC: 'e',
    TT: 'f',
  }

  static encode(data) {
    let code = HexModeNucConverter._toHex(data);
    let ans = "";
    for(let char of code) {
      ans += HexModeNucConverter.dict[char];
    }
    return {
      hexCode: code,
      dnaCode: ans
    };
  }

  static decode(code) {
    let ans = "";
    for(let i=0; i<code.length; i++) {
      let wrap = "" + HexModeNucConverter.dict[code[i] + code[++i]]
                    + HexModeNucConverter.dict[code[++i] + code[++i]]
                    + HexModeNucConverter.dict[code[++i] + code[++i]]
                    + HexModeNucConverter.dict[code[++i] + code[++i]];
      ans += String.fromCharCode(Number.parseInt(wrap, 16));
    }
    return ans;
  }

  static _toHex(data) {
      var hex, i;
      var result = "";
      for (i=0; i<data.length; i++) {
          hex = data.charCodeAt(i).toString(16);
          result += ("000"+hex).slice(-4);
      }
      return result
  }
}

// hello -> 00680065006c006c006f