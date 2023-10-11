class Logger {
    static log(message) 
    {
        const logBox = document.getElementById("logBox");
        logBox.innerHTML += `<p>${message}</p>`; // Add message to logBox
        console.log(message); // Print message to the console
        //scroll the logbox to the last log;
        logBox.scrollTop = logBox.scrollHeight;
    }
}