
"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // PASSWORD
    const correctPassword = "1431432";

    const passwordForm = document.getElementById("passwordForm");
    const passwordInput = document.getElementById("passwordInput");
    const passwordMessage = document.getElementById("passwordMessage");

    // SCREENS
    const screens = document.querySelectorAll(".screen");

    function showScreen(id) {
        screens.forEach(screen => screen.classList.remove("active"));
        document.getElementById(id).classList.add("active");
    }

    // SECTION MUSIC
    let currentAudio = null;

    function stopMusic() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }
    }

    function playMusic(file) {
        stopMusic();

        currentAudio = new Audio(file);
        currentAudio.loop = true;
        currentAudio.volume = 0.8;

        currentAudio.play().catch(() => {
            console.log("Audio playback needs user interaction.");
        });
    }

    // WRONG PASSWORD SIREN
    let audioContext = null;
    let sirenOscillator = null;
    let sirenInterval = null;
    let sirenHigh = false;

    function startSiren() {
        if (sirenOscillator) return;

        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();

            sirenOscillator = audioContext.createOscillator();
            const volume = audioContext.createGain();

            sirenOscillator.type = "sawtooth";
            sirenOscillator.frequency.value = 650;
            volume.gain.value = 0.035;

            sirenOscillator.connect(volume);
            volume.connect(audioContext.destination);

            sirenOscillator.start();

            sirenInterval = setInterval(() => {
                sirenHigh = !sirenHigh;
                sirenOscillator.frequency.setTargetAtTime(
                    sirenHigh ? 950 : 550,
                    audioContext.currentTime,
                    0.08
                );
            }, 450);

        } catch (error) {
            console.log("Siren could not start.");
        }
    }

    function stopSiren() {
        if (sirenInterval) {
            clearInterval(sirenInterval);
            sirenInterval = null;
        }

        if (sirenOscillator) {
            try {
                sirenOscillator.stop();
            } catch (error) {}

            sirenOscillator = null;
        }

        if (audioContext) {
            audioContext.close();
            audioContext = null;
        }
    }

    // PASSWORD CHECK
    passwordForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (passwordInput.value === correctPassword) {
            stopSiren();
            passwordMessage.textContent = "";

            showScreen("intro1");

            const introVideo1 = document.getElementById("introVideo1");

            try {
                await introVideo1.play();
            } catch (error) {
                introVideo1.setAttribute("controls", "controls");
                passwordMessage.textContent = "Please press Play on the video.";
            }

        } else {
            passwordMessage.textContent = "Wrong password! Try again.";

            document.getElementById("passwordScreen").classList.remove("shake");
            void document.getElementById("passwordScreen").offsetWidth;
            document.getElementById("passwordScreen").classList.add("shake");

            startSiren();
            passwordInput.value = "";
            passwordInput.focus();
        }
    });

    // INTRO VIDEO 1
    const introVideo1 = document.getElementById("introVideo1");
    const introContinue1 = document.getElementById("introContinue1");

    introVideo1.addEventListener("ended", () => {
        introContinue1.classList.remove("hidden");
    });

    introContinue1.addEventListener("click", () => {
        showScreen("introContinueScreen");
    });

    // SECOND CONTINUE SCREEN
    document.getElementById("introContinue2").addEventListener("click", async () => {
        showScreen("intro2");

        const introVideo2 = document.getElementById("introVideo2");

        try {
            await introVideo2.play();
        } catch (error) {
            introVideo2.setAttribute("controls", "controls");
        }
    });

    // INTRO VIDEO 2
    const introVideo2 = document.getElementById("introVideo2");
    const introContinue3 = document.getElementById("introContinue3");

    introVideo2.addEventListener("ended", () => {
        introContinue3.classList.remove("hidden");
    });

    introContinue3.addEventListener("click", () => {
        showScreen("cakeSection");
        playMusic("Songs/song 1.mp3");
    });

    // CAKE SECTION
    document.getElementById("cakeContinue").addEventListener("click", () => {
        stopMusic();
        showScreen("videosSection");
        startMainVideo(0);
    });

    // THREE MAIN VIDEOS
    const mainVideo = document.getElementById("mainVideo");

    const mainVideos = [
        "Videos/video1.mp4",
        "Videos/video 2.mp4",
        "Videos/video3.mp4"
    ];

    let videoIndex = 0;

    const videoContinue = document.getElementById("videoContinue");

    function startMainVideo(index) {
        videoIndex = index;

        videoContinue.classList.add("hidden");

        mainVideo.pause();
        mainVideo.src = mainVideos[videoIndex];
        mainVideo.load();

        mainVideo.play().catch(() => {
            mainVideo.setAttribute("controls", "controls");
        });
    }

    mainVideo.addEventListener("ended", () => {
        videoContinue.classList.remove("hidden");
    });

    videoContinue.addEventListener("click", () => {
        if (videoIndex < mainVideos.length - 1) {
            startMainVideo(videoIndex + 1);
        } else {
            stopMusic();
            showScreen("picturesSection");
            pictureIndex = 0;
            showPicture();
            playMusic("Songs/song 2.mp3");
        }
    });

    // PICTURE SECTION
    const pictures = [
        "Pictures/pic1.jpeg",
        "Pictures/pic2.jpeg",
        "Pictures/pic3.jpeg"
    ];

    let pictureIndex = 0;
    const mainPicture = document.getElementById("mainPicture");

    function showPicture() {
        mainPicture.style.opacity = "0";

        setTimeout(() => {
            mainPicture.src = pictures[pictureIndex];
            mainPicture.onload = () => {
                mainPicture.style.opacity = "1";
            };
        }, 250);
    }

    document.getElementById("pictureNext").addEventListener("click", () => {
        if (pictureIndex < pictures.length - 1) {
            pictureIndex++;
            showPicture();
        } else {
            stopMusic();
            showScreen("letterSection");
            playMusic("Songs/song 3.mp3");
        }
    });

    // BIRTHDAY LETTER
    document.getElementById("birthdayLetter").innerHTML = `
        <h1>❤️ Happy Birthday, My Love ❤️</h1>
        <h3>To The Most Special Person In My Life 🥹</h3>

        <p><strong>My Dearest Love! ❤️</strong></p>

        <p>Today is your special day, and I want to tell you everything that I sometimes fail to express in my everyday words. First of all, I wish you the happiest birthday from the bottom of my heart. ❤️</p>

        <p>I don't know if my words will ever be enough to make you realize how much you mean to me, but one thing I know for sure is that you are a beautiful part of my life. Talking to you, getting happy over your little things, and dreaming about beautiful moments together means more to me than words can explain.</p>

        <p>I know we are not perfect. There may be times when we disagree, get upset with each other, or misunderstand one another. We are both human, and making mistakes is a part of life.</p>

        <p><strong>But there is one thing I truly wish for: If we ever have misunderstandings between us, I hope we choose to sit together, talk things out, understand each other, and solve every problem together instead of walking away from each other.</strong></p>

        <p>If you ever get upset with me, please tell me how you feel. If something I say hurts you, let me know. And if I ever make a mistake, give me a chance to understand it and make things right. I will always try my best to listen to you, understand your feelings, and improve myself.</p>

        <p>I never want our little arguments or misunderstandings to become bigger than the beautiful relationship we share. I want us to celebrate each other's happiness, support each other through difficult times, and make our bond stronger with every passing day. 🥺❤️</p>

        <p>I don't expect you to be perfect, and I don't expect our relationship to be perfect either. All I wish for is that we remain sincere with each other, respect each other's feelings, and protect our relationship with love, trust, patience, and understanding.</p>

        <p>On your birthday, my biggest prayer is that Allah fills your life with endless happiness, grants you everything your heart wishes for, keeps that beautiful smile on your face forever, and protects you from every pain and sadness.</p>

        <p>And lastly, I just want to say something from my heart:</p>

        <p><strong>I don't know what the future holds for us, but I truly hope we face every chapter of life by understanding each other, supporting each other, and choosing each other every single day. I want us to look back one day and smile at all the beautiful memories we created together. ❤️</strong></p>

        <p>I don't just want beautiful moments with you; I want us to learn, grow, understand, and become better together.</p>

        <p><strong>Happy Birthday, My Love! 🎂❤️</strong></p>

        <p>Always stay happy, keep smiling, and never forget how special you are.</p>

        <p><strong>You are special, your happiness matters, and I genuinely wish to see you happy, today and always. 🥹❤️</strong></p>

        <p><strong>With all my love, prayers, and the warmest wishes! ❤️</strong></p>
    `;

    // LETTER CONTINUE
    document.getElementById("letterContinue").addEventListener("click", () => {
        stopMusic();
        showScreen("finalSection");

        playFinalSongs();
    });

    // FINAL SONGS: LAST 1 THEN LAST 2
    async function playFinalSongs() {
        stopMusic();

        const finalSongs = [
            "Songs/last 1.mp3",
            "Songs/last 2.mp3"
        ];

        let finalIndex = 0;

        function playNextFinalSong() {
            if (finalIndex >= finalSongs.length) return;

            currentAudio = new Audio(finalSongs[finalIndex]);
            currentAudio.volume = 0.8;

            currentAudio.addEventListener("ended", () => {
                finalIndex++;
                playNextFinalSong();
            });

            currentAudio.play().catch(() => {
                console.log("Final song playback needs user interaction.");
            });
        }

        playNextFinalSong();
    }
// FINAL ENDING: FLOATING LETTER AND PICTURES

function createFinalFloatingBackground() {
    const finalSection = document.getElementById("finalSection");

    if (document.getElementById("finalFloatingLayer")) return;

    const layer = document.createElement("div");
    layer.id = "finalFloatingLayer";

    // Floating birthday letter
    const letterCard = document.createElement("div");
    letterCard.className = "final-floating-letter";
    letterCard.innerHTML =
        document.getElementById("birthdayLetter").innerHTML;

    layer.appendChild(letterCard);

    // Floating birthday pictures
    pictures.forEach((picture, index) => {
        const image = document.createElement("img");
        image.src = picture;
        image.className = "final-floating-picture";
        image.alt = "Birthday memory";
        image.style.animationDelay = (index * 5) + "s";
        layer.appendChild(image);
    });

    finalSection.prepend(layer);
}

// Start the moving memories when final section opens
document.getElementById("letterContinue").addEventListener("click", () => {
    createFinalFloatingBackground();
});
    console.log("Jeya Birthday Surprise is ready!");

});
