import axios from 'axios'

import React from 'react'
import { useState } from 'react'


// önerilen başlangıç stateleri
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {

const [state, setState] = useState({
  message: initialMessage,
  email: initialEmail,
  steps: initialSteps,
  index: initialIndex
});

const grid=[
  '(1, 1)', '(2, 1)', '(3, 1)',
  '(1, 2)', '(2, 2)' ,'(3, 2)',
  '(1, 3)', '(2, 3)' ,'(3, 3)',
]

  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.

  function getXY() {
    return grid[state.index];
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
  }

  function getXYMesaj() {
    return `Koordinatlar ${getXY()}`;
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
  }

  function reset() {

    setState({
      message: initialMessage,
      email: initialEmail,
      steps: initialSteps,
      index: initialIndex,
      grid:getXY()
    });
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
  }

  function sonrakiIndex(yon) {

    const id=yon.target.id;
console.log(state.index);

if (id === "left") {
  state.index >= 1 && state.index%3!==0 ? setState({...state,index: state.index - 1, steps: state.steps + 1,message:""})  
                                        : setState({...state,index:state.index,message:"You can't go left"});

  
}
else if (id === "right") {
  state.index <8 && state.index%3!==2? setState({...state,index:state.index+1, steps: state.steps + 1,message:""}) 
                                        : setState({...state,index:state.index,message:"You can't go right"});
  console.log(state.index);
}
else if (id === "up") {
  state.index >= 3 ? setState({...state,index:state.index-3, steps: state.steps + 1,message:""}) 
                                        : setState({...state,index:state.index,message:"You can't go up"});
}
else if (id === "down") {
  state.index <= 5 ? setState({...state,index:state.index+3, steps: state.steps + 1,message:""}) 
                                        : setState({...state,index:state.index,message:"You can't go down"});
}
 
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
  }

  function ilerle(evt) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
  }

  function onChange(evt) {
    setState({...state, email:evt.target.value});
    console.log(state.email);
    // inputun değerini güncellemek için bunu kullanabilirsiniz
  }

  function onSubmit(evt) {
    evt.preventDefault();
    payload={grid:state.grid,steps:state.steps,email:state.email}

    axios.post('http://localhost:9000/api/result', payload)
    .then((response) => {
      setState({...state, message:response.data.message,email:""});
    })
    .catch((error) => {
      setState({...state, message:error.response.data.message,email:""});
    });

    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{state.steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === state.index ? ' active' : ''}`}>

              {idx === state.index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{state.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={sonrakiIndex}>SOL</button>
        <button id="up" onClick={sonrakiIndex}>YUKARI</button>
        <button id="right" onClick={sonrakiIndex}>SAĞ</button>
        <button id="down" onClick={sonrakiIndex}>AŞAĞI</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" value={state.email} placeholder="email girin" onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
