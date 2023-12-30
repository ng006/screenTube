let stream = null;
    audio = null;
    mixedStream = null;
    chunks = [];
    recorder = null;
    startButton = null;
    stopButton = null;
    downloadButton = null;
    recordVideo = null;


    async function setupStream() {
     try {
           stream = await navigator.mediaDevices.getDisplayMedia({
             video: true
           })

           audio = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100
            }
           })
           setUpVideofeedback()
        }
        catch {

        }
    }

    function setUpVideofeedback() {
        if (stream) {
            const video = document.querySelector('.screen');
            video.srcObject = stream;
            video.play()
        }
        else {
            console.warning("There is nothing to play")
        }
    }

    async function statRecording() {
        await setupStream();
        
        if (stream && audio) {

            mixedStream = new MediaStream();

            stream.getTracks().forEach(track => mixedStream.addTrack(track));
            audio.getTracks().forEach(track => mixedStream.addTrack(track));

            recorder = new MediaRecorder(mixedStream);
            recorder.ondataavailable = handleDataAvailable;
            recorder.onStop = handleStop;
            recorder.start(200)

            startButton.disabled = true;
            stopButton.disable = false;
        }
    }

    function handleDataAvailable(e) {
        chunks.push(e.data)
    }

    function stopRecording() {
        recorder.stop();

        startButton.disabled = false;
        stopButton.disabled = true;

        console.log("Video Recorded...")
    }

    function handleStop() {
        const blob = new Blob(chunks,{
           type: 'video/mp4'
        })
        chunks = [];
        downloadButton = URL.createObjectURL(blob);
        downloadButton.download = 'video/mp4';
        
        recordVideo.src = URL.createObjectURL(blob);
        recordVideo.load();
        recordVideo.onloaderData = () => {
            recordVideo.play();
        }

        const rc = document.querySelector('.videoScreeen1');

        stream.getTracks.forEach(tarck => {
            tarck.stop();
        })

        audio.getTracks.forEach(tarck => {
            tarck.stop();
        })

    }

    window.addEventListener('load', () => {
       startButton = document.querySelector('.start');
       stopButton = document.querySelector('.stop');
       downloadbutton = document.querySelector('.download')
       recorderVideo = document.querySelector('.recorded-video')

       startButton.addEventListener('click',statRecording)
       stopButton.addEventListener('click',stopRecording)
       downloadbutton.addEventListener('click',downloadButton)
    })



