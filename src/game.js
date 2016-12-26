var BreakOut = (function() {

    //  Set our constants first......
    const refreshRateInMilliseconds = 1;
    const canvasWidth = 400;
    const canvasHeight = 300;
    const defaultPaddleWidth = 50;
    const defaultPaddleHeight = 5;
    const defaultBallRadius = 5;
    const defaultLives = 3;

    //  Create any common variables that are needed here that are shared thoughout the game
    var canvas;
    var ctx;    
    var ball;           //  Current ball object state

    var player = {      //  Current player/paddle information   
        score : 0,
        lives : defaultLives,
        paddleHeight : defaultPaddleHeight,
        paddleWidth : defaultPaddleWidth,
        paddleLeft : canvasWidth/2,
        paddleRight: canvasWidth/2 + defaultPaddleWidth 
    }
    
    //  Function to call that sets up the game canvas
    function Setup () {
        canvas = document.getElementById('GameCanvas');
        ctx = canvas.getContext("2d");
        canvas.width  = canvasWidth;    
        canvas.height = canvasHeight;
        
        //  Create the ball and start the game loop
        ResetBall();
        setTimeout(RefreshFrame, refreshRateInMilliseconds);
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

        //  Goes off the bottom of the screen completely
        if (ball.y == canvasHeight + ball.radius){
            ResetBall();
            player.lives--;
        }

        //  Hits the paddle
        if (ball.y == canvasHeight - player.paddleHeight
            && ball.x >= player.paddleLeft
            && ball.x <= player.paddleRight
            ) {
            ball.y_increment = -ball.y_increment;
        }

        ClearCanvas (); 
        DrawPlayer ();
        DrawBall(ball.x, ball.y, ball.radius);

        ball.x = ball.x - ball.x_increment;
        ball.y = ball.y - ball.y_increment;
        
        document.getElementById('Score').innerText = player.score;
        document.getElementById('Lives').innerText = player.lives;

        player.score++;

        //  Check if the player has any lives left
        if (player.lives > 0) {
            setTimeout(RefreshFrame, refreshRateInMilliseconds);
        }
    }

    //  Draws the current player position on the screen
    function DrawPlayer() {
        ctx.rect(player.paddleLeft, canvasHeight-player.paddleHeight, player.paddleWidth, player.paddleHeight);
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

    function ClearCanvas () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } 

    return {
        Setup : Setup
    };

})();