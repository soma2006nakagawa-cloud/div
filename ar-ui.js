(function(){
  const file=(location.pathname.split("/").pop()||"").toLowerCase();
  const title=file==="ar.html"?"避難所AR":file==="ar-test-two.html"?"全モデルARテスト":"観光AR";
  const topbar=document.createElement("div");
  topbar.id="arTopbar";
  topbar.innerHTML=`<div class="ar-brand"><small>しばコレ AR MODE</small><strong>${title}</strong></div><button id="arStatusToggle" type="button" aria-expanded="true">情報を隠す</button>`;
  document.body.appendChild(topbar);

  const help=document.createElement("div");
  help.className="ar-help";
  help.textContent="スマートフォンをゆっくり動かして周囲を確認してください";
  document.body.appendChild(help);

  const debug=document.getElementById("debug");
  const toggle=document.getElementById("arStatusToggle");
  if(debug&&toggle){
    toggle.addEventListener("click",()=>{
      const collapsed=debug.classList.toggle("is-collapsed");
      toggle.textContent=collapsed?"情報を見る":"情報を隠す";
      toggle.setAttribute("aria-expanded",String(!collapsed));
    });
  }
})();
