const menuButton=document.getElementById("menuButton");
const headerMenu=document.getElementById("headerMenu");
const menuBackdrop=document.getElementById("menuBackdrop");
const menuCloseButton=document.getElementById("menuCloseButton");

function closeMenu(){
  headerMenu.classList.remove("open");
  headerMenu.setAttribute("aria-hidden","true");
  menuBackdrop.hidden=true;
  menuCloseButton.hidden=true;
  document.body.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded","false");
  menuButton.setAttribute("aria-label","メニューを開く");
}

function openMenu(){
  headerMenu.classList.add("open");
  headerMenu.setAttribute("aria-hidden","false");
  menuBackdrop.hidden=false;
  menuCloseButton.hidden=false;
  document.body.classList.add("menu-open");
  menuButton.setAttribute("aria-expanded","true");
  menuButton.setAttribute("aria-label","メニューを閉じる");
}

menuButton.addEventListener("click",event=>{
  event.stopPropagation();
  if(headerMenu.classList.contains("open"))closeMenu();
  else openMenu();
});

headerMenu.addEventListener("click",event=>event.stopPropagation());
menuBackdrop.addEventListener("click",closeMenu);
menuCloseButton.addEventListener("click",closeMenu);
document.addEventListener("keydown",event=>{
  if(event.key==="Escape")closeMenu();
});
