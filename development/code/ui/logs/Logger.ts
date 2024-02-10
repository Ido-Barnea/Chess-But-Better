import { Log } from './Log';

export class Logger {
  static queue: Array<Log> = []; 

  static logMessages() {
    this.queue.forEach(log => {
      this.logMessage(log);
    });
    this.queue = [];
  }

  private static logMessage(log: Log) {
    const logsContainer = document.getElementById('logs-container');
    if (!logsContainer) return;

    logsContainer.innerHTML += `<p class="${log.color}";>> ${log.message}</p>`;
    logsContainer.scrollTop = logsContainer.scrollHeight; // Scroll to the last log
  }
}
