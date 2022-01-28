const configuration = {
  iceServers: [
    { url: 'stun:stun.l.google.com:19302' }
  ]
}

const video = document.querySelector('video')
const inputField = document.getElementById('inputField')
const inputSend = document.getElementById('inputSend')
const chat = document.getElementById('chat')
const draw = document.getElementById('draw')
const dialog = document.getElementById('dialog')
const fn = document.getElementById('fn')
const params = document.getElementById('params')
const dialogDraw = document.getElementById('dialogDraw')

const rc = rough.canvas(document.getElementById('draw'))
let peerConn
let dataChannel

//draw [{"fn":"rectangle", "params": [10, 10, 200, 200]}]

draw.addEventListener('click', () => {
  dialog.showModal()
})

dialogDraw.addEventListener('click', () => {
  sendDataMessage(JSON.stringify({
    type: 'draw',
    content: `draw ${JSON.stringify([{fn: fn.value, params: JSON.parse(params.value)}])}`
  }))
  dialog.close()
})

const sendChat = () => {
  const text = inputField.value
  if (text.startsWith('color ')) {
    sendDataMessage(JSON.stringify({
      type: 'color',
      content: text
    }))
  } else {
    if (text.startsWith('draw ')) {
      sendDataMessage(JSON.stringify({
        type: 'draw',
        content: text
      }))
    } else {
      sendDataMessage(JSON.stringify({
        type: 'chat',
        content: text
      }))
      chat.innerHTML += `
        <div>
          <span>from me:</span> ${text}
        </div>
      `
    }
  }
}

inputSend.addEventListener('click', sendChat)

const randomToken = () => {
  return Math.floor((1 + Math.random()) * 1e16).toString(16).substring(1)
}

let isInitiator
let room = window.location.hash.substring(1)
if (!room) {
  room = window.location.hash = randomToken()
}

const socket = io.connect()

socket.on('created', () => {
  isInitiator = true
  grabWebCamVideo()
})

socket.on('joined', () => {
  isInitiator = false
  createPeerConnection(isInitiator, configuration)
  grabWebCamVideo()
})

socket.on('full', function (room) {
  alert('Room ' + room + ' is full. We will create a new room for you.');
  window.location.hash = ''
  window.location.reload()
})

socket.on('ready', function() {
  createPeerConnection(isInitiator, configuration)
})

socket.on('message', function(message) {
  signalingMessageCallback(message)
})

socket.emit('create or join', room)

socket.on('disconnect', function(reason) {
  inputSend.disabled = true
})

function grabWebCamVideo() {
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
  })
  .then(gotStream)
  .catch(function(e) {
    console.warn(e)
  })
}

function gotStream(stream) {
  window.stream = stream
  video.srcObject = stream
}


function createPeerConnection(isInitiator, config) {
  peerConn = new RTCPeerConnection(config)

  peerConn.onicecandidate = function(event) {
    if (event.candidate) {
      sendMessage({
        type: 'candidate',
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate
      })
    } else {
      console.log('End of candidates.')
    }
  }

  if (isInitiator) {
    dataChannel = peerConn.createDataChannel('data')
    onDataChannelCreated(dataChannel)

    peerConn.createOffer().then(function(offer) {
      return peerConn.setLocalDescription(offer)
    })
    .then(() => {
      sendMessage(peerConn.localDescription)
    })
    .catch(logError)

  } else {
    peerConn.ondatachannel = function(event) {
      dataChannel = event.channel
      onDataChannelCreated(dataChannel)
    }
  }
}

function sendMessage(message) {
  if (message) {
    socket.emit('message', message);
  }
}

function signalingMessageCallback(message) {
  if (message.type === 'offer') {
    peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {}, logError)
    peerConn.createAnswer(onLocalSessionCreated, logError);
  } else if (message.type === 'answer') {
    peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {}, logError)
  } else if (message.type === 'candidate') {
    peerConn.addIceCandidate(new RTCIceCandidate({
      candidate: message.candidate,
      sdpMLineIndex: message.label,
      sdpMid: message.id
    }))
  }
}

function onLocalSessionCreated(desc) {
  peerConn.setLocalDescription(desc).then(function() {
    sendMessage(peerConn.localDescription)
  }).catch(logError)
}

function onDataChannelCreated(channel) {
  channel.onopen = function() {
    inputSend.disabled = false;
  }

  channel.onclose = function () {
    inputSend.disabled = true
  }

  channel.onmessage = (event) => {
    const data = JSON.parse(event.data)
    switch (data.type) {
      case 'chat':
        renderChatMessage(data)
        break
      case 'color': 
        renderColor(data.content)
        break
      case 'draw':
        renderDraw(data.content)
      default:
        console.log('unknown message')
    }
  }

}

function renderChatMessage(data) {
  chat.innerHTML += `
    <div>
      <span>from other:</span> ${data.content}
    </div>
  `
}

function renderColor(color) {
  const body = document.querySelector('body')
  body.style.backgroundColor = color.replace('color ', '')
}

function renderDraw(drawSpec) {
  const spec = drawSpec.replace('draw ', '')
  const jsonSpec = JSON.parse(spec)
  for (const item of jsonSpec) {
    rc[item.fn](...item.params)
  }
}

function sendDataMessage(message) {
  dataChannel.send(message)
}

function logError(err) {
  if (!err) return;
  if (typeof err === 'string') {
    console.warn(err);
  } else {
    console.warn(err.toString(), err);
  }
}
