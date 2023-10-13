export class Logger {
    static log(message) 
    {
        const logsContainer = document.getElementById("logs-container")!;
        logsContainer.innerHTML += `<p>> ${message}</p>`;
        //Scroll to the last log;
        logsContainer.scrollTop = logsContainer.scrollHeight;
    }

    static logMovement(draggedPiece, targetSquare) {
        const fromNotation = this.convertPositionToNotation(draggedPiece.position);
        const toNotation = this.convertPositionToNotation(targetSquare.position);
        this.log(`${draggedPiece.name} moved from ${fromNotation} to ${toNotation}.`);
    }
    
    private static convertPositionToNotation(position)
    {
        const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const numbers = [8, 7, 6, 5, 4, 3, 2, 1];

        let x = letters[parseInt(position[0])];
        let y = numbers[parseInt(position[2])];
        return `${x},${y}`;
    }
}