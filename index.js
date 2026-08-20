
import './style.css';
import { HexModeGrid } from './scripts/hexModeGrid.js';
import { TerModeGrid } from './scripts/terModeGrid.js';
import { HistoryGrid } from './scripts/historyGrid.js';
import { Terminal } from './scripts/terminal.js';
import { StorageDisplay } from './scripts/storageDisplay.js';
import { HexModeNucConverter } from './scripts/modes/hxModeConverter.js';
import { TerModeNucConverter } from './scripts/modes/msModeConverter.js';

/****************************************************************************************/

const historyHost = document.getElementById('history-host');
const terminalHost = document.getElementById('terminal');
const btnStore  = document.getElementById('btn-store');
const btnClear  = document.getElementById('btn-clear');
const bufferArea = document.getElementById('buffer-inner-area');
const bufferCopy = document.getElementById('copy-buffer');
const bufferClear = document.getElementById('clear-buffer');
const storageDisplayHost = document.getElementById('storage-display');
const amountOfVolume = document.getElementById('amount');
const radioContainer = document.querySelector('.radio-btn-container');

const encodingModes = {
  MSstd : {
    template: `
      <input type="radio" name="std-select" class="radio-std-btn" id="ms-std">
      <label for="ms-std" class="radio-std-label"><strong>MS-std</strong><br>serialized data stream to DNA code via TERNARY encoding</label>
    `,
    gridClass: TerModeGrid,
    encoderClass: TerModeNucConverter,
    checked: false,
    nameTag: 'MSstd'
  },
  HXstd : {
    template: `
      <input type="radio" name="std-select" class="radio-std-btn" id="hx-std">
      <label for="hx-std" class="radio-std-label"><strong>HX-std</strong><br>serialized data stream to DNA code via HEXADECIMAL encoding</label>
    `,
    gridClass: HexModeGrid,
    encoderClass: HexModeNucConverter,
    checked: true,
    nameTag: 'HXstd'
  }
}

/****************************************************************************************/

let crntMode, crntData, activeGrid = null;

function updateMode() {
  adjustSizes()
  activeGrid?.getGrid().dispose();
  crntData = null;
  if(crntMode && encodingModes[crntMode].gridClass) {
    activeGrid = new encodingModes[crntMode].gridClass(document.getElementById('wj-host'));
  }
  updateState();
}

function updateState(gridSource) {
  activeGrid?.updateGrid(gridSource); // update to promise
  if(activeGrid && activeGrid.getGrid().itemsSource.length != 0) {
    btnClear.disabled = false;
    btnStore.disabled = false;
  } else {
    btnClear.disabled = true;
    btnStore.disabled = true;
  }
}

btnClear.addEventListener('click', () => {
  updateState(null);
  crntData = null;
});

btnStore.addEventListener('click', () => {
  const obj = {
    timestamp: new Date(),
    name: 'new data',
    standard: crntMode,
    chars: activeGrid.getGrid().itemsSource.length,
    dnacode: crntData.dnaCode
  }
  historyGrid.getGrid().collectionView.sourceCollection.unshift(obj);
  historyGrid.getGrid().collectionView.refresh();
});

bufferCopy.addEventListener('click', () => {
  navigator.clipboard.writeText(bufferArea.innerHTML);
})

bufferClear.addEventListener('click', () => {
  bufferArea.innerHTML = 'buffer space . . .';
})

/****************************************************************************************/

for(let mode in encodingModes) {
  let div = document.createElement('div');
  div.classList.add('single-radio-btn-container');
  div.innerHTML = encodingModes[mode].template;
  radioContainer.append(div);

  let inp = div.querySelector('input');
  inp.mode = encodingModes[mode].nameTag;
  inp.addEventListener('change', function(e) {
    crntMode = this.mode;
    updateMode();
  });
  (inp.checked = encodingModes[mode].checked) && (crntMode = encodingModes[mode].nameTag);
}

