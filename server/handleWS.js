const storage = {}
const chats = {}

const debounce = (func, delay) => {
  let timeoutId

  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
    return {
      cancel: () => {
        clearTimeout(timeoutId)
      }
    }
  }
}

function generateKey(str1, str2) {
  return [str1, str2].sort().join('\n')
}

function getChats(username) {
  return Object.entries(chats).reduce((res, [key, chat]) => {
    const usernames = key.split('\n')
    if (usernames.includes(username)) {
      const interlocutor = usernames.find((name) => name !== username)
      res.push({
        interlocutor,
        isOnline: storage[interlocutor].isOnline,
        lastSeenAt: storage[interlocutor].lastSeenAt,
        messages: chat
      })
    }
    return res
  }, [])
}

function getInterlocutors(username) {
  return Object.keys(chats)
    .filter((key) => key.includes(username))
    .map((key) => {
      const [name1, name2] = key.split('\n')
      return name1 === username ? name2 : name1
    })
}

function notifyInterlocutors(username, message) {
  getInterlocutors(username).forEach((interlocutor) => {
    if (storage[interlocutor].ws) sendObject(storage[interlocutor].ws, message)
  })
}

function sendObject(socket, object) {
  const jsonString = JSON.stringify(object)
  console.log('msg to send: ', object)
  socket.send(jsonString)
}

function getCurrTs() {
  return new Date().getTime()
}

function handleAuth(ws, ts, sender) {
  const username = storage[sender] ? sender : sender.replaceAll('\n', ' ').trim()
  if (!storage[username]) {
    storage[username] = {
      debouncedGoOffline: debounce(() => {
        storage[username].isOnline = false
        notifyInterlocutors(username, {
          type: 'updateStatus',
          payload: { interlocutor: username, isOnline: false, lastSeenAt: getCurrTs() }
        })
      }, 10000),
      isOnline: true,
      lastSeenAt: ts,
      ws
    }
    storage[username].debouncedGoOffline()
    Object.entries(storage).forEach(([name, user]) => {
      if (name !== username) {
        chats[generateKey(username, name)] = [
          {
            id: 0,
            timestamp: ts,
            text: 'дарова',
            sender: username,
            receiver: name,
            hasBeenSent: true,
            hasBeenRead: false
          }
        ]
        if (user.ws)
          sendObject(user.ws, {
            type: 'update',
            payload: { chats: getChats(name) }
          })
      }
    })
  } else
    storage[username] = {
      ...storage[username],
      isOnline: true,
      lastSeenAt: ts,
      ws
    }
  sendObject(ws, {
    type: 'update',
    payload: { username, chats: getChats(username) }
  })
}

function handleSendMessage(chatKey, ts, sender, receiver, text) {
  const message = {
    id: Object.values(chats[chatKey]).length,
    timestamp: ts,
    text,
    sender,
    hasBeenSent: true,
    hasBeenRead: false
  }
  chats[chatKey].push(message)
  if (storage[sender].ws)
    sendObject(storage[sender].ws, {
      type: 'newMsg',
      payload: { message, interlocutor: receiver }
    })
  if (storage[receiver].ws)
    sendObject(storage[receiver].ws, {
      type: 'newMsg',
      payload: { message, interlocutor: sender }
    })
}

function handleConfirmReading(chatKey, id, sender, receiver) {
  const targetMsg = chats[chatKey].find((msg) => msg.id === id)
  targetMsg.hasBeenRead = true
  if (storage[sender].ws)
    sendObject(storage[sender].ws, {
      type: 'confirmReading',
      payload: { id: targetMsg.id, interlocutor: receiver }
    })
  if (storage[receiver].ws)
    sendObject(storage[receiver].ws, {
      type: 'confirmReading',
      payload: { id: targetMsg.id, interlocutor: sender }
    })
}

module.exports = function (ws, { type, payload: { id, sender, receiver, text } }) {
  const chatKey = generateKey(sender, receiver)
  let ts = getCurrTs()

  if (storage[sender]) {
    storage[sender].lastSeenAt = ts
    storage[sender].debouncedGoOffline()
    if (!storage[sender].isOnline) {
      storage[sender].isOnline = true
      notifyInterlocutors(sender, {
        type: 'updateStatus',
        payload: { interlocutor: sender, isOnline: true, lastSeenAt: ts }
      })
    }
  }

  switch (type) {
    case 'auth':
      handleAuth(ws, ts, sender)
      break
    case 'sendMsg':
      handleSendMessage(chatKey, ts, sender, receiver, text)
      break
    case 'confirmReading':
      handleConfirmReading(chatKey, id, sender, receiver)
      break
    case 'startTyping':
      sendObject(storage[receiver].ws, {
        type: 'setIsTyping',
        payload: { interlocutor: sender, isTyping: true }
      })
      break
    case 'finishTyping':
      sendObject(storage[receiver].ws, {
        type: 'setIsTyping',
        payload: { interlocutor: sender, isTyping: false }
      })
      break
  }
}
