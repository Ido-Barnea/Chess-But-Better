class Logger {
    constructor() {
      this.logs = [];
    }
  
    log(message) 
    {
    
        // Log the message to the console
        console.log(message)
    
        // Store the message in the logs array and post it to logs text;
        document.getElementById("logs").innerHTML = ""
        logs.push(message)
        for(i=0; i<logs.length; i++)
        {
            document.getElementById("logs").innerHTML += logs[i] + '<br />'
        }
    }
} 
//cannot use, import or reference this class in any other javascript file...