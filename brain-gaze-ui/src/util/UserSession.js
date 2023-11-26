import {v4 as uuidv4 } from 'uuid'

const getSessionId = () => {
  if(sessionStorage.getItem('sessionId')) {
    return sessionStorage.getItem('sessionId');
  } else {
    const new_session_id = uuidv4();
    sessionStorage.setItem('sessionId', new_session_id); 
  }
}

export {getSessionId}