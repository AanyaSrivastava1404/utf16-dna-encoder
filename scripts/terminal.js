import '../styles/terminal.css'

export class Terminal {
  commandTemplate;
  terminalHost;
  commandOptions;
  inputElement;
  historyElement;

  constructor(hostEle, cmdOpt) {
    this.terminalHost = hostEle;
    this.commandOptions = cmdOpt;

    this.commandTemplate = `<div id="history"></div><div id="cmd-temp-wrap"><span><strong>NucCmd&#62</strong></span><textarea id="cmd-area"></textarea></div>`;

    this.terminalHost.innerHTML = this.commandTemplate;
    this.historyElement = this.terminalHost.querySelector('#history');
    this.inputElement = this.terminalHost.querySelector('textarea');

    this._init();
  }

  _init() {
    this.terminalHost.addEventListener('keydown', (e) => {
      if(e.key == 'Enter' && !e.shiftKey) {
        e.preventDefault()
        /***************************************************************************************/
        let msg = "";
        this._execute()
        .then(
          (txt) => {
            msg = txt ?? "success";
          },
          () => {
            msg = "ERROR - invalid input";
          }
        )
        .finally(
          () => {
            this.historyElement.innerHTML += `<div><span><strong>NucCmd&#62 </strong></span><span class="history-txt">${this.inputElement.value}</span></div>`;
            this.historyElement.innerHTML += `<div><span><strong>NucCmd&#62 </strong></span><span class="result-ack">${msg}</span></div>`;
            this.inputElement.value = "";
            this.inputElement.style.height = 'auto';
          }
        );
        /***************************************************************************************/
      }
    }, true);

    this.terminalHost.addEventListener('click', (e) => {
      this.inputElement.focus()
    }, true);

    this.inputElement.addEventListener('input', (e) => {
      this.inputElement.style.height = 'auto';
      this.inputElement.style.height = e.target.scrollHeight + 'px';
    });
  }

  _execute() {
    let cmdPass = false, cmdKey = "";
    
    for(let option in this.commandOptions) {
      if(this.inputElement.value.startsWith(option+' ')) {
        cmdPass = true;
        cmdKey = option;
        break;
      }
    }

    if(!cmdPass) return new Promise((res, rej) => { rej(); });

    let func = this.commandOptions[cmdKey]; // linked function
    let param = this.inputElement.value.substring(cmdKey.length + 1); // data as parameter
    if(!func || !param) return new Promise((res, rej) => { rej(); });

    return func(param);
  }
}