const terminal = new Terminal(terminalHost, {
  'encode': (data) => {
    return new Promise((resolve, reject) => {
      try {
        crntData = encodingModes[crntMode].encoderClass.encode(data);
        crntData.rawData = data;
        updateState(crntData);
        resolve();
      }
      catch {
        reject();
      }
    });
  },
  'decode': (data) => {
    // PENDING ...
    return new Promise((resolve, reject) => {
      try {
        let val = encodingModes[crntMode].encoderClass.decode(data);
        resolve(val);
      }
      catch {
        reject();
      }
    });
  }
});

const historyGrid = new HistoryGrid(historyHost, bufferArea);
const storageDisplay = new StorageDisplay(storageDisplayHost, {
  calcEle: amountOfVolume
});
historyGrid.getGrid().refreshed.addHandler(() => {
  storageDisplay.updateDisplay(historyGrid.getGrid().itemsSource, 'dnacode');
})

window.addEventListener("resize", adjustSizes);

function adjustSizes() {
  if(window.innerWidth > 900) {
    document.getElementById('body1').style.flexDirection = 'row'
    document.getElementById('body1').style.height = '90vh'
    document.getElementById('left').style.width = '50%'
    document.getElementById('left').style.height = '100%'
    document.getElementById('right').style.width = '50%'
    document.getElementById('right').style.height = '100%'
    document.getElementById('st-text').style.fontSize = '80%'
    document.getElementById('st-calc').style.fontSize = '80%'
    document.querySelector('.heading').style.fontSize = '70%'
  }
  else {
    document.getElementById('body1').style.flexDirection = 'column'
    document.getElementById('body1').style.height = '180vh'
    document.getElementById('left').style.width = '100%'
    document.getElementById('left').style.height = '50%'
    document.getElementById('right').style.width = '100%'
    document.getElementById('right').style.height = '50%'
    document.getElementById('st-text').style.fontSize = '60%'
    document.getElementById('st-calc').style.fontSize = '60%'
    document.querySelector('.heading').style.fontSize = '50%'
  }
  if(window.innerWidth > 500) {
    document.querySelectorAll('.nuc-act-label').forEach(ele => ele.style.fontSize = '70%');
    document.querySelectorAll('.radio-std-label').forEach(ele => ele.style.fontSize = '70%');
    document.getElementById('buffer-area').style.width = '95%'
    document.getElementById('buffer-act').style.width = '5%'
    document.getElementById('stack-label').style.width = '5%'
    document.querySelector('.info-h2').style.fontSize = '90%'
    document.querySelector('.info-p2').style.fontSize = '80%'
    document.querySelectorAll('.info-h1').forEach(ele => { ele.style.fontSize = '90%'; })
    document.querySelectorAll('.info-p1').forEach(ele => { ele.style.fontSize = '70%'; })
    document.querySelectorAll('.connects').forEach(ele => { ele.style.fontSize = '100%'; })
    
  }
  else {
    document.querySelectorAll('.nuc-act-label').forEach(ele => ele.style.fontSize = '50%');
    document.querySelectorAll('.radio-std-label').forEach(ele => ele.style.fontSize = '50%');
    document.getElementById('buffer-area').style.width = '90%'
    document.getElementById('buffer-act').style.width = '10%'
    document.getElementById('stack-label').style.width = '10%'
    document.querySelector('.info-h2').style.fontSize = '70%'
    document.querySelector('.info-p2').style.fontSize = '60%'
    document.querySelectorAll('.info-h1').forEach(ele => { ele.style.fontSize = '70%'; })
    document.querySelectorAll('.info-p1').forEach(ele => { ele.style.fontSize = '50%'; })
    document.querySelectorAll('.connects').forEach(ele => { ele.style.fontSize = '100%'; })
    
  }
}

document.readyState === 'complete' ? updateMode() : window.onload = init;
