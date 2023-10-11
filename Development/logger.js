class Logger {
    static log(message) 
    {
        const logBox = document.getElementById("log-box");
        logBox.innerHTML += `<p>${message}</p>`; // Add message to logBox
        console.log(message); // Print message to the console
        //scroll the logbox to the last log;
        logBox.scrollTop = logBox.scrollHeight;
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