const micIcon = document.getElementById('mic-icon');
const captions = document.getElementById("captions");
const captionSound = document.getElementById("captionSound");

let isRecording = false;
let currentSpeaker = null;
const speakerColors = ['#FFFFFF', '#FFD700', '#00FF00', '#FF69B4', '#1E90FF']; // Add more colors if needed

async function getMicrophone() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return new MediaRecorder(stream, { mimeType: "audio/webm" });
  } catch (error) {
    console.error("error accessing microphone:", error);
    throw error;
  }
}

async function openMicrophone(microphone, socket) {
  return new Promise((resolve) => {
    microphone.onstart = () => {
      console.log("client: microphone opened");
      document.body.classList.add("recording");
      resolve();
    };

    microphone.onstop = () => {
      console.log("client: microphone closed");
      document.body.classList.remove("recording");
    };

    microphone.ondataavailable = (event) => {
      console.log("client: microphone data received");
      if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
        socket.send(event.data);
      }
    };

    microphone.start(1000);
  });
}

async function closeMicrophone(microphone) {
  microphone.stop();
}

async function start(socket) {
  const listenButton = document.querySelector("#record");
  let microphone;

  console.log("client: waiting to open microphone");

    if (!microphone) {
      try {
        microphone = await getMicrophone();
        await openMicrophone(microphone, socket);
      } catch (error) {
        console.error("error opening microphone:", error);
      }
    } else {
      await closeMicrophone(microphone);
      microphone = undefined;
    }
}

window.addEventListener("load", () => {
  const socket = new WebSocket("ws://localhost:3000");

  socket.addEventListener("open", async () => {
    console.log("client: connected to server");
    await start(socket);
  });

  socket.addEventListener("message", (event) => {
    if (event.data === "") {
      return;
    }
    
    let data;
    try {
      data = JSON.parse(event.data);
      console.log('Received data:', data);  // Log the entire data object
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return;
    }

    // Check for the correct data structure
    if (data && data.channel && data.channel.alternatives && data.channel.alternatives[0].words) {
      const words = data.channel.alternatives[0].words;
      console.log('Words:', words);  // Log the words array

      let currentText = '';
      let speakerChanged = false;

      words.forEach((word, index) => {
        const speaker = word.speaker || 0;  // Default to speaker 0 if not specified
        if (speaker !== currentSpeaker) {
          if (currentText) {
            appendText(currentText, currentSpeaker, speakerChanged);
            currentText = '';
          }
          currentSpeaker = speaker;
          speakerChanged = true;
        }
        currentText += (index > 0 ? ' ' : '') + word.punctuated_word;  // Use word.word instead of word.text
      });

      if (currentText) {
        appendText(currentText, currentSpeaker, speakerChanged);
      }

      // Scroll the window to show the latest caption
      scrollToBottom();

      // Play the sound if the speaker changed
      if (speakerChanged) {
        captionSound.currentTime = 0;
        captionSound.play().catch(e => console.error("Error playing sound:", e));
      }
    } else {
      console.log('Unexpected data structure:', data);
    }
  });

  socket.addEventListener("close", () => {
    console.log("client: disconnected from server");
  });
});

function appendText(text, speaker, speakerChanged) {
  const newParagraph = document.createElement('p');
  let content = '';
  
  if (speakerChanged) {
    content += `<strong>[Speaker ${speaker}]</strong> `;
  }
  
  content += text;
  
  newParagraph.innerHTML = `
    <span class="remove-caption">×</span>
    ${content}
  `;
  newParagraph.style.color = speakerColors[speaker % speakerColors.length];
  
  // Add click event listener to the remove button
  const removeButton = newParagraph.querySelector('.remove-caption');
  removeButton.addEventListener('click', function() {
    newParagraph.remove();
  });
  
  captions.appendChild(newParagraph);
}

// Function to scroll to the bottom of the page
function scrollToBottom() {
  const scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );
  
  window.scrollTo({
    top: scrollHeight,
    behavior: 'smooth'
  });
}

// Function to toggle recording
function toggleRecording() {
    isRecording = !isRecording;
    micIcon.classList.toggle('recording', isRecording);
    if (isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
}

// Function to start recording
function startRecording() {
    // Your existing code to start recording
    console.log('Recording started');
    // Add your WebSocket connection and recording logic here
}

// Function to stop recording
function stopRecording() {
    // Your existing code to stop recording
    console.log('Recording stopped');
    // Add your logic to stop recording and close WebSocket connection here
}

// Automatically start recording when the page loads
window.addEventListener('load', () => {
    toggleRecording();
});

// Allow manual toggle of recording by clicking the microphone icon
micIcon.addEventListener('click', toggleRecording);

// Add a "Clear Captions" button next to the microphone
document.getElementById('clear-captions').addEventListener('click', () => {
  document.getElementById('captions').innerHTML = ''; // Clear current captions
});
