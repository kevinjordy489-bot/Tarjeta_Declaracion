    /* =========================================================
    CONFIGURACIÓN
    ========================================================= */

    const scenes = document.querySelectorAll(".scene");

    const progressFill =
        document.getElementById("progressFill");

    const sceneNumber =
        document.getElementById("sceneNumber");

    const sceneName =
        document.getElementById("sceneName");

    const sceneNames = [
        "Inicio",
        "Curiosidad",
        "Juego",
        "Carta",
        "Final"
    ];

    let currentScene = 0;


    /* =========================================================
    AUDIO
    ========================================================= */

    const backgroundMusic =
        document.getElementById("backgroundMusic");

    const clickSound =
        document.getElementById("clickSound");

    const successSound =
        document.getElementById("successSound");

    const playMusic =
        document.getElementById("playMusic");

    const muteMusic =
        document.getElementById("muteMusic");

    const currentTimeElement =
        document.getElementById("currentTime");

    const durationElement =
        document.getElementById("duration");

    const musicProgress =
        document.getElementById("musicProgress");

    let audioContext = null;

    let analyser = null;

    let source = null;

    let audioInitialized = false;

    // ==========================================
    // CONFIGURACIÓN DE MÚSICA
    // ==========================================

    backgroundMusic.volume = 0.5;
    backgroundMusic.loop = true;

    function iniciarMusica() {

        if (!backgroundMusic) {
            console.error("No se encontró backgroundMusic");
            return;
        }

        if (backgroundMusic.paused) {

            backgroundMusic.play()
                .then(() => {

                    console.log("Música iniciada correctamente");

                    if (playMusic) {
                        playMusic.textContent = "⏸";
                    }

                    const albumCircle =
                        document.querySelector(".album-circle");

                    if (albumCircle) {
                        albumCircle.classList.add("playing");
                    }

                })
                .catch(error => {

                    console.error(
                        "No se pudo reproducir music.mp3:",
                        error
                    );

                    showToast(
                        "No se pudo reproducir la música 🎵"
                    );

                });

        }

    }

    /* =========================================================
    FUNCIÓN PARA SONIDOS
    ========================================================= */

    function playClick() {

        try {

            clickSound.currentTime = 0;

            clickSound.play();

        } catch (error) {

            console.log("Sonido no disponible.");

        }

    }


    /* =========================================================
    CAMBIAR ESCENA
    ========================================================= */

    function goToScene(index) {

        const scenes = document.querySelectorAll(".scene");

        if (index < 0 || index >= scenes.length) {
            return;
        }

        // Ocultar todas las escenas
        scenes.forEach((scene, i) => {
            scene.classList.toggle("active", i === index);
        });

        // Actualizar número
        const sceneNumber = document.getElementById("sceneNumber");

        if (sceneNumber) {
            sceneNumber.textContent = String(index + 1).padStart(2, "0");
        }

        // Actualizar nombre
        const sceneName = document.getElementById("sceneName");

        if (sceneName) {
            sceneName.textContent = sceneNames[index];
        }

        // Actualizar barra
        const progressFill = document.getElementById("progressFill");

        if (progressFill) {
            const progress = ((index + 1) / scenes.length) * 100;
            progressFill.style.width = `${progress}%`;
        }

        // Cerrar menú
        const sideMenu = document.getElementById("sideMenu");

        if (sideMenu) {
            sideMenu.classList.remove("open");
        }

        // Escena de estrellas
        if (index === 2) {
            startStarGame();
        }

        // Escena final
        if (index === 4) {
            createFinalStars();
        }

        // Iniciar música cuando comienza la historia
        if (index === 1) {
            iniciarMusica();
        }
    }
    

    /* =========================================================
    BOTONES DE ESCENA
    ========================================================= */

    document.querySelectorAll(
        ".scene-button"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const next =
                    Number(button.dataset.next);

                goToScene(next);

            }
        );

    });


    /* =========================================================
    MENÚ
    ========================================================= */

    const menuButton =
        document.getElementById("menuButton");

    const closeMenu =
        document.getElementById("closeMenu");

    const sideMenu =
        document.getElementById("sideMenu");


    menuButton.addEventListener(
        "click",
        () => {

            sideMenu.classList.add("open");

        }
    );


    closeMenu.addEventListener(
        "click",
        () => {

            sideMenu.classList.remove("open");

        }
    );


    document.querySelectorAll(
        ".side-menu nav button"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const scene =
                    Number(button.dataset.scene);

                goToScene(scene);

                sideMenu.classList.remove(
                    "open"
                );

            }
        );

    });


    /* =========================================================
    CURSOR
    ========================================================= */

    const cursorGlow =
        document.getElementById("cursorGlow");


    document.addEventListener(
        "mousemove",
        event => {

            cursorGlow.style.left =
                `${event.clientX}px`;

            cursorGlow.style.top =
                `${event.clientY}px`;

        }
    );


/* =========================================================
   ESCENA 02 — CURIOSIDAD
   SISTEMA INTERACTIVO
========================================================= */


/* =========================================================
   ELEMENTOS
========================================================= */

const gymWorld =
    document.getElementById("gymWorld");


const interactiveObjects =
    document.querySelectorAll(
        "#scene-1 .interactive-object"
    );


const objectMessage =
    document.getElementById(
        "objectMessage"
    );


const messageText =
    document.getElementById(
        "messageText"
    );


const closeMessage =
    document.getElementById(
        "closeMessage"
    );


const continueGym =
    document.getElementById(
        "continueGym"
    );


const curiosityHint =
    document.getElementById(
        "curiosityHint"
    );


const curiosityFlash =
    document.getElementById(
        "curiosityFlash"
    );


const discoveryText =
    document.getElementById(
        "discoveryText"
    );


const discoveryDots =
    document.querySelectorAll(
        "#scene-1 .discovery-dots span"
    );


