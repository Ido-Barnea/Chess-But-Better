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
    
    static convertPosition(position)
    {
        const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const numbers = []
        let counter = 0;

        for(let i = boardWidth; i > 0; i--)
        {
            numbers[counter] = i;
            counter++;
        }

        let posX = letters[parseInt(position[0])];
        let posY = numbers[parseInt(position[2])];

        return posX + "," + posY;
    }
}