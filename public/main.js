const player = document.querySelector('#player')
player.addEventListener('canplay', e => { player.play()})
const source = document.querySelector('#source')
document.querySelectorAll('a').forEach(el => {
  el.addEventListener('click', ev => {
    ev.preventDefault()
    source.src = ev.currentTarget.href
    player.load()
  })
})
// zmiana głośności i wartości wskaźnika
const volumeIndicator = document.querySelector('#volumeIndicator')
const volume = document.querySelector('#volume')
volumeIndicator.innerHTML = volume.value
volume.addEventListener('input', e => {
  player.volume = volume.value/100
  volumeIndicator.innerHTML = volume.value
})
// zmiana aktywnej stacji
const elements = document.querySelectorAll('.elementDiv')
elements.forEach(element => {
  element.addEventListener('click', e => {
    let current = document.querySelector(".activeStation")
    current.classList.remove("activeStation")
    element.classList.add("activeStation")
  })
})
// Działanie playbuttona
const playButton = document.querySelector('#playButton')
playButton.addEventListener('mouseup', e => {
  if(playButton.classList[1] == "fa-pause-circle"){
    playButton.classList.remove("fa-pause-circle")
    playButton.classList.add("fa-play-circle")
    player.pause()
  }else{
    playButton.classList.remove("fa-play-circle")
    playButton.classList.add("fa-pause-circle")
    player.play()
  }
})

// TODO: zrobić, żeby #nextButton i #previousButton
// zmieniały stacje i podświetlenie dla stacji na następny obiekt