/* =========================================================
   ESTADO
========================================================= */

let discoveredObjects =
    new Set();


let messageTimeout = null;


/* =========================================================
   COMPROBACIÓN
========================================================= */

console.log(
    "===================================="
);

console.log(
    "02 — CURIOSIDAD"
);

console.log(
    "Objetos interactivos:",
    interactiveObjects.length
);

console.log(
    "===================================="
);


/* =========================================================
   DESCUBRIR OBJETO
========================================================= */

function descubrirObjeto(object) {

    if (!object) {
        return;
    }


    /*
       Si ya fue descubierto,
       únicamente mostramos nuevamente
       su mensaje.
    */

    const message =
        object.dataset.message ||
        "Hay algo especial en este momento.";


    mostrarMensajeCuriosidad(
        message
    );


    /*
       No contar dos veces.
    */

    if (
        discoveredObjects.has(
            object
        )
    ) {

        return;

    }


    /*
       Registrar objeto.
    */

    discoveredObjects.add(
        object
    );


    object.classList.add(
        "discovered"
    );


    /*
       Sonido existente.
    */

    if (
        typeof playClick ===
        "function"
    ) {

        playClick();

    }


    /*
       Efecto visual.
    */

    activarFlashObjeto(
        object
    );


    /*
       Actualizar contador.
    */

    actualizarDescubrimiento();


    /*
       Si encontramos todos,
       activar botón.
    */

    if (
        discoveredObjects.size >=
        interactiveObjects.length
    ) {

        activarBotonGym();

    }

}


/* =========================================================
   MENSAJE
========================================================= */

function mostrarMensajeCuriosidad(
    message
) {

    if (
        !objectMessage ||
        !messageText
    ) {

        return;

    }


    clearTimeout(
        messageTimeout
    );


    messageText.textContent =
        message;


    objectMessage.classList.remove(
        "show"
    );


    /*
       Reiniciar animación.
    */

    void objectMessage.offsetWidth;


    objectMessage.classList.add(
        "show"
    );


    /*
       Mantener visible.
    */

    messageTimeout =
        setTimeout(
            () => {

                objectMessage.classList.remove(
                    "show"
                );

            },
            5000
        );

}


/* =========================================================
   FLASH LOCAL
========================================================= */

function activarFlashObjeto(
    object
) {

    if (
        !gymWorld ||
        !curiosityFlash ||
        !object
    ) {

        return;

    }


    const worldRect =
        gymWorld.getBoundingClientRect();


    const objectRect =
        object.getBoundingClientRect();


    const x =
        (
            (
                objectRect.left +
                objectRect.width / 2 -
                worldRect.left
            ) /
            worldRect.width
        ) *
        100;


    const y =
        (
            (
                objectRect.top +
                objectRect.height / 2 -
                worldRect.top
            ) /
            worldRect.height
        ) *
        100;


    curiosityFlash.style
        .setProperty(
            "--flash-x",
            `${x}%`
        );


    curiosityFlash.style
        .setProperty(
            "--flash-y",
            `${y}%`
        );


    curiosityFlash.classList.remove(
        "active"
    );


    void curiosityFlash.offsetWidth;


    curiosityFlash.classList.add(
        "active"
    );

}


/* =========================================================
   ACTUALIZAR DESCUBRIMIENTO
========================================================= */

function actualizarDescubrimiento() {

    const found =
        discoveredObjects.size;


    const total =
        interactiveObjects.length;


    /*
       Texto.
    */

    if (discoveryText) {

        discoveryText.textContent =
            `${found} de ${total} descubiertos`;

    }


    /*
       Puntos.
    */

    discoveryDots.forEach(
        (dot, index) => {

            dot.classList.toggle(
                "found",
                index < found
            );

        }
    );


    /*
       Cuando empieza a explorar,
       ocultamos la pista inferior.
    */

    if (
        found > 0 &&
        curiosityHint
    ) {

        curiosityHint.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   SISTEMA DE CLIC
========================================================= */

if (gymWorld) {

    gymWorld.addEventListener(
        "click",
        function (event) {

            /*
               Buscar objeto real.
            */

            const object =
                event.target.closest(
                    ".interactive-object"
                );


            if (!object) {

                return;

            }


            /*
               Solo objetos de esta escena.
            */

            if (
                !gymWorld.contains(
                    object
                )
            ) {

                return;

            }


            event.preventDefault();

            event.stopPropagation();


            descubrirObjeto(
                object
            );

        }
    );

}


/* =========================================================
   HOVER / PROXIMIDAD
========================================================= */

if (gymWorld) {

    gymWorld.addEventListener(
        "pointermove",
        function (event) {

            const rect =
                gymWorld.getBoundingClientRect();


            const mouseX =
                event.clientX -
                rect.left;


            const mouseY =
                event.clientY -
                rect.top;


            /*
               Parallax ambiental.
            */

            const percentX =
                (
                    mouseX /
                    rect.width
                ) *
                100;


            const percentY =
                (
                    mouseY /
                    rect.height
                ) *
                100;


            gymWorld.style
                .setProperty(
                    "--mouse-x",
                    `${percentX}%`
                );


            gymWorld.style
                .setProperty(
                    "--mouse-y",
                    `${percentY}%`
                );


            /*
               Reacción de proximidad.
            */

            interactiveObjects.forEach(
                object => {

                    const objectRect =
                        object.getBoundingClientRect();


                    const objectCenterX =
                        objectRect.left +
                        objectRect.width / 2;


                    const objectCenterY =
                        objectRect.top +
                        objectRect.height / 2;


                    const distanceX =
                        event.clientX -
                        objectCenterX;


                    const distanceY =
                        event.clientY -
                        objectCenterY;


                    const distance =
                        Math.sqrt(
                            distanceX *
                            distanceX +
                            distanceY *
                            distanceY
                        );


                    /*
                       Radio de proximidad.
                    */

                    object.classList.toggle(
                        "nearby",
                        distance < 105
                    );

                }
            );

        }
    );


    /*
       Cuando sale del escenario.
    */

    gymWorld.addEventListener(
        "pointerleave",
        function () {

            gymWorld.style
                .setProperty(
                    "--mouse-x",
                    "50%"
                );


            gymWorld.style
                .setProperty(
                    "--mouse-y",
                    "50%"
                );


            interactiveObjects.forEach(
                object => {

                    object.classList.remove(
                        "nearby"
                    );

                }
            );

        }
    );

}


/* =========================================================
   CERRAR MENSAJE
========================================================= */

if (closeMessage) {

    closeMessage.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            if (objectMessage) {

                objectMessage.classList.remove(
                    "show"
                );

            }

        }
    );

}


