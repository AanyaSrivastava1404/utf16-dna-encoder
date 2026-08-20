import * as wjGrid from '@mescius/wijmo.grid';
import '@mescius/wijmo.styles/wijmo.css';
import '../styles/history-grid.css';

export class HistoryGrid {
  grid;
  constructor(hostEle, bufferDiv) {
    this.grid = new wjGrid.FlexGrid(hostEle, {
      columns: [
        { binding: 'timestamp', header: 'Timestamp', width: 180, dataType: 'Date', format: 'dd/MM/yyyy-hh:mm:ss:ffff', isReadOnly: true },
        { binding: 'name', header: 'Name', width: 100, isReadOnly: false },
        { binding: 'standard', header: 'Standard', width: 68, isReadOnly: true },
        { binding: 'chars', header: 'Length', width: 55, isReadOnly: true },
        { binding: 'action', header: 'Action', width: 150, isReadOnly: true },
      ],
      autoGenerateColumns: false,
      itemsSource: [],
      selectionMode: 'Cell',
      allowDragging: 'Columns',

      formatItem: (s, e) => {
        e.cell.style.fontSize = "12px";
        if(e.panel == s.cells) {
          e.getRow().height = 35;

          if(e.getColumn().binding == 'action') {
            let actionTemplate = `<div class="act-div">
                <button class="act-btn buffer">BUFFER</button>
                <button class="act-btn delete">DELETE</button>
                </div>
            `;
            e.cell.innerHTML = actionTemplate;

            let crntRow = e.row;
            e.cell.querySelector('.delete').addEventListener("click", () => {
              s.collectionView.removeAt(crntRow);
            });
            e.cell.querySelector('.buffer').addEventListener("click", () => {
              bufferDiv.innerHTML = s.itemsSource[crntRow].dnacode;
            });

            return;
          }
          else if(e.getColumn().binding == 'timestamp') {
            e.cell.style.fontWeight = '550'
          }
          e.cell.style.display = 'flex';
          e.cell.style.alignItems = 'center';
        }
      }
    });
    hostEle.classList.add('grid-style-2');
  }

  getGrid() {
    return this.grid;
  }
}