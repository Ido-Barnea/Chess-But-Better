class Logger {
    static log(message) 
    {
        const logBox = document.getElementById("log-box");
        logBox.innerHTML += `<p>> ${message}</p>`;
        //scroll the logbox to the last log;
        logBox.scrollTop = logBox.scrollHeight;
    }
}