/* =========================================================
   ACTIVAR BOTÓN
========================================================= */

function activarBotonGym() {

    if (!continueGym) {

        return;

    }


    /*
       Habilitar.
    */

    continueGym.disabled =
        false;


    continueGym.classList.remove(
        "disabled-button"
    );


    continueGym.classList.add(
        "enabled"
    );


    continueGym.style.pointerEvents =
        "auto";


    /*
       Sonido de éxito.
    */

    if (successSound) {

        successSound.currentTime =
            0;


        successSound
            .play()
            .catch(
                () => {}
            );

    }


    /*
       Mensaje final.
    */

    if (
        typeof showToast ===
        "function"
    ) {

        showToast(
            "Has descubierto todos los detalles ✦"
        );

    }

}


/* =========================================================
   CONTINUAR
========================================================= */

if (continueGym) {

    continueGym.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            if (
                continueGym.disabled
            ) {

                return;

            }


            /*
               La siguiente escena
               continúa siendo la 03 — Juego.
            */

            goToScene(2);

        }
    );

}


/* =========================================================
   REINICIAR CURIOSIDAD
========================================================= */

function resetCuriosidad() {

    discoveredObjects.clear();


    /*
       Quitar estado de objetos.
    */

    interactiveObjects.forEach(
        object => {

            object.classList.remove(
                "discovered"
            );

            object.classList.remove(
                "nearby"
            );

        }
    );


    /*
       Restablecer contador.
    */

    if (discoveryText) {

        discoveryText.textContent =
            `0 de ${interactiveObjects.length} descubiertos`;

    }


    /*
       Restablecer puntos.
    */

    discoveryDots.forEach(
        dot => {

            dot.classList.remove(
                "found"
            );

        }
    );


    /*
       Mostrar pista.
    */

    if (curiosityHint) {

        curiosityHint.classList.remove(
            "hidden"
        );

    }


    /*
       Ocultar mensaje.
    */

    if (objectMessage) {

        objectMessage.classList.remove(
            "show"
        );

    }


    /*
       Bloquear botón.
    */

    if (continueGym) {

        continueGym.disabled =
            true;


        continueGym.classList.remove(
            "enabled"
        );


        continueGym.classList.add(
            "disabled-button"
        );


        continueGym.style.pointerEvents =
            "none";

    }

}


/* =========================================================
   REINICIAR CUANDO SE ENTRA A CURIOSIDAD
========================================================= */

const curiosityScene =
    document.getElementById(
        "scene-1"
    );


if (curiosityScene) {

    const curiosityObserver =
        new MutationObserver(
            mutations => {

                mutations.forEach(
                    mutation => {

                        if (
                            mutation.attributeName !==
                            "class"
                        ) {

                            return;

                        }


                        if (
                            curiosityScene.classList.contains(
                                "active"
                            )
                        ) {

                            resetCuriosidad();

                        }

                    }
                );

            }
        );


    curiosityObserver.observe(
        curiosityScene,
        {
            attributes: true
        }
    );

}


/* =========================================================
   ESTADO INICIAL
========================================================= */

resetCuriosidad();

/* =========================================================
   MINI JUEGO — ESCENA 2
   SISTEMA DE 5 ESTRELLAS
========================================================= */

const starGame =
    document.getElementById("starGame");

const starsFoundElement =
    document.getElementById("starsFound");

const gameComplete =
    document.getElementById("gameComplete");

const starProgressBar =
    document.getElementById("starProgressBar");

const gameLight =
    document.getElementById("gameLight");

const gameHint =
    document.getElementById("gameHint");

const starMessage =
    document.getElementById("starMessage");

const starMessageText =
    document.getElementById("starMessageText");

const starCore =
    document.getElementById("starCore");


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const TOTAL_STARS = 5;

let foundStars = 0;

let gameStarted = false;

let gameFinished = false;

let messageTimer = null;


/* =========================================================
   MENSAJES
========================================================= */

const starMessages = [

    "Primera pista: a veces basta con notar a alguien.",

    "Segunda pista: una sonrisa puede quedarse en la memoria.",

    "Tercera pista: algunas coincidencias despiertan curiosidad.",

    "Cuarta pista: hace falta un poco de valor para acercarse.",

    "Última pista: quizá todo pueda empezar con un simple hola."

];


/* =========================================================
   POSICIONES BASE
   Las posiciones cambian ligeramente cada partida.
========================================================= */

const starPositions = [

    {
        x: 18,
        y: 28
    },

    {
        x: 78,
        y: 24
    },

    {
        x: 47,
        y: 56
    },

    {
        x: 76,
        y: 72
    },

    {
        x: 24,
        y: 76
    }

];


/* =========================================================
   INICIAR JUEGO
========================================================= */

