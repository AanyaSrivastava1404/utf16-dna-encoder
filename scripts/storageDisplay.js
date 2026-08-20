import '../styles/storage-display.css';

export class StorageDisplay {

  constructor(hostEle, options = {}) {
    this.canvasParent = document.createElement('div');
    this.canvasParent.classList.add('canvas-parent');
    hostEle.append(this.canvasParent);

    this.pixelSize = options.pixelSize ?? 2;
    this.colorA = options.colorA ?? 'green';
    this.colorG = options.colorG ?? 'blue';
    this.colorC = options.colorC ?? 'red';
    this.colorT = options.colorT ?? 'purple';
    this.calcEle = options.calcEle;
  }

  updateDisplay(items, codePath) {
    let c, x, y;
    this.canvasParent.innerHTML = "";

    const fillItemSpace = (ele, canvas, ctx) => {
      c = 0;
      for (; ; x += this.pixelSize) {
        y = 0;
        for (; y < canvas.height; y += this.pixelSize) {
          if(c == ele[codePath].length) return;
          switch(ele[codePath][c++].toLowerCase()) {
            case 'a':
              ctx.fillStyle = this.colorA;
              break;
            case 'g': 
              ctx.fillStyle = this.colorG;
              break;
            case 'c': 
              ctx.fillStyle = this.colorC;
              break;
            case 't': 
              ctx.fillStyle = this.colorT;
              break;
          }
          ctx.fillRect(x, y, this.pixelSize, this.pixelSize);
        }
      }
    }
    
    let totalNuc = 0;
    for(let item of items) {
      x = 0; y = 0;
      let canvas = document.createElement('canvas');
      canvas.classList.add('storage-canvas');
      canvas.height = this.canvasParent.offsetHeight;
      let vert = (item[codePath].length * this.pixelSize) / canvas.height;
      vert = Math.ceil(vert) * this.pixelSize;
      canvas.width = vert;
      let ctx = canvas.getContext('2d');
      this.canvasParent.append(canvas);

      totalNuc += item[codePath].length;
      fillItemSpace(item, canvas, ctx);
    }

    if(this.calcEle) {
      // volume calculations
      let thl = totalNuc * 0.34;
      let v = Math.PI * 4 * thl;
      this.calcEle.innerHTML = v.toFixed(4);
    }
  }
}