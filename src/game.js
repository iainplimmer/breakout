var BreakOut = (function() {

    //  Set our constants first for the game rate and window size......
    const refreshRateInMilliseconds = 5;
    const canvasWidth = 600;
    const canvasHeight = 400;

    //  For the player and paddle
    const defaultPaddleWidth = 100;
    const defaultPaddleHeight = 5;
    const defaultBallRadius = 5;
    const defaultLives = 3;

    //  For the wall
    const defaultBricksPerRow = 6;
    const defaultBrickRows = 3;
    const defaultBrickHeight = 20;

    //  For control keys
    const leftKey = 122;    // Z
    const righttKey = 109;  // M

    //  Finally, create any common variables that are needed here that are shared thoughout the game, these are 
    //  named in uppercase so that they are more visible, i'm not just passing around functions at the moment
    var CANVAS;
    var CTX;    
    var BALL = {};           //  Current ball object state
    var PLAYER = {};         //  Current player/paddle information  
    var WALL = [];           //  Stores the information about the wall 
         
    //  Function to call that sets up the game canvas, sets up the canvas,
    //  the event listener and then starts the ball and the game
    function Setup () {
        CANVAS = document.getElementById('GameCanvas');
        CTX = CANVAS.getContext("2d");
        CANVAS.width  = canvasWidth;    
        CANVAS.height = canvasHeight;

        //  Let's listen for when the player presses keys
        document.addEventListener('keypress', function (e) {
            var key = e.which || e.keyCode;
            if (key === leftKey && PLAYER.paddleLeft > 0) { 
                PLAYER.paddleLeft = PLAYER.paddleLeft-20; 
            }
            else if (key === righttKey && (PLAYER.paddleLeft+PLAYER.paddleWidth) < canvasWidth) { 
                PLAYER.paddleLeft = PLAYER.paddleLeft+20; 
            }
        });
        
        //  Create the ball and start the game loop
        ResetWall();
        DrawWall();
        ResetPlayer();
        ResetBall();
        RefreshFrame();
    }

    //  Creates the array of objects that form the wall
    function ResetWall () {              
        var brickWidth = canvasWidth/defaultBricksPerRow;
        for(var row=0; row < 3; row++) {
            for(var col=0; col < canvasWidth; col+=brickWidth) {
                var brick = {
                    width: canvasWidth/defaultBricksPerRow,
                    height : defaultBrickHeight,
                    x : col,
                    y : row * defaultBrickHeight
                }
                WALL.push(brick);
            }
        }
    }

    function ResetPlayer () {
        PLAYER = {      //  Current player/paddle information   
            score : 0,
            lives : defaultLives,
            paddleHeight : defaultPaddleHeight,
            paddleWidth : defaultPaddleWidth,
            paddleLeft : (canvasWidth/2)-(defaultPaddleWidth/2)
        };
    }

    function ResetBall () {
        BALL = {
            x : canvasWidth / 2,    
            y : canvasHeight / 2,
            radius : defaultBallRadius,
            x_increment : 1,    
            y_increment : 1     //  Current ball X/Y movement increments
        }
    }

    //  The main loop that the game will run on is here, we clear the canvas, 
    //  draw the ball, check for collisions, game over and then call it all again.
    function RefreshFrame () {

        //  Hits any side wall
        if (BALL.x == (canvasWidth - BALL.radius) || BALL.x == BALL.radius) {
            BALL.x_increment = -BALL.x_increment;
        }
        
        //  Hits the top
        if (BALL.y == BALL.radius) {
            BALL.y_increment = -BALL.y_increment;
        }

        //  Hits any of the blocks


        //  Goes off the bottom of the screen completely. Decrement the number of lives
        //  and reset the ball to start the player again
        if (BALL.y == canvasHeight + BALL.radius){
            PLAYER.lives--;
            ResetBall();
        }

        //  Hits the paddle
        if (BALL.y == canvasHeight - PLAYER.paddleHeight
            && BALL.x >= PLAYER.paddleLeft
            && BALL.x <= (PLAYER.paddleLeft + PLAYER.paddleWidth)
            ) {
            BALL.y_increment = -BALL.y_increment;
        }

        //  Wipe the canvas, and reload the player and ball
        ClearCanvas (); 
        DrawWall();
        DrawPlayer ();
        DrawBall(BALL.x, BALL.y, BALL.radius);

        //  Move the ball to the current increment
        BALL.x = BALL.x - BALL.x_increment;
        BALL.y = BALL.y - BALL.y_increment;
        
        //   Feedback the score to the player
        PLAYER.score++;
        document.getElementById('Score').innerText = PLAYER.score;
        document.getElementById('Lives').innerText = PLAYER.lives;      

        //  Check if the player has any lives left
        if (PLAYER.lives > 0) {
            setTimeout(RefreshFrame, refreshRateInMilliseconds);
        }
    }

    //  Draws the current player paddle position on the screen
    function DrawPlayer() {
        CTX.rect(PLAYER.paddleLeft, canvasHeight-PLAYER.paddleHeight, PLAYER.paddleWidth, PLAYER.paddleHeight);
        CTX.strokeStyle = '#000000';
        CTX.fillStyle = '#000000';
        CTX.fill();        
        CTX.stroke();
    }

    //  Draws a crude ball on the canvas
    function DrawBall (x, y, radius) {
        CTX.beginPath();
        CTX.arc(x,y,radius,0,2*Math.PI);
        CTX.strokeStyle = '#000000';
        CTX.fillStyle = '#000000';
        CTX.fill();
        CTX.stroke();
    }

    //  Draws the wall from the WALL array, will then only draw bricks still in play
    function DrawWall (DrawWall) {
        WALL.map(function (brick) {            
            CTX.strokeStyle = '#000000';        
            CTX.strokeRect(brick.x, brick.y, brick.width, brick.height);            
        });
    }

    //  Shortcut to clear the canvas
    function ClearCanvas () {
        CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
    } 

    return {
        Setup : Setup
    };

})();