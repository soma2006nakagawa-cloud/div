const menuButton=document.getElementById("menuButton");
const headerMenu=document.getElementById("headerMenu");

function closeMenu(){
  headerMenu.hidden=true;
  menuButton.setAttribute("aria-expanded","false");
  menuButton.setAttribute("aria-label","メニューを開く");
}

menuButton.addEventListener("click",event=>{
  event.stopPropagation();
  const willOpen=headerMenu.hidden;
  headerMenu.hidden=!willOpen;
  menuButton.setAttribute("aria-expanded",String(willOpen));
  menuButton.setAttribute("aria-label",willOpen?"メニューを閉じる":"メニューを開く");
});

headerMenu.addEventListener("click",event=>event.stopPropagation());
document.addEventListener("click",closeMenu);
document.addEventListener("keydown",event=>{
  if(event.key==="Escape")closeMenu();
});