function startStarGame() {

    if (!starGame) {
        return;
    }


    resetStarGame();


    gameStarted = true;

    gameFinished = false;


    /* Ocultar pantalla final */

    if (gameComplete) {

        gameComplete.classList.remove(
            "show"
        );

    }


    /* Reiniciar núcleo */

    if (starCore) {

        starCore.classList.remove(
            "active"
        );

    }


    /* Reiniciar pista */

    if (gameHint) {

        gameHint.classList.remove(
            "hidden-hint"
        );

    }


    /* Crear estrellas */

    createStars();

}


/* =========================================================
   CREAR LAS 5 ESTRELLAS
========================================================= */

function createStars() {

    if (!starGame) {
        return;
    }


    /* Eliminar estrellas anteriores */

    starGame
        .querySelectorAll(".game-star")
        .forEach(star => {

            star.remove();

        });


    starPositions.forEach(
        (position, index) => {

            createStar(
                position,
                index
            );

        }
    );

}


/* =========================================================
   CREAR UNA ESTRELLA
========================================================= */

function createStar(position, index) {

    if (!starGame) {
        return;
    }


    const star =
        document.createElement("button");


    star.type = "button";

    star.className =
        "game-star";


    star.dataset.star =
        String(index + 1);


    star.setAttribute(
        "aria-label",
        `Estrella ${index + 1}`
    );


    /*
       Pequeña variación aleatoria
       para que el juego no sea idéntico
       cada vez.
    */

    const randomX =
        (Math.random() * 7) - 3.5;

    const randomY =
        (Math.random() * 7) - 3.5;


    let x =
        position.x + randomX;

    let y =
        position.y + randomY;


    /*
       Evitar que la estrella
       quede demasiado cerca
       del borde.
    */

    x = Math.max(
        9,
        Math.min(91, x)
    );

    y = Math.max(
        12,
        Math.min(86, y)
    );


    star.style.left =
        `${x}%`;

    star.style.top =
        `${y}%`;


    /*
       La estrella se construye
       mediante HTML para que
       el área táctil sea grande.
    */

    star.innerHTML = `
        <span>✦</span>
    `;


    /*
       Pequeña diferencia visual
       según dificultad.
    */

    if (index >= 3) {

        star.style.opacity =
            "0.82";

    }


    /*
       Click / touch
    */

    star.addEventListener(
        "click",
        () => {

            collectStar(
                star,
                index
            );

        }
    );


    /*
       Protección contra
       doble interacción.
    */

    star.addEventListener(
        "pointerdown",
        event => {

            event.stopPropagation();

        }
    );


    starGame.appendChild(
        star
    );

}


/* =========================================================
   RECOGER ESTRELLA
========================================================= */

function collectStar(
    star,
    index
) {

    if (!star) {
        return;
    }


    if (
        star.classList.contains(
            "collecting"
        )
    ) {

        return;

    }


    if (gameFinished) {
        return;
    }


    /*
       Bloquear la estrella
    */

    star.classList.add(
        "collecting"
    );


    /*
       Sonido
    */

    if (
        typeof playClick ===
        "function"
    ) {

        playClick();

    }


    /*
       Crear partículas
    */

    createStarParticles(
        star
    );


    /*
       Incrementar contador
    */

    foundStars++;


    updateStarProgress();


    /*
       Mostrar mensaje
    */

    showStarMessage(
        starMessages[index]
    );


    /*
       Ocultar pista después
    */

    if (
        foundStars >= 1 &&
        gameHint
    ) {

        gameHint.classList.add(
            "hidden-hint"
        );

    }


    /*
       Eliminar estrella
    */

    setTimeout(
        () => {

            star.remove();

        },
        550
    );


    /*
       Comprobar final
    */

    if (
        foundStars >= TOTAL_STARS
    ) {

        setTimeout(
            () => {

                completeGame();

            },
            800
        );

    }

}


/* =========================================================
   ACTUALIZAR CONTADOR
========================================================= */

function updateStarProgress() {

    if (starsFoundElement) {

        starsFoundElement.textContent =
            String(foundStars);


        starsFoundElement.classList.remove(
            "counter-pop"
        );


        /*
           Forzar reinicio de animación
        */

        void starsFoundElement.offsetWidth;


        starsFoundElement.classList.add(
            "counter-pop"
        );


        setTimeout(
            () => {

                starsFoundElement.classList.remove(
                    "counter-pop"
                );

            },
            280
        );

    }


    /*
       Barra de progreso
    */

    if (starProgressBar) {

        const percentage =
            (
                foundStars /
                TOTAL_STARS
            ) * 100;


        starProgressBar.style.width =
            `${percentage}%`;

    }

}


/* =========================================================
   MENSAJE DE ESTRELLA
========================================================= */

function showStarMessage(
    message
) {

    if (
        !starMessage ||
        !starMessageText
    ) {

        return;

    }


    clearTimeout(
        messageTimer
    );


    starMessageText.textContent =
        message;


    starMessage.classList.remove(
        "show"
    );


    /*
       Reiniciar animación
    */

    void starMessage.offsetWidth;


    starMessage.classList.add(
        "show"
    );


    messageTimer =
        setTimeout(
            () => {

                starMessage.classList.remove(
                    "show"
                );

            },
            2400
        );

}


/* =========================================================
   PARTÍCULAS DE LA ESTRELLA
========================================================= */

function createStarParticles(
    star
) {

    if (!starGame || !star) {
        return;
    }


    const gameRect =
        starGame.getBoundingClientRect();

    const starRect =
        star.getBoundingClientRect();


    const centerX =
        starRect.left -
        gameRect.left +
        starRect.width / 2;


    const centerY =
        starRect.top -
        gameRect.top +
        starRect.height / 2;


    const particleCount = 18;


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const particle =
            document.createElement("span");


        particle.className =
            "game-particle";


        particle.style.left =
            `${centerX}px`;


        particle.style.top =
            `${centerY}px`;


        /*
           Dirección aleatoria
        */

        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            35 +
            Math.random() * 65;


        const endX =
            Math.cos(angle) *
            distance;


        const endY =
            Math.sin(angle) *
            distance;


        const duration =
            450 +
            Math.random() * 450;


        starGame.appendChild(
            particle
        );


        particle.animate(

            [

                {
                    transform:
                        "translate(-50%, -50%) scale(1)",

                    opacity: 1

                },

                {

                    transform:
                        `translate(
                            calc(-50% + ${endX}px),
                            calc(-50% + ${endY}px)
                        )
                        scale(0)`,

                    opacity: 0

                }

            ],

            {

                duration:
                    duration,

                easing:
                    "cubic-bezier(.2,.8,.3,1)",

                fill:
                    "forwards"

            }

        ).onfinish = () => {

            particle.remove();

        };

    }

}


