
const board = document.getElementById('board');
const winMessage = document.getElementById('winMessage');
const resetBtn = document.getElementById('resetBtn');
const difficultySelect = document.getElementById('difficulty');


const baseSymbols = ['🍎','🍌','🍒','🍇','🍉','🥝','🍓','🥑','🍍','🍑','🥥','🥭'];

let currentCards = [];
let flipped = [];
let matched = [];


const difficultySettings = {
  easy: 9,
  intermediate: 16,
  advanced: 24
};




function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [array[i],array[j]] = [array[j],array[i]];
  }
  return array;
}


function createBoard(){
  board.innerHTML='';

  const diff = difficultySelect.value;
  const numCards = difficultySettings[diff];


  const neededSymbols = baseSymbols.slice(0, Math.ceil(numCards/2));
  currentCards = [...neededSymbols, ...neededSymbols].slice(0,numCards);
  shuffle(currentCards);


  if(numCards <= 9) board.style.gridTemplateColumns = 'repeat(3, 1fr)';
  else if(numCards <=16) board.style.gridTemplateColumns = 'repeat(4, 1fr)';
  else board.style.gridTemplateColumns = 'repeat(6, 1fr)';

  currentCards.forEach(symbol=>{
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<div class="front">${symbol}</div><div class="back">?</div>`;
    board.appendChild(card);

    card.addEventListener('click', ()=>flipCard(card, symbol));
  });

  matched = [];
  flipped = [];
  winMessage.classList.remove('show');
}

function flipCard(card, symbol){
  if(flipped.length<2 && !card.classList.contains('flip') && !matched.includes(card)){
    card.classList.add('flip');
    flipped.push({card, symbol});

    if(flipped.length===2){
      setTimeout(checkMatch,700);
    }
  }
}

function checkMatch(){
  const [first, second] = flipped;
  if(first.symbol === second.symbol){
    matched.push(first.card, second.card);
    spawnParticles(first.card);
    spawnParticles(second.card);
  } else{
    first.card.classList.remove('flip');
    second.card.classList.remove('flip');
  }
  flipped=[];
  if(matched.length === currentCards.length){
    winMessage.classList.add('show');
  }
}


function spawnParticles(card){
  const rect = card.getBoundingClientRect();
  for(let i=0;i<12;i++){
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = rect.left + rect.width/2 + 'px';
    particle.style.top = rect.top + rect.height/2 + 'px';
    const angle = Math.random()*2*Math.PI;
    const distance = Math.random()*60+20;
    particle.style.setProperty('--dx', Math.cos(angle)*distance + 'px');
    particle.style.setProperty('--dy', Math.sin(angle)*distance + 'px');
    document.body.appendChild(particle);
    setTimeout(()=>document.body.removeChild(particle),600);
  }
}


resetBtn.addEventListener('click', createBoard);
difficultySelect.addEventListener('change', createBoard);

createBoard();
