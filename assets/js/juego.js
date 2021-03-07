/*
* C = CLUBS
* D = DIAMONDS
* H = HEARTS
* S = SPADES
*
* */

const miModulo = (() => {
    'use strict'
    //Inicializaciones
    let deck                = [];
    const tipos             = [ 'C', 'D', 'H', 'S' ],
          cartas_especiales = [ 'A', 'J', 'Q', 'K', ];


    let puntosJugadores = [];


    // Referencias del HTML
    const botonPedir = document.querySelector('#btnPedir' ),
          botonPlantarse = document.querySelector('#btnPlantarse' ),
          botonNuevoJuego = document.querySelector('#btnNuevo' ),
          conteoPuntosHTML = document.querySelectorAll( 'small' ),
          divCartasJugadores = document.querySelectorAll('.divCartas');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// función que inicializa juego
    const inicializarJuego = ( numJugadores = 2 ) => {
        deck = crearDeck(); // Llamado de la función que crea la baraja mezclada

        puntosJugadores = [];
        for ( let i = 0; i < numJugadores; i++ ) {
            puntosJugadores.push(0);
        }

        conteoPuntosHTML.forEach( elem => elem.innerText = 0 );
        divCartasJugadores.forEach( elem => elem.innerHTML = '' );

        botonPedir.disabled = false;
        botonPlantarse.disabled = false;
    }


// ésta función crea una nueva baraja
    const crearDeck = ( ) => {
        deck = [];
        for ( let i = 2; i <= 10; i++ ) {
            for ( let tipo of tipos ) {
                deck.push( i + tipo );
            }
        }

        for ( let tipo of tipos) {
            for ( let esp of cartas_especiales ) {
                deck.push( esp + tipo );
            }

        }
        // El shuffle es una librería importada que pone random los elementos de un arreglo
        return _.shuffle( deck );
    };



// ésta función me permite tomar una carta
    const pedirCarta = () => {
        if ( deck.length === 0 ) {
            throw 'No hay más cartas en la Baraja';
        }
       // retorno de último elemento de baraja
        return deck.pop() ;
    };
// pedirCarta();


    // ésta función permite separar las letras y cartas, verificar si es número o letra y si es letra asignar un valor dado, si es número, castearlo a num:
    const valorCarta = ( carta ) => {
        const valor = carta.substring( 0, carta.length - 1 ); // parte la carta tipo splice, y escoge all menos el último indice
        return ( isNaN( valor ) ) ?          // comprueba si es una letra (o no es un número)
            ( valor === 'A' ) ? 11 : 10      // si es una letra y además es igual a la A le da valor de 11
            : valor * 1;                     // si es número, La multiplicación por 1 convierte el dato str a número
    }
// valorCarta();

    // Turno: 0 = 1er Jugador, el último será la computadora
    const acumulacionPuntos = ( carta, turno ) => {
        puntosJugadores[ turno ] = puntosJugadores[ turno ] + valorCarta( carta );
        conteoPuntosHTML[ turno ].innerText = puntosJugadores[ turno ];
        return  puntosJugadores[ turno ];
    }

    const crearCartaHTML = ( carta, turno ) => {
        const imgCarta = document.createElement('img')
        imgCarta.src = ` assets/cartas/${ carta }.png`;
        imgCarta.classList.add( 'carta' );
        divCartasJugadores[turno].append(imgCarta );
    }

    const determinarGanador = () => {

        const [ puntosMinimosJugador, puntosComputadora ] = puntosJugadores;

        setTimeout( () => {

            if ( puntosMinimosJugador === puntosComputadora ){
                alert('Empate, nadie Gana');
            } else if ( puntosMinimosJugador > 21 ) {
                alert( 'Gana Computadora' );
            } else if (puntosComputadora > 21  ) {
                alert( 'Gana Jugador' )
            } else {
                alert( 'Gana Computadora' );
            }

        }, 100 );

    }



    /* TURNO DE LA COMPUTADORA*/
    const turnoComputadora = ( puntosMinimosJugador ) => {
        let puntosComputadora = 0;
        do {
            const carta = pedirCarta();
            puntosComputadora = acumulacionPuntos( carta, puntosJugadores.length - 1 ); // carta y turno
            crearCartaHTML( carta, puntosJugadores.length - 1 );

        } while (  (puntosComputadora < puntosMinimosJugador) && puntosMinimosJugador <= 21 );

        determinarGanador();
    }



    /* EVENTOS */
    botonPedir.addEventListener( 'click', () => {
        const carta = pedirCarta(), // trae el el valor obtenido de la función pedirCarta donde se hace el POP
            puntosJugador = acumulacionPuntos( carta, 0 ); // carta y turno

        crearCartaHTML( carta, 0 );

        // Deteniendo conteo cuando sea igual o supere el 21:

        if ( puntosJugador > 21 ) {
            console.warn( 'Lo siento mucho, perdiste' );
            botonPedir.disabled = true;
            botonPlantarse.disabled = true;
            turnoComputadora( puntosJugadores[0] );

        } else if ( puntosJugador === 21 ) {
            console.warn( '21, Genial!!!!' );
            botonPedir.disabled = true;
            botonPlantarse.disabled = true;
            turnoComputadora( puntosJugadores[0] );
        }


    } );


    botonPlantarse.addEventListener( 'click', () => {
        botonPedir.disabled = true;
        botonPlantarse.disabled = true;
        turnoComputadora( puntosJugadores[0] );
    });

    botonNuevoJuego.addEventListener( 'click', () => {
        console.clear();
        inicializarJuego();

    });



    return {
        juegoBlackJack: inicializarJuego
    };
})();