/* =========================================================
   FINAL DEL JUEGO
========================================================= */

function completeGame() {

    if (gameFinished) {
        return;
    }


    gameFinished = true;


    /*
       Sonido de éxito
    */

    if (successSound) {

        successSound.currentTime = 0;

        successSound
            .play()
            .catch(() => {});

    }


    /*
       Crear núcleo central
    */

    if (starCore) {

        starCore.classList.add(
            "active"
        );

    }


    /*
       Pequeña explosión final
    */

    createFinalGameParticles();


    /*
       Esperar antes de mostrar
       la pantalla final
    */

    setTimeout(
        () => {

            if (gameComplete) {

                gameComplete.classList.add(
                    "show"
                );

            }

        },
        1300
    );


    /*
       Confeti existente
       del proyecto
    */

    setTimeout(
        () => {

            if (
                typeof createConfetti ===
                "function"
            ) {

                createConfetti();

            }

        },
        700
    );

}


/* =========================================================
   PARTÍCULAS FINALES
========================================================= */

function createFinalGameParticles() {

    if (!starGame) {
        return;
    }


    const rect =
        starGame.getBoundingClientRect();


    const centerX =
        rect.width / 2;


    const centerY =
        rect.height / 2;


    for (
        let i = 0;
        i < 35;
        i++
    ) {

        const particle =
            document.createElement("span");


        particle.className =
            "game-particle";


        particle.style.left =
            `${centerX}px`;


        particle.style.top =
            `${centerY}px`;


        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            70 +
            Math.random() *
            180;


        const x =
            Math.cos(angle) *
            distance;


        const y =
            Math.sin(angle) *
            distance;


        const duration =
            800 +
            Math.random() *
            900;


        starGame.appendChild(
            particle
        );


        particle.animate(

            [

                {
                    transform:
                        "translate(-50%, -50%) scale(1.2)",

                    opacity: 1

                },

                {

                    transform:
                        `translate(
                            calc(-50% + ${x}px),
                            calc(-50% + ${y}px)
                        )
                        scale(0)`,

                    opacity: 0

                }

            ],

            {

                duration:
                    duration,

                easing:
                    "cubic-bezier(.2,.8,.3,1)",

                fill:
                    "forwards"

            }

        ).onfinish = () => {

            particle.remove();

        };

    }

}


/* =========================================================
   LUZ DEL CURSOR
========================================================= */

if (starGame && gameLight) {

    starGame.addEventListener(
        "pointermove",
        event => {

            const rect =
                starGame.getBoundingClientRect();


            const x =
                event.clientX -
                rect.left;


            const y =
                event.clientY -
                rect.top;


            gameLight.style.left =
                `${x}px`;


            gameLight.style.top =
                `${y}px`;

        }
    );


    starGame.addEventListener(
        "pointerleave",
        () => {

            gameLight.style.left =
                "50%";


            gameLight.style.top =
                "50%";

        }
    );

}


/* =========================================================
   REINICIAR JUEGO
========================================================= */

function resetStarGame() {

    foundStars = 0;

    gameStarted = false;

    gameFinished = false;


    clearTimeout(
        messageTimer
    );


    /*
       Eliminar estrellas
    */

    if (starGame) {

        starGame
            .querySelectorAll(
                ".game-star"
            )
            .forEach(
                star => star.remove()
            );


        starGame
            .querySelectorAll(
                ".game-particle"
            )
            .forEach(
                particle => particle.remove()
            );

    }


    /*
       Contador
    */

    if (starsFoundElement) {

        starsFoundElement.textContent =
            "0";

    }


    /*
       Barra
    */

    if (starProgressBar) {

        starProgressBar.style.width =
            "0%";

    }


    /*
       Mensaje
    */

    if (starMessage) {

        starMessage.classList.remove(
            "show"
        );

    }


    /*
       Pantalla final
    */

    if (gameComplete) {

        gameComplete.classList.remove(
            "show"
        );

    }


    /*
       Núcleo
    */

    if (starCore) {

        starCore.classList.remove(
            "active"
        );

    }


    /*
       Pista
    */

    if (gameHint) {

        gameHint.classList.remove(
            "hidden-hint"
        );

    }

}


/* =========================================================
   DETECTAR CUANDO SE ABRE LA ESCENA 2
   Permite reiniciar el juego cada vez que
   el usuario vuelve a entrar.
========================================================= */

const gameScene =
    document.getElementById("scene-2");


