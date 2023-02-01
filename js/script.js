(function () {

    var cnv = document.querySelector("canvas");
    var ctx = cnv.getContext("2d");

    var WIDTH = cnv.width,
        HEIGHT = cnv.height;

    var LEFT = 37,
        UP = 38,
        RIGHT = 39,
        DOWN = 40;
    var mvLeft = mvUp = mvRight = mvDown = false;

    var tileSize = 64;

    var img = new Image();
    img.src = "img/img.png";
    img.addEventListener("load", function () {

        requestAnimationFrame(loop, cnv);

    })
    var tileSrcSize = 96;

    var player = {

        x: tileSize + 2,
        y: tileSize + 2,
        width: 24,
        height: 32,
        speed: 7,
        srcX: 0,
        srcY: tileSrcSize,
        countAnim: 0

    };

    var cartaReady = false;
    var cartaImage = new Image();
    cartaImage.onload = function () {
        cartaReady = true;
    }

    cartaImage.src = "img/carta.png";

    var carta = {

        x: 80,
        y: 220

    };

    var carta = {

        x: 80,
        y: 220

    };

    var cartaFinalReady = false;
    var cartaFinalImage = new Image();
    cartaFinalImage.onload = function () {
        cartaFinalReady = true;
    }

    cartaFinalImage.src = "img/final-carta.png";

    var cartaFinal = {

        x: 2000,
        y: 2000

    };

    var cartasCapturados = 0;

    var cam = {

        x: 0,
        y: 0,
        width: WIDTH,
        height: HEIGHT,
        innerLeftBoundary: function () {
            return this.x + (this.width * 0.25);
        },
        innerTopBoundary: function () {
            return this.y + (this.height * 0.25);
        },
        innerRightBoundary: function () {
            return this.x + (this.width * 0.75);
        },
        innerBottomBoundary: function () {
            return this.y + (this.height * 0.75);
        }

    }

    var walls = []

    var maze = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

    ];

    var tile
    var tile_x
    var tile_y

    var T_WIDTH = maze[0].length * tileSize,
        T_HEIGTH = maze.length * tileSize;

    for (var row in maze) {
        for (var column in maze) {

            var tile = maze[row][column];

            if (tile == 1) {

                var wall = {

                    x: tileSize * column,
                    y: tileSize * row,
                    width: tileSize,
                    height: tileSize

                };
                walls.push(wall);
            }
        }
    }

    window.addEventListener("keydown", keydownHandler, false);
    window.addEventListener("keyup", keyupHandler, false);

    var reset = function () {
        if (cartasCapturados === 1) {

            carta.x = 780;
            carta.y = 140;
            alert("Você achou a primeira parte da carta! Faltam 5 que podem ser achados pelo labirinto.")
            mvLeft = mvUp = mvRight = mvDown = false;

        }
        if (cartasCapturados === 2) {

            carta.x = 1180;
            carta.y = 160;
            alert("Você achou a segunda parte da carta! Faltam 4 que podem ser achados pelo labirinto.")
            mvLeft = mvUp = mvRight = mvDown = false;

        }
        if (cartasCapturados === 3) {

            carta.x = 80;
            carta.y = 1160;
            alert("Você achou a terceira parte da carta! Faltam 3 que podem ser achados pelo labirinto.")
            mvLeft = mvUp = mvRight = mvDown = false;

        }
        if (cartasCapturados === 4) {

            carta.x = 1180;
            carta.y = 780;
            alert("Você achou a quarta parte da carta! Faltam 2 que podem ser achados pelo labirinto.")
            mvLeft = mvUp = mvRight = mvDown = false;

        }
        if (cartasCapturados === 5) {

            carta.x = 2000;
            carta.y = 2000;
            cartaFinal.x = 660;
            cartaFinal.y = 660;
            alert("Você achou a quinta parte da carta! Faltam 1 que podem ser achados pelo labirinto.")
            mvLeft = mvUp = mvRight = mvDown = false;

        }

        if (cartasCapturados === 6) {

            cartaFinal.x = 2000;
            cartaFinal.y = 2000;
            alert("Você achou a última parte da carta! Click no Okay para ler!")
            window.open('https://mathsilva.netlify.app', '_blank')
            mvLeft = mvUp = mvRight = mvDown = false;

        }
    };

    function blockRectangle(objA, objB) {

        var distX = (objA.x + objA.width / 2) - (objB.x + objB.width / 2);
        var distY = (objA.y + objA.height / 2) - (objB.y + objB.height / 2);

        var sumWidth = (objA.width + objB.width) / 2;
        var sumHeight = (objA.height + objB.height) / 2;

        if (Math.abs(distX) < sumWidth && Math.abs(distY) < sumHeight) {

            var overlapX = sumWidth - Math.abs(distX);
            var overlapY = sumHeight - Math.abs(distY);

            if (overlapX > overlapY) {
                objA.y = distY > 0 ? objA.y + overlapY : objA.y - overlapY;
            } else {
                objA.x = distX > 0 ? objA.x + overlapX : objA.x - overlapX;
            }

        }

    }

    function keydownHandler(e) {

        var key = e.keyCode;
        switch (key) {
            case LEFT:
                mvLeft = true;
                break;
            case UP:
                mvUp = true;
                break;
            case RIGHT:
                mvRight = true;
                break;
            case DOWN:
                mvDown = true;
                break;
        }

    }

    function keyupHandler(e) {

        var key = e.keyCode;
        switch (key) {
            case LEFT:
                mvLeft = false;
                break;
            case UP:
                mvUp = false;
                break;
            case RIGHT:
                mvRight = false;
                break;
            case DOWN:
                mvDown = false;
                break;
        }

    }

    function update() {

        if (mvLeft && !mvRight) {
            player.x -= player.speed;
            player.srcY = tileSrcSize + player.height * 2;
        } else
        if (mvRight && !mvLeft) {
            player.x += player.speed;
            player.srcY = tileSrcSize + player.height * 3;
        }
        if (mvUp && !mvDown) {
            player.y -= player.speed;
            player.srcY = tileSrcSize + player.height * 1;
        } else
        if (mvDown && !mvUp) {

            player.y += player.speed;
            player.srcY = tileSrcSize + player.height * 0;
        }

        if (mvLeft || mvRight || mvDown || mvUp) {

            player.countAnim++;

            if (player.countAnim >= 40) {

                player.countAnim = 0;

            }

            player.srcX = Math.floor(player.countAnim / 5) * player.width;

        } else {

            player.srcX = 0;
            player.countAnim = 0

        }

        if (player.x <= (carta.x + 32) && carta.x <= (player.x + 32) && player.y <= (carta.y + 32) && carta.y <= (player.y + 32)) {
            ++cartasCapturados;
            reset();
        }

        if (player.x <= (cartaFinal.x + 32) && cartaFinal.x <= (player.x + 32) && player.y <= (cartaFinal.y + 32) && cartaFinal.y <= (player.y + 32)) {
            ++cartasCapturados;
            reset();
        }

        for (var i in walls) {
            var wall = walls[i];
            blockRectangle(player, wall);
        }

        if (player.x < cam.innerLeftBoundary()) {

            cam.x = player.x - (cam.width * 0.25);

        }
        if (player.y < cam.innerTopBoundary()) {

            cam.y = player.y - (cam.height * 0.25);

        }
        if (player.x + player.width > cam.innerRightBoundary()) {

            cam.x = player.x + player.width - (cam.width * 0.75);

        }
        if (player.y + player.height > cam.innerBottomBoundary()) {

            cam.y = player.y + player.height - (cam.height * 0.75);

        }

        cam.x = Math.max(0, Math.min(T_WIDTH - cam.width, cam.x));
        cam.y = Math.max(0, Math.min(T_HEIGTH - cam.height, cam.y));

    }

    function render() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.save();
        ctx.translate(-cam.x, -cam.y);
        for (var row in maze) {
            for (var column in maze) {
                tile = maze[row][column];
                tile_x = column * tileSize;
                tile_y = row * tileSize;

                ctx.drawImage(
                    img,
                    tile * tileSrcSize, 0, tileSrcSize, tileSrcSize,
                    tile_x, tile_y, tileSize, tileSize
                );
            }
        }


        ctx.drawImage(

            img,
            player.srcX, player.srcY, player.width, player.height,
            player.x, player.y, player.width, player.height

        );

        if (cartaReady) {
            ctx.drawImage(cartaImage, carta.x, carta.y);
        }
        if (cartaFinalReady) {
            ctx.drawImage(cartaFinalImage, cartaFinal.x, cartaFinal.y);
        }
        ctx.restore();
    }

    function loop() {
        update();
        render();
        requestAnimationFrame(loop, cnv);

    }
}());