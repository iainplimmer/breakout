var BreakOut = (function() {

    //  Set our constants first for the game rate and window size......
    const refreshRateInMilliseconds = 5;
    const canvasWidth = 500;
    const canvasHeight = 300;
    const defaultPaddleWidth = 100;
    const defaultBrickHeight = 20;
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
        const defaultBricksPerRow = 5;
        const defaultBrickRows = 3;          
        var brickWidth = canvasWidth/defaultBricksPerRow;
        for(var row=0; row < 3; row++) {
            for(var col=0; col < canvasWidth; col+=brickWidth) {
                var brick = {
                    width: canvasWidth/defaultBricksPerRow,
                    height : defaultBrickHeight,
                    x : col,
                    y : row * defaultBrickHeight,
                    draw : true
                }
                WALL.push(brick);
            }
        }
    }

    function ResetPlayer () {
        PLAYER = {      //  Current player/paddle information   
            score : 0,
            lives : 3,
            paddleHeight : 5,
            paddleWidth : defaultPaddleWidth,
            paddleLeft : (canvasWidth/2)-(defaultPaddleWidth/2)
        };
    }

    function ResetBall () {
        BALL = {
            x : canvasWidth / 2,    
            y : canvasHeight / 2,
            radius : 5,
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

        //  Collides with any of the blocks on the screen
        WALL.map(function(br){
            
            var leftX = br.width + br.x;
            var rightX = br.width + br.x + br.width;
            var brickY = br.y + br.height + BALL.radius;

            if (br.draw && 
                BALL.y === brickY 
                && BALL.x < rightX
                && BALL.x > leftX ) {                

                console.log( 'ballx', BALL.x); 
                console.log( 'leftx', leftX); 
                console.log( 'rightx', rightX); 
                console.log( 'brick', br);                               
            
                BALL.y_increment = -BALL.y_increment;
                br.draw = false;

                CTX.strokeStyle  = '#FF0000';        
                CTX.strokeRect(br.x, br.y, br.width, br.height);     
                throw new Error('Collision detection!');    
            } 
        });

        //  Goes off the bottom of the screen completely. Decrement the number of lives
        //  and reset the ball to start the player again
        if (BALL.y == canvasHeight + BALL.radius){
            PLAYER.lives--;
            ResetBall();
        }

        //  Hits the paddle (want to add a hit left, right and middle modifier here)
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
    function DrawWall () {
        WALL.map(function (brick) {    
            if (brick.draw) {       
                CTX.strokeStyle = '#000000';        
                CTX.strokeRect(brick.x, brick.y, brick.width, brick.height);            
            }
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