if (gameScene) {

    const gameObserver =
        new MutationObserver(
            mutations => {

                mutations.forEach(
                    mutation => {

                        if (
                            mutation.attributeName !==
                            "class"
                        ) {

                            return;

                        }


                        if (
                            gameScene.classList.contains(
                                "active"
                            )
                        ) {

                            startStarGame();

                        }

                    }
                );

            }
        );


    gameObserver.observe(
        gameScene,
        {
            attributes: true
        }
    );

}

    /* =========================================================
    CONFETI
    ========================================================= */

    function createConfetti() {

        for (
            let i = 0;
            i < 35;
            i++
        ) {

            const piece =
                document.createElement(
                    "div"
                );


            piece.style.position =
                "fixed";

            piece.style.left =
                `${Math.random() * 100}%`;

            piece.style.top =
                "-20px";

            piece.style.width =
                "5px";

            piece.style.height =
                "10px";

            piece.style.background =
                i % 2 === 0
                    ? "#ff6fae"
                    : "#8d6cff";

            piece.style.zIndex =
                "500";

            piece.style.pointerEvents =
                "none";


            document.body.appendChild(
                piece
            );


            const duration =
                1500 +
                Math.random() * 2000;


            piece.animate(

                [
                    {
                        transform:
                            "translateY(0) rotate(0deg)",
                        opacity: 1
                    },

                    {
                        transform:
                            `translateY(110vh) rotate(${Math.random() * 700}deg)`,
                        opacity: 0
                    }
                ],

                {
                    duration,
                    easing: "cubic-bezier(.2,.8,.3,1)"
                }

            ).onfinish = () => {

                piece.remove();

            };

        }

    }


   
/* =========================================================
   ESCENA 3 — CARTA ANTIGUA
   JAVASCRIPT EXCLUSIVO DE LA CARTA
========================================================= */

const letterScene = document.getElementById("scene-3");
const envelope = document.getElementById("envelope");
const openEnvelopeText = document.getElementById("openEnvelopeText");
const letter = document.getElementById("letter");
const typedLetter = document.getElementById("typedLetter");
const letterContinue = document.getElementById("letterContinue");
const letterFlash = document.getElementById("letterFlash");
const letterParticles = document.getElementById("letterParticles");

/* =========================================================
   TEXTO ORIGINAL DE LA CARTA
========================================================= */

const letterText = `Probablemente te estés preguntando por qué existe toda esta página.

La verdad es bastante simple.

Te he visto algunas veces en el gimnasio y, aunque no nos conocemos, hubo algo en ti que llamó mi atención.

No sé tu nombre.

No sé cuál es tu historia.

No sé qué música escuchas ni cuál es tu película favorita.

Y justamente por eso no quería inventarme una historia sobre ti.

Solo quería encontrar una forma diferente de decir:

Me gustaría conocerte.

Sin presión.

Sin expectativas.

Solo una conversación, si algún día te nace.`;

/* =========================================================
   ESTADO
========================================================= */

let letterOpened = false;
let typingTimer = null;
let letterResetTimer = null;

/* =========================================================
   SONIDO SEGURO
========================================================= */

function letterPlayClick() {
    if (typeof playClick === "function") {
        try {
            playClick();
        } catch (error) {
            console.log("Sonido de carta no disponible.");
        }
    }
}

/* =========================================================
   ABRIR CARTA
========================================================= */

function openAncientLetter() {
    if (letterOpened || !envelope || !letter) {
        return;
    }

    letterOpened = true;

    // Sonido
    letterPlayClick();

    // Abrir sobre
    envelope.classList.add("opened");

    if (openEnvelopeText) {
        openEnvelopeText.textContent = "Una pequeña sorpresa...";
    }

    // Flash
    if (letterFlash) {
        letterFlash.classList.remove("active");
        void letterFlash.offsetWidth;
        letterFlash.classList.add("active");
    }

    // Partículas
    createLetterParticles();

    // Esperar a que se abra el sobre
    setTimeout(() => {
        if (!letter) return;

        letter.classList.add("show");
        letter.setAttribute("aria-hidden", "false");

        // Empezar a escribir después de que aparezca la carta
        setTimeout(() => {
            typeAncientLetter();
        }, 850);

    }, 650);
}

/* =========================================================
   CLICK DEL SOBRE
========================================================= */

if (envelope) {
    envelope.addEventListener("click", openAncientLetter);

    // Accesibilidad
    envelope.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openAncientLetter();
        }
    });
}

/* =========================================================
   PARTÍCULAS DE CENIZA
========================================================= */

function createLetterParticles() {
    if (!letterParticles) return;

    letterParticles.innerHTML = "";

    const particleCount = 13;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("span");
        particle.className = "letter-particle";

        const side = Math.floor(Math.random() * 4);
        let x, y;

        if (side === 0) {        // Arriba
            x = 22 + Math.random() * 56;
            y = 31 + Math.random() * 5;
        } else if (side === 1) { // Derecha
            x = 76 + Math.random() * 7;
            y = 35 + Math.random() * 37;
        } else if (side === 2) { // Abajo
            x = 20 + Math.random() * 60;
            y = 67 + Math.random() * 7;
        } else {                 // Izquierda
            x = 17 + Math.random() * 7;
            y = 34 + Math.random() * 38;
        }

        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;

        // Algunas partículas de color
        if (i === 2 || i === 8) {
            particle.style.width = "4px";
            particle.style.height = "4px";
            particle.style.background = "rgba(207,130,73,.60)";
            particle.style.boxShadow = "0 0 10px rgba(207,130,73,.35)";
        }

        if (i === 5) {
            particle.style.width = "3px";
            particle.style.height = "3px";
            particle.style.background = "rgba(157,126,199,.55)";
            particle.style.boxShadow = "0 0 9px rgba(157,126,199,.30)";
        }

        letterParticles.appendChild(particle);

        const moveX = (Math.random() - 0.5) * 70;
        const moveY = -35 - Math.random() * 75;
        const duration = 900 + Math.random() * 1000;

        particle.animate(
            [
                { transform: "translate(0, 0) scale(1)", opacity: 0.75 },
                { transform: `translate(${moveX}px, ${moveY}px) scale(0.15)`, opacity: 0 }
            ],
            {
                duration,
                delay: Math.random() * 180,
                easing: "cubic-bezier(.2,.7,.3,1)",
                fill: "forwards"
            }
        ).onfinish = () => particle.remove();
    }
}

/* =========================================================
   MÁQUINA DE ESCRIBIR (CORREGIDA)
========================================================= */

