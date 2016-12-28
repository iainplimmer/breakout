var BreakOut = (function() {

    //  Set our constants first for the game rate and window size......
    const refreshRateInMilliseconds = 5;
    const canvasWidth = 500;
    const canvasHeight = 400;
    const defaultBrickHeight = 30;
    const leftKey = 122;    // Z
    const righttKey = 109;  // M

    //  Finally, create any common variables that are needed here that are shared thoughout the game, these are 
    //  named in uppercase so that they are more visible, i'm not just passing around functions at the moment
    var CANVAS;
    var CTX;    
    var BALL;           //  Current ball object state
    var PLAYER;         //  Current player/paddle information  
    var WALL;           //  Stores the information about the wall 
    var WALLSTANDING = false;
         
    //  Function to call that sets up the game canvas, sets up the canvas,
    //  the event listener and then starts the ball and the game
    function Setup () {
        CANVAS = document.getElementById('GameCanvas');
        CTX = CANVAS.getContext("2d");
        CANVAS.width  = canvasWidth;    
        CANVAS.height = canvasHeight;
        
        //Start the game loop
        Play();
    }

    //  The main loop that the game will run on is here, we clear the canvas, 
    //  draw the ball, check for collisions, game over and then call it all again.
    function Play () {

        //  Create the ball, player and wall if they are not setup
        if (!WALL && !PLAYER && !BALL) {        
            WALL = ResetWall();
            PLAYER = ResetPlayer();
            BALL = ResetBall();
        }

        //  Hits any side wall
        if (BALL.x == (canvasWidth - BALL.radius) || BALL.x == BALL.radius) {
            BALL.x_increment = -BALL.x_increment;
        }
        
        //  Hits the top
        if (BALL.y <= BALL.radius) {
            BALL.y_increment = -BALL.y_increment;
        }

        //  Collides with any of the blocks on the screen
        WALL.map(function(br){            
            if (br.DetectBrickCollision()) {
                PLAYER.score++;
            }
        });

        //  Goes off the bottom of the screen completely. Decrement the number of lives
        //  and reset the ball to start the player again
        if (BALL.y == canvasHeight + BALL.radius){
            PLAYER.lives--;
            BALL = ResetBall();
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
        document.getElementById('Score').innerText = PLAYER.score;
        document.getElementById('Lives').innerText = PLAYER.lives;      

        //  Check if the player has any lives left and that the wall is still standing
        if (PLAYER.lives > 0) {
            setTimeout(Play, refreshRateInMilliseconds);
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

    //  Creates the array of objects that form the wall
    function ResetWall () {    
        const defaultBricksPerRow = 5;
        const defaultBrickRows = 1;       
        var wall = [];   
        var brickWidth = canvasWidth/defaultBricksPerRow;
        for(var row=0; row < defaultBrickRows; row++) {
            for(var col=0; col < canvasWidth; col+=brickWidth) {
                //  Create the brick and give it the collision detection function
                var brick = new Brick(row, col, brickWidth, defaultBricksPerRow)
                brick.DetectBrickCollision = DetectBrickCollision.bind(brick);               
                wall.push(brick);
            }
        }
        return wall;
    }

    //  Let's setup the player's controls and return a player object for use in the game
    function ResetPlayer () {

        //  Let's listen for when the player presses keys
        document.addEventListener('keypress', function (e) {
            var key = e.which || e.keyCode;
            if (key === leftKey && PLAYER.paddleLeft > 0) { 
                PLAYER.paddleLeft = PLAYER.paddleLeft-40; 
            }
            else if (key === righttKey && (PLAYER.paddleLeft+PLAYER.paddleWidth) < canvasWidth) { 
                PLAYER.paddleLeft = PLAYER.paddleLeft+40; 
            }
        });

        //  Return the current player/paddle information   
        return {      
            score : 0,
            lives : 3,
            paddleHeight : 5,
            paddleWidth : 150,
            paddleLeft : (canvasWidth/2)-(150/2)
        };
    }

    //  Object that creates the brick 
    function Brick (row, col, brickWidth, defaultBricksPerRow) {
        this.width = canvasWidth/defaultBricksPerRow,
        this.height = defaultBrickHeight,
        this.x = col,
        this.y = row * defaultBrickHeight,
        this.leftx = col,
        this.rightx = (col)+brickWidth,
        this.draw = true
    }

     //  Helper method used to check if the ball has hit a brick, ***less performant*** than in the game loop but nicely seperated
    function DetectBrickCollision () {
        
        var brickbottomY = this.y + this.height + BALL.radius;
        
        if (!this.draw) {
            return false;
        }
        
        //  Has the ball hit the bottom or top of the brick?
        if (((BALL.y == brickbottomY) || (BALL.y == this.y))
            && BALL.x < this.rightx
            && BALL.x > this.leftx
        ) {
            BALL.y_increment = -BALL.y_increment;
            this.draw = false;
            return true;
        }

        //  Hit left or right side of brick
        if (
            (BALL.x == this.leftx && BALL.y >= this.y && BALL.y <= this.y + defaultBrickHeight)
            || 
            (BALL.x == this.rightx && BALL.y >= this.y && BALL.y <= this.y + defaultBrickHeight)
        ) {
            BALL.y_increment = -BALL.y_increment;
            BALL.x_increment = -BALL.x_increment;
            this.draw = false;
            return true;
        }

        //  No collision detected
        return false;
    }

    //  Puts the ball into a starting position and sets it's movement increments
    function ResetBall () {
        return {
            x : canvasWidth / 2,    
            y : canvasHeight / 2,
            radius : 5,
            x_increment : 1,    
            y_increment : 1     //  Current ball X/Y movement increments
        }
    }

    return {
        Setup : Setup
    };

})();