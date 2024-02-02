const playBoard = document.querySelector(".play-board") /*indica donde debe aparecer el div del htmlMarkup*/
const scoreElement = document.querySelector(".score")
const highScoreElement = document.querySelector(".high-score")
const gameOverWarning = document.querySelector(".game-over")
const gameOverButton = document.querySelector(".game-over-button")

let gameOver = false
let foodX, foodY /*cooerdenadas de donde va a estar la comida*/
let snakeX = 5, snakeY = 10  //posicion inicial de la cabeza de la serpiente
let speedX = 0 , speedY = 0
let snakeBody = []  //para que el cuerpo de la snake crezca
let setIntervalId  //para poder almacenar en el un Intervalo y despues eliminarlo
let score = 0
let highScore = localStorage.getItem("high-score") || 0 //Obtienes el registro. Si el storage no tiene nada coloca 0

highScoreElement.innerHTML = `<img src="img/trophy.png" alt="High Score:"> ${highScore}`

//FUNCION PARA QUE SE CAMBIE LA POSICION DE LA FRUTA AL COMERLA
const changeFoodPosition = () => {  //  [ 1 - 30]
    foodX = Math.floor(Math.random()* 30) +1 //Coje un # al azar del 0 al 1, lo multiplica por 30, cambiando el rango de [0 - 30], lo redondea por debajo
    foodY = Math.floor(Math.random()* 30) +1 // dejando el rango [0 - 29], al sumarle 1 deja el rango de [ 1 - 30]
}

// FUNCION PARA CUANDO PIERDE
const handleGameOver = () => {
    gameOverWarning.classList.remove("active")
    clearInterval(setIntervalId)  //De lo contrario como tengo el invervalo casa 125ms no puedo cerrar el cartel
}
gameOverButton.addEventListener('click', ()=>{
    location.reload() //para que carge de nuevo el juego 

})

// FUNCION PARA MOVER LA SERPIENTE
const changeDirection = (e) => {
    if(e.key === "ArrowUp" && speedY!= 1){ /* Porque aqui en el eje de coordenadas, el eje y va hacia abajo en vez de para arriba*/
                            /* Por  lo tanto, las cordenadas hacia arriba son negativas y hacia abajo positivas. El eje x se mantiene igual */        
        speedX = 0
        speedY = - 1
    } else if(e.key === "ArrowDown" && speedY != -1){ 
       speedX = 0
       speedY = 1
    } else if(e.key === "ArrowLeft" && speedX!=1){  //la segunda condicion quiere decir que si va hacia la izq, no puede ir a la derecha
        speedX = -1
        speedY = 0
     }else if(e.key === "ArrowRight" && speedX!=-1){ 
        speedX = 1
        speedY = 0
     }
    
    initGame();
}

//FUNCION PRINCIPAL QUE GENERA TODO, DESDE LA FRUTA HASTA LA SERPIENTE Y TAMBIEN EL TAMAÑO DE LA SERPIENTE
const initGame = ()=>{

    //Si game over es true, llamo la funcion que muestra el alert
    if(gameOver) return handleGameOver()

    //Crea la fruta en las coordenadas al azar que genera changeFoodPosition
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>` 
    
    //SI LA SERPIENTE SE COME LA FRUTA CAMBIA LA POSICION 
    if(snakeX === foodX && snakeY === foodY){
        changeFoodPosition();
        snakeBody.push([foodX, foodY]) // Le agrega al arreglo las coordenadas de la comida, para que la serpiente crezca en esa posicion
        score++

        highScore = score >= highScore ? score : highScore 
        localStorage.setItem("high-score", highScore) //Guarda el nuevo puntaje en el storage.
      
        scoreElement.innerHTML = `<img src="img/apple.png" alt="Score:"> ${score}`
        highScoreElement.innerHTML = `<img src="img/trophy.png" alt="High Score:"> ${highScore}`
    }

    //LOOP QUE RECORRE EL ARREGLO ALREVEZ PARA QUE ADICIONE LA NUEVA PARTE DE LA SERPIENTE 
    for(let i = snakeBody.length - 1; i>=0; i--){
        snakeBody[i] = snakeBody[i - 1]
    }//para que el nuevo elemento no se cree sobre la fruta 

    //A LA CABEZA DE LA SNAKE LE ASIGNA LA POSICION INICIAL
    snakeBody[0] = [snakeX, snakeY] //para que aparezca la snake en pantalla

    //ASIGNANDOLE NUEVOS VALORES A LA POSICION INICIAL PARA CUANDO SE TOQUE UNA TECA LA SNAKE SE MUEVA
    snakeX += speedX  
    snakeY += speedY //Si me muevo hacia arriba, y la posicion en Y de la serpiente es 10, le debo restar 1 de la velocidad, teniendo una nueva pocision de 9
    /* Debo generar las coordenadas de la snake antes de que salga en pantalla  */
    
    //PARA CUANDO LA SERPIENTE TOQUE ALGUN EXTREMO DE LA PANTALLA PIERDA
    if(snakeX<=0 || snakeX > 30 || snakeY<=0 || snakeY > 30){ //porque declaramos en el CSS que el grid area es de 0 a 30
        gameOver = true
    }

    //LOOP PARA GENERARLE UNA NUEVA PARTE A LA SERPIENTE EN LA ANTIGUA POSICION DE LA COMIDA
    for(let i=0; i<snakeBody.length; i++){
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]} "></div>` //Utiliza esas coordenadas pq la matriz seria [ [x,y] , [x,y] ] estando x en la posicion 0 y y en 1

        if(i!== 0 && snakeBody[0][1]===snakeBody[i][1] && snakeBody[0][0]===snakeBody[i][0]){
            gameOver = true
        }
    }


    //DETERMINA EN QUE PARTE DEL HTML PONER EL HTML CREADO, EN ESTE CASO DENTRO DEL DIV PLAY-BOARD
    playBoard.innerHTML = htmlMarkup

}


changeFoodPosition();
setIntervalId = setInterval(initGame, 125); //inicializa la funcion initGame cada 125 milisegundos, por lo que mueve la serpiente sin parar
document.addEventListener("keydown", changeDirection) /*Este eventode escucha devuelve que tecla presiono del teclado */