function typeAncientLetter() {
    if (!typedLetter) return;

    // Cancelar escritura anterior
    if (typingTimer) {
        clearInterval(typingTimer);
        typingTimer = null;
    }

    // Crear estructura
    typedLetter.innerHTML = `
        <span class="typed-copy"></span>
        <span class="letter-cursor">|</span>
    `;

    const typedCopy = typedLetter.querySelector(".typed-copy");
    const cursor = typedLetter.querySelector(".letter-cursor");

    if (!typedCopy) return;

    let index = 0;
    const typingSpeed = 38; // velocidad agradable

    typingTimer = setInterval(() => {

        if (index >= letterText.length) {
            clearInterval(typingTimer);
            typingTimer = null;

            // Quitar cursor
            if (cursor) {
                cursor.classList.add("finished");
            }

            // Mostrar botón "Seguir"
            if (letterContinue) {
                letterContinue.classList.remove("hidden");

                // Asegurar que se vea
                setTimeout(() => {
                    letterContinue.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest"
                    });
                }, 300);
            }
            return;
        }

        // Escribir carácter
        typedCopy.textContent += letterText[index];
        index++;

        // Mantener scroll abajo
        typedLetter.scrollTop = typedLetter.scrollHeight;

    }, typingSpeed);
}

/* =========================================================
   REINICIAR CARTA
========================================================= */

function resetAncientLetter() {
    if (!envelope || !letter) return;

    letterOpened = false;

    if (typingTimer) {
        clearInterval(typingTimer);
        typingTimer = null;
    }

    envelope.classList.remove("opened");
    letter.classList.remove("show");
    letter.setAttribute("aria-hidden", "true");

    if (openEnvelopeText) {
        openEnvelopeText.textContent = "Haz clic en el sobre";
    }

    if (typedLetter) {
        typedLetter.innerHTML = `
            <span class="typed-copy"></span>
            <span class="letter-cursor">|</span>
        `;
    }

    if (letterContinue) {
        letterContinue.classList.add("hidden");
    }

    if (letterParticles) {
        letterParticles.innerHTML = "";
    }

    if (letterFlash) {
        letterFlash.classList.remove("active");
    }
}

/* =========================================================
   DETECTAR CUANDO ENTRAMOS A LA ESCENA 3
========================================================= */

if (letterScene) {
    const letterObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName !== "class") return;

            if (letterScene.classList.contains("active")) {
                clearTimeout(letterResetTimer);
                letterResetTimer = setTimeout(() => {
                    resetAncientLetter();
                }, 50);
            }
        });
    });

    letterObserver.observe(letterScene, { attributes: true });
}

/* =========================================================
   BOTÓN SEGUIR
========================================================= */

if (letterContinue) {
    letterContinue.addEventListener("click", event => {
        event.preventDefault();
        if (typeof goToScene === "function") {
            goToScene(4);
        }
    });
}

/* =========================================================
   ESTADO INICIAL
========================================================= */

resetAncientLetter();


    /* =========================================================
    ESCENA FINAL
    ========================================================= */

    function createFinalStars() {

        const container =
            document.querySelector(
                ".final-stars"
            );


        container.innerHTML = "";


        for (
            let i = 0;
            i < 70;
            i++
        ) {

            const star =
                document.createElement(
                    "span"
                );


            star.textContent =
                Math.random() > .9
                    ? "✦"
                    : "·";


            star.style.position =
                "absolute";


            star.style.left =
                `${Math.random() * 100}%`;


            star.style.top =
                `${Math.random() * 100}%`;


            star.style.opacity =
                Math.random();


            star.style.fontSize =
                `${4 + Math.random() * 10}px`;


            star.style.color =
                Math.random() > .5
                    ? "#ff9dca"
                    : "#aaa4ff";


            star.animate(

                [
                    {
                        opacity:
                            star.style.opacity
                    },

                    {
                        opacity: .1
                    },

                    {
                        opacity:
                            star.style.opacity
                    }
                ],

                {
                    duration:
                        1500 +
                        Math.random() * 3000,

                    iterations:
                        Infinity
                }

            );


            container.appendChild(
                star
            );

        }

    }


    /* =========================================================
    REINICIAR
    ========================================================= */

    const restartButton =
        document.getElementById(
            "restartButton"
        );


    restartButton.addEventListener(
        "click",
        () => {

            location.reload();

        }
    );


    /* =========================================================
    SALIR
    ========================================================= */

    const exitButton =
        document.getElementById(
            "exitButton"
        );

    const exitMessage =
        document.getElementById(
            "exitMessage"
        );


    exitButton.addEventListener(
        "click",
        () => {

            exitMessage.classList.add(
                "show"
            );


            showToast(
                "Gracias por llegar hasta aquí ✨"
            );

        }
    );


    /* =========================================================
    TOAST
    ========================================================= */

    const toast =
        document.getElementById(
            "toast"
        );

    let toastTimer;


    function showToast(message) {

        toast.textContent =
            message;


        toast.classList.add(
            "show"
        );


        clearTimeout(
            toastTimer
        );


        toastTimer =
            setTimeout(
                () => {

                    toast.classList.remove(
                        "show"
                    );

                },
                3000
            );

    }

/* =========================================================
   CANVAS — PARTÍCULAS + METEORITOS CON EXPLOSIONES
========================================================= */

const backgroundCanvas = document.getElementById("backgroundCanvas");
const backgroundContext = backgroundCanvas.getContext("2d");

let particles = [];
let meteors = [];
let explosions = [];

function resizeCanvas() {
    backgroundCanvas.width = window.innerWidth * window.devicePixelRatio;
    backgroundCanvas.height = window.innerHeight * window.devicePixelRatio;
    backgroundCanvas.style.width = `${window.innerWidth}px`;
    backgroundCanvas.style.height = `${window.innerHeight}px`;

    backgroundContext.setTransform(1, 0, 0, 1, 0, 0);
    backgroundContext.scale(window.devicePixelRatio, window.devicePixelRatio);
}

