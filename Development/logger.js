class Logger {
    static log(message) 
    {
        const logbox = document.getElementById("logbox");
        // Log the message to the console
        console.log(message);
        document.getElementById("logs").innerHTML += message + "<br />";
        //scroll the logbox to the last log;
        logbox.scrollTop = logbox.scrollHeight;
    }
}