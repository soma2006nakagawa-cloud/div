const menuButton=document.getElementById("menuButton");
const headerMenu=document.getElementById("headerMenu");
const menuBackdrop=document.getElementById("menuBackdrop");
const menuCloseButton=document.getElementById("menuCloseButton");

function closeMenu(){
  headerMenu.classList.remove("open");
  headerMenu.setAttribute("aria-hidden","true");
  menuBackdrop.hidden=true;
  document.body.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded","false");
  menuButton.setAttribute("aria-label","メニューを開く");
}

function openMenu(){
  headerMenu.classList.add("open");
  headerMenu.setAttribute("aria-hidden","false");
  menuBackdrop.hidden=false;
  document.body.classList.add("menu-open");
  menuButton.setAttribute("aria-expanded","true");
  menuButton.setAttribute("aria-label","メニューを閉じる");
}

menuButton.addEventListener("click",()=>headerMenu.classList.contains("open")?closeMenu():openMenu());
menuBackdrop.addEventListener("click",closeMenu);
menuCloseButton.addEventListener("click",closeMenu);
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeMenu()});

function readArray(key){
  try{const value=JSON.parse(localStorage.getItem(key));return Array.isArray(value)?value:[]}
  catch(error){return []}
}

function stampCount(){
  try{
    const value=JSON.parse(localStorage.getItem("collectedStamps"));
    return Array.isArray(value)?value.length:value&&typeof value==="object"?Object.keys(value).length:0;
  }catch(error){return 0}
}

const levels=[
  {name:"新発田ビギナー",points:0},
  {name:"街歩き見習い",points:500},
  {name:"新発田探検家",points:1500},
  {name:"しばコレマスター",points:3000},
  {name:"新発田観光名人",points:4250}
];
const points=Number(localStorage.getItem("totalScore"))||0;
const collection=readArray("unlockedCollection").length;
const quizzes=readArray("answeredSpots").length;
const stamps=stampCount();
let current=levels[0],next=null;
levels.forEach(level=>{if(points>=level.points)current=level;else if(!next)next=level});
const progress=next?Math.max(0,Math.min(100,(points-current.points)/(next.points-current.points)*100)):100;

document.getElementById("homeTitle").textContent=current.name;
document.getElementById("homePoints").textContent=`${points.toLocaleString()} pt`;
document.getElementById("homeProgress").style.width=`${progress}%`;
document.getElementById("homeCollection").textContent=`${Math.min(collection,21)}/21`;
document.getElementById("homeStamps").textContent=`${Math.min(stamps,21)}/21`;
document.getElementById("homeQuizzes").textContent=quizzes;