function createParticles() {
    particles = [];
    const count = Math.min(110, Math.floor(window.innerWidth / 11));

    for (let i = 0; i < count; i++) {
        const type = Math.random();
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 2.2 + 0.4,
            speed: Math.random() * 0.28 + 0.04,
            opacity: Math.random() * 0.55 + 0.18,
            color: type > 0.5 ? "blue" : type > 0.25 ? "cyan" : "pink"
        });
    }
}

/* =========================================================
   CREAR METEORITO
========================================================= */
function createMeteor() {
    // Frecuencia de aparición
    if (Math.random() > 0.012) return;

    meteors.push({
        x: Math.random() * window.innerWidth * 1.1,
        y: -80 - Math.random() * 120,
        length: 90 + Math.random() * 140,
        speed: 7 + Math.random() * 10,
        angle: Math.PI / 4 + (Math.random() * 0.35 - 0.18),
        opacity: 0.85,
        trail: []
    });
}

/* =========================================================
   CREAR EXPLOSIÓN
========================================================= */
function createExplosion(x, y) {
    const count = 18 + Math.floor(Math.random() * 12);

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 4.5;

        explosions.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 1.2 + Math.random() * 2.8,
            life: 1,
            decay: 0.012 + Math.random() * 0.018,
            color: Math.random() > 0.4 ? "warm" : "blue"
        });
    }

    // Destello central
    explosions.push({
        x,
        y,
        vx: 0,
        vy: 0,
        size: 18,
        life: 1,
        decay: 0.04,
        color: "flash"
    });
}

/* =========================================================
   DIBUJAR METEORITO
========================================================= */
function drawMeteor(m) {
    const endX = m.x - Math.cos(m.angle) * m.length;
    const endY = m.y - Math.sin(m.angle) * m.length;

    // Estela
    const gradient = backgroundContext.createLinearGradient(m.x, m.y, endX, endY);
    gradient.addColorStop(0, `rgba(255, 240, 210, ${m.opacity})`);
    gradient.addColorStop(0.25, `rgba(180, 210, 255, ${m.opacity * 0.75})`);
    gradient.addColorStop(0.7, `rgba(120, 160, 255, ${m.opacity * 0.3})`);
    gradient.addColorStop(1, `rgba(80, 120, 255, 0)`);

    backgroundContext.beginPath();
    backgroundContext.moveTo(m.x, m.y);
    backgroundContext.lineTo(endX, endY);
    backgroundContext.strokeStyle = gradient;
    backgroundContext.lineWidth = 2.5;
    backgroundContext.lineCap = "round";
    backgroundContext.stroke();

    // Cabeza brillante
    backgroundContext.beginPath();
    backgroundContext.arc(m.x, m.y, 3.2, 0, Math.PI * 2);
    backgroundContext.fillStyle = `rgba(255, 250, 230, ${m.opacity})`;
    backgroundContext.fill();

    // Halo
    backgroundContext.beginPath();
    backgroundContext.arc(m.x, m.y, 7, 0, Math.PI * 2);
    backgroundContext.fillStyle = `rgba(180, 210, 255, ${m.opacity * 0.25})`;
    backgroundContext.fill();
}

/* =========================================================
   DIBUJAR EXPLOSIONES
========================================================= */
function drawExplosions() {
    for (let i = explosions.length - 1; i >= 0; i--) {
        const e = explosions[i];

        e.x += e.vx;
        e.y += e.vy;
        e.vx *= 0.97;
        e.vy *= 0.97;
        e.life -= e.decay;

        if (e.life <= 0) {
            explosions.splice(i, 1);
            continue;
        }

        const alpha = e.life;

        if (e.color === "flash") {
            // Destello grande
            backgroundContext.beginPath();
            backgroundContext.arc(e.x, e.y, e.size * e.life, 0, Math.PI * 2);
            backgroundContext.fillStyle = `rgba(255, 245, 220, ${alpha * 0.35})`;
            backgroundContext.fill();
        } else {
            let r, g, b;
            if (e.color === "warm") {
                r = 255; g = 200; b = 140;
            } else {
                r = 150; g = 190; b = 255;
            }

            backgroundContext.beginPath();
            backgroundContext.arc(e.x, e.y, e.size * e.life, 0, Math.PI * 2);
            backgroundContext.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            backgroundContext.fill();
        }
    }
}

function animateBackground() {
    requestAnimationFrame(animateBackground);
    backgroundContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // ----- Partículas normales -----
    particles.forEach(p => {
        p.y -= p.speed;
        if (p.y < -10) {
            p.y = window.innerHeight + 10;
            p.x = Math.random() * window.innerWidth;
        }

        let r, g, b;
        if (p.color === "blue") {
            r = 130; g = 175; b = 255;
        } else if (p.color === "cyan") {
            r = 110; g = 210; b = 255;
        } else {
            r = 255; g = 155; b = 210;
        }

        backgroundContext.beginPath();
        backgroundContext.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        backgroundContext.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
        backgroundContext.fill();
    });

    // ----- Meteoritos -----
    createMeteor();

    for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];

        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;

        drawMeteor(m);

        // Cuando el meteorito llega abajo → explosión
        if (m.y > window.innerHeight - 40) {
            createExplosion(m.x, m.y);
            meteors.splice(i, 1);
        }
        // Si se sale por el lado
        else if (m.x > window.innerWidth + 150) {
            meteors.splice(i, 1);
        }
    }

    // ----- Explosiones -----
    drawExplosions();
}

window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
});

resizeCanvas();
createParticles();
animateBackground();


    /* =========================================================
    ON LOAD
    ========================================================= */

    goToScene(0);
