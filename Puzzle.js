//Ehsan Kiani Far

const GameState = Object.freeze({
    START:   Symbol("start"),
    SELECT:  Symbol("select"),
    BEGIN:   Symbol("begin"),
    PLAYING: Symbol("playing"),
    END:   Symbol("end")
});
const NOT_USED_NUMBER=255;

export default class Puzzle{    
    constructor(){
        //The core matrix that game made from it
        this.aCore = [  [1,2,3,4,5,6,7,8,9],
                        [2,3,4,5,6,7,8,9,1],
                        [3,4,5,6,7,8,9,1,2],
                        [4,5,6,7,8,9,1,2,3],
                        [5,6,7,8,9,1,2,3,4],
                        [6,7,8,9,1,2,3,4,5],
                        [7,8,9,1,2,3,4,5,6],
                        [8,9,1,2,3,4,5,6,7],
                        [9,1,2,3,4,5,6,7,8]];
        
        //the current game state
        this.stateCur = GameState.START;

        //default missing numbers list
        this.aMissing = [1,3,5,7,9,2,4,6,8];
    }
    //generate a text that can be viewed by user
    generateOutput(){
        let sResult = "";
        for(let i=0; i<this.aCore.length; i++){
            for(let j=0; j<this.aCore[i].length; j++){
                if(this.aCore[i][j]==this.aMissing[i]){
                    sResult+="?&#32;&#32;";
                }
                else{
                    sResult+=this.aCore[i][j]+"&#32;&#32;";
                }
                //best practice is like that but only if give me marks
                //sResult+=aCore[i][j]==aMissing[i]? "?  ": sResult+=aCore[i][j]+"  ";
            }
            if(this.aMissing[i]<10 && this.aMissing[i]>0){
                sResult+="&#171;";
            }
            //go to next line
            sResult+="\n";
        }
        return sResult;
    }
    //check user input
    checkInput(nUserInput){
        if(nUserInput<10 && nUserInput>0){
            for(let i=0; i<this.aMissing.length; i++){                
                if (this.aMissing[i]==nUserInput){
                    //correct
                    if(i==this.aMissing.length-1){
                        //win
                        this.aMissing[i]=NOT_USED_NUMBER;
                        return "win";
                    }
                    else{
                        //continue
                        this.aMissing[i]=NOT_USED_NUMBER;
                        return "correct";
                    }
                }
                else if(this.aMissing[i]!=NOT_USED_NUMBER){
                    //lose
                    this.aMissing[i]=NOT_USED_NUMBER;
                    return "lose";
                }
            }
        }
        else{
            //wrong input
            return "wrong";
        }
    }
    //this method shuffle tha matrix based on 2 random number in X and Y axis
    shuffleMatrix(){
        //Deep cloning main matrix
        let aTempCore=JSON.parse(JSON.stringify(this.aCore));
        let nRandomX=Math.floor(Math.random()*9);
        let nRandomY=Math.floor(Math.random()*9);
        for(let i=0;i<aTempCore.length; i++){
            for(let j=0; j<aTempCore[i].length; j++){
                this.aCore[nRandomX][nRandomY]=aTempCore[i][j];
                nRandomY++;
                if(nRandomY==aTempCore[i].length){
                    nRandomY=0;
                }
            }
            nRandomX++;
            if(nRandomX==aTempCore.length){
                nRandomX=0;
            }
        }
        
    }
    //this method randomize the missing numbers;
    randomize(){
        for(let i=0 ; i<this.aMissing.length ; i++){
            this.aMissing[i]=Math.ceil(Math.random()*9);
        }
    }
    takeTurn(sInput){
        sInput=sInput.toLowerCase();
        //very beginning of the game
        if(this.stateCur==GameState.START){
            this.stateCur=GameState.SELECT;
            return "Please select game level\n[Easy] [Medium] [Hard] [Default]";
        }
        //select level
        else if(this.stateCur==GameState.SELECT){
            switch(sInput){
                case "easy":
                    this.stateCur=GameState.BEGIN;
                    break;
                case "medium":
                    this.stateCur=GameState.BEGIN;
                    this.shuffleMatrix();
                    break;
                case "hard":
                    this.stateCur=GameState.BEGIN;
                    this.shuffleMatrix();
                    this.randomize();
                    break;
                case "default":
                    this.stateCur=GameState.BEGIN;
                    break;
                default:
                    return "You should select between easy, medium, hard, and default";
                    break;
            }
            return "Please send [start] to begin the game or send [help] to get help";
        }
        //before playing the game
        else if(this.stateCur==GameState.BEGIN){
            switch(sInput){
                case "start":
                    this.stateCur=GameState.PLAYING;
                    return (this.generateOutput()+"Insert a number between 1 and 9 to replace first ?. It should be unique in row and column");
                    break;
                case "help":
                    return "You should insert a number to fill the ? and it should be unique in the row and column";
                    break;
                default :
                    return "Wrong input";
                    break;
            }
        }
        //during play
        else if(this.stateCur==GameState.PLAYING){
            if(sInput=="help"){
                return "Just check what number should be instead of the first question mark!"
            }
            else if(sInput=="answer"){
                for(let i=0; i<this.aMissing.length; i++){
                    if(this.aMissing[i]!= NOT_USED_NUMBER){
                        return "Your answer is: " +this.aMissing[i];
                    }
                }
            }
            else if(sInput=="exit"){
                this.stateCur=GameState.END;
                return "Thank you for playing. if you want to start again insert [again]"
            }
            switch (this.checkInput(sInput)){
                case "win":
                    //user win
                    this.stateCur=GameState.END;
                    return (this.generateOutput()+"You finished the game successfully.\n to repeat the game insert [again]");
                    break;
                case "lose":
                    //user lose
                    this.stateCur=GameState.END;
                    return (this.generateOutput()+"Sorry! You lost the game.\n to repeat the game insert [again]");
                    break;
                case "correct":
                    //keep going
                    return (this.generateOutput()+"Correct! Keep going.");
                    break;
                case "wrong":
                    //wrong user input
                    return "Please insert a number between 1 and 9";
                    break;
            }
        }
        //End of the game
        else if(this.stateCur==GameState.END){
            //Reinitialize tha matrix
            this.aCore = [  [1,2,3,4,5,6,7,8,9],
                            [2,3,4,5,6,7,8,9,1],
                            [3,4,5,6,7,8,9,1,2],
                            [4,5,6,7,8,9,1,2,3],
                            [5,6,7,8,9,1,2,3,4],
                            [6,7,8,9,1,2,3,4,5],
                            [7,8,9,1,2,3,4,5,6],
                            [8,9,1,2,3,4,5,6,7],
                            [9,1,2,3,4,5,6,7,8]];
            //reinitialize the missing numbers
            this.aMissing = [1,3,5,7,9,2,4,6,8];
            switch(sInput){
                case "again":
                    //play again
                    this.stateCur=GameState.START;
                    return "Now you are at the beginning of the game. insert anything to start.";
                    break;
                case "help":
                    return "You finished a game! now you have the option to play again or stay here forever";
                    break;
                case "about":
                    return "My name is Ehsan Kiani Far and this is may school project";
                    break;
                default:
                    return "Wrong input";
                    break;
            }
        }
    }
}