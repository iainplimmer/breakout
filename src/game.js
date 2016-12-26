var BreakOut = (function() {

    //  Set our constants first for the game......
    const refreshRateInMilliseconds = 5;
    const canvasWidth = 400;
    const canvasHeight = 300;

    //  For the player
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

    //  Create any common variables that are needed here that are shared thoughout the game
    var canvas;
    var ctx;    
    var ball;           //  Current ball object state
    var player;         //  Current player/paddle information  
    var wall;           //  Stores the information about the wall 
         
    //  Function to call that sets up the game canvas, sets up the canvas,
    //  the event listener and then starts the ball and the game
    function Setup () {
        canvas = document.getElementById('GameCanvas');
        ctx = canvas.getContext("2d");
        canvas.width  = canvasWidth;    
        canvas.height = canvasHeight;

        document.addEventListener('keypress', function (e) {
            var key = e.which || e.keyCode;
            if (key === leftKey && player.paddleLeft > 0) { 
                player.paddleLeft = player.paddleLeft-20; 
            }
            else if (key === righttKey && (player.paddleLeft+player.paddleWidth) < canvasWidth) { 
                player.paddleLeft = player.paddleLeft+20; 
            }
        });
        
        //  Create the ball and start the game loop
        ResetWall();
        ResetPlayer();
        ResetBall();
        RefreshFrame();
    }

    function ResetWall () {
        /*var brick = {
            width: canvasWidth/defaultBricksPerRow,
            height : 30
        }
        var brickWidth = canvasWidth/defaultBricksPerRow;*/
        //  TO DO NEXT TIME
        //console.log(brickWidth);
        //for(var i=0; i < canvasWidth; i+brickWidth) {
            /*ctx.rect(i, 0, brickWidth, defaultBrickHeight);
            ctx.strokeStyle = '#FF0000';
            ctx.fillStyle = '#FF0000';
            ctx.fill();        
            ctx.stroke();*/
        //}
    }

    function ResetPlayer () {
        player = {      //  Current player/paddle information   
            score : 0,
            lives : defaultLives,
            paddleHeight : defaultPaddleHeight,
            paddleWidth : defaultPaddleWidth,
            paddleLeft : (canvasWidth/2)-(defaultPaddleWidth/2)
        };
    }

    function ResetBall () {
        ball = {
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
        if (ball.x == (canvasWidth - ball.radius) || ball.x == ball.radius) {
            ball.x_increment = -ball.x_increment;
        }
        
        //  Hits the top
        if (ball.y == ball.radius) {
            ball.y_increment = -ball.y_increment;
        }

        //  Goes off the bottom of the screen completely. Decrement the number of lives
        //  and reset the ball to start the player again
        if (ball.y == canvasHeight + ball.radius){
            player.lives--;
            ResetBall();
        }

        //  Hits the paddle
        if (ball.y == canvasHeight - player.paddleHeight
            && ball.x >= player.paddleLeft
            && ball.x <= (player.paddleLeft + player.paddleWidth)
            ) {
            ball.y_increment = -ball.y_increment;
        }

        //  Wipe the canvas, and reload the player and ball
        ClearCanvas (); 
        ResetWall();
        DrawPlayer ();
        DrawBall(ball.x, ball.y, ball.radius);

        //  Move the ball to the current increment
        ball.x = ball.x - ball.x_increment;
        ball.y = ball.y - ball.y_increment;
        
        //   Feedback the score to the player
        player.score++;
        document.getElementById('Score').innerText = player.score;
        document.getElementById('Lives').innerText = player.lives;      

        //  Check if the player has any lives left
        if (player.lives > 0) {
            setTimeout(RefreshFrame, refreshRateInMilliseconds);
        }
    }

    //  Draws the current player paddle position on the screen
    function DrawPlayer() {
        ctx.rect(player.paddleLeft, canvasHeight-player.paddleHeight, player.paddleWidth, player.paddleHeight);
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#000000';
        ctx.fill();        
        ctx.stroke();
    }

    //  Draws a crude ball on the canvas
    function DrawBall (x, y, radius) {
        ctx.beginPath();
        ctx.arc(x,y,radius,0,2*Math.PI);
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.stroke();
    }

    //  Shortcut to clear the canvas
    function ClearCanvas () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } 

    return {
        Setup : Setup
    };

})();