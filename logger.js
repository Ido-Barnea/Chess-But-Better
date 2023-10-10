class Logger {
    static log(message) 
    {
        // Log the message to the console
        console.log(message);
        document.getElementById("logs").innerHTML += message + "<br />";
    }
}