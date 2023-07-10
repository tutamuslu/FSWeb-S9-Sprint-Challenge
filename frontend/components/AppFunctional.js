import axios from 'axios'
import React, { useState } from 'react'

// önerilen başlangıç stateleri
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.

  const [state, setState] = useState({
    message: initialMessage,
    email:initialEmail,
    steps:initialSteps,
    index: initialIndex
});

const grid = [[1, 1], [2, 1], [3, 1],
  [1, 2], [2, 2], [3, 2],
  [1, 3], [2, 3], [3, 3]]

  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.

    return grid[state.index];

  }

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.

    const [x, y] = getXY();
    return `Koordinatlar (${x}, ${y})`

  }

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.

    setState({ 
      message: initialMessage,
      email:initialEmail,
      steps:initialSteps,
      index: initialIndex})
  }

  function sonrakiIndex(yon) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    const [x, y] = getXY();
    if(yon === "left" && x !==1 ) {
      setState({...state, index: state.index-1, message:"", steps:state.steps+1})
    }

    else if(yon === "right" && x !==3) {
      setState({...state, index: state.index+1, message:"", steps:state.steps+1})
    }

    else if(yon === "up" && y !==1) {
      setState({...state, index: state.index-3, message:"", steps:state.steps+1})
    }

    else if(yon === "down" && y !==3) {
      setState({...state, index: state.index+3, message:"", steps:state.steps+1})
    }
    
    if(yon === "left" && x ===1 ) {
      setState({...state, index: state.index-1, message:"Sola gidemezsiniz"})
    }

    else if(yon === "right" && x ===3) {
      setState({...state, index: state.index+1, message:"Sağa gidemezsiniz"})
    }

    else if(yon === "up" && y ===1) {
      setState({...state, index: state.index-3, message:"Yukarı gidemezsiniz"})
    }

    else if(yon === "down" && y ===3) {
      setState({...state, index: state.index+3, message:"Aşağı gidemezsiniz"})
    }
    
  }

  function ilerle(evt) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.

    sonrakiIndex(evt.target.id);
  }

  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz

    setState({...state, email:evt.target.value})
  }

  function onSubmit(evt) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
evt.preventDefault();
const[x,y] = getXY();
const payload = {x:x, y:y, steps:steps.state , email: state.email}

axios
.post("http://localhost:9000/api/result", payload)
.then(res => {
  setState({...state, message: res.data.message})
} )
  
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{state.steps}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === 4 ? ' active' : ''}`}>
              {idx === 4 ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message"></h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={ilerle}>SOL</button>
        <button id="up" onClick={ilerle}>YUKARI</button>
        <button id="right" onClick={ilerle}>SAĞ</button>
        <button id="down" onClick={ilerle}>AŞAĞI</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form>
        <input id="email" type="email" placeholder="email girin" onChange={onChange}></input>
        <input id="submit" type="submit" onSubmit={onSubmit}></input>
      </form>
    </div>
  )
}
