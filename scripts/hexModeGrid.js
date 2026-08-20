import * as wjGrid from '@mescius/wijmo.grid';
import '@mescius/wijmo.styles/wijmo.css';
import '../styles/dna-grid.css';


export class HexModeGrid {
  grid;
  constructor(hostEle) {
    this.grid = new wjGrid.FlexGrid(hostEle, {
      columns: [
        { binding: 'strand', header: 'Strand' },
        { binding: 'base', header: 'Base' },
        { binding: 'hex', header: 'Hex', allowMerging: true },
        { binding: 'raw', header: 'Raw', allowMerging: true },
      ],
      autoGenerateColumns: false,
      itemsSource: [],
      alternatingRowStep: 0,
      headersVisibility: 'Column',
      selectionMode: 'None',
      allowDragging: 'None',
      allowMerging: 'Cells',
      

      formatItem: (s, e) => {
        e.getRow().height = 25;
        e.getColumn().width = 55;
        e.cell.style.fontSize = "12px";

        if(e.panel == s.cells) {
          if(e.col == 0) {
            e.cell.innerHTML = e.row+"";
            e.cell.style.background = "rgba(172, 255, 47, 0.416)";
          }
          else if(e.col == 1) {
            if(e.row % 4 == 0 || e.row % 4 == 1) {
              e.cell.style.background = 'lightgray';
            }
            else {
              e.cell.style.background = 'white';
            }
            switch(e.cell.innerHTML.toLowerCase()) {
              case 'a':
                e.cell.style.color = 'green';
                break;
              case 'g':
                e.cell.style.color = 'blue';
                break;
              case 'c':
                e.cell.style.color = 'red';
                break;
              case 't':
                e.cell.style.color = 'purple';
                break;
            }
          }
          else if(e.col == 2) {
            e.cell.style.fontSize = "15px";
            e.cell.style.display = "flex";
            e.cell.style.alignItems = "center";
            if(e.row % 4 == 0 || e.row % 4 == 1) {
              e.cell.style.background = 'lightgray';
            }
            else {
              e.cell.style.background = 'white';
            }
          }
          else if(e.col == 3) {
            e.cell.style.fontSize = "18px";
            e.cell.style.display = "flex";
            e.cell.style.alignItems = "center";
          }
        }
      }
    });
    this.grid.mergeManager = new CustomMergeManager();
    hostEle.classList.add('grid-style-1');
  }

  updateGrid(codesObject) {
    if(!codesObject) {
      this.grid.itemsSource = [];
      return;
    }
    const src = [];
    const dnaArr = codesObject.dnaCode.split('');
    const hexArr = codesObject.hexCode.split('');
    const rawArr = codesObject.rawData.split('');

    for(let i=0, j=0, k=0; i<dnaArr.length; i++) {
      const ele = {};
      ele['base'] = dnaArr[i];
      ele['hex'] = i%2==0 ? hexArr[j++] : '';
      ele['raw'] = i%8==0 ? rawArr[k++] : '';
      src.push(ele);
    }
    this.grid.itemsSource = src;
  }

  getGrid() {
    return this.grid;
  }
}

class CustomMergeManager extends wjGrid.MergeManager
{
  getMergedRange(p, r, c, clip = true)
  {
    if(!p.grid.allowMerging || !p.grid.getColumn(c).allowMerging) return null;

    let num = c == 2 ? 2 : 8;
    var rng = null;
    
    rng = new wjGrid.CellRange(r, c);

    while (rng.row % num != 0) {
        rng.row--;
    }
    while (rng.row2 % num != num - 1) {
        rng.row2++;
    }
    
    if (rng.isSingleCell) {
        rng = null;
    }
    
    return rng;
  }
}