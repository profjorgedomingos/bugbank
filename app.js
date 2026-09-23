let actions=0, cart=[], discount=0, cases=[];
const $=id=>document.getElementById(id);
function tested(){actions++;$("testCount").textContent=actions}
function msg(id,text,ok=true){let e=$(id);e.textContent=text;e.className="message "+(ok?"ok":"bad")}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab,.panel").forEach(x=>x.classList.remove("active"));b.classList.add("active");$(b.dataset.tab).classList.add("active")});

$("loginBtn").onclick=()=>{tested();let ra=$("ra").value, senha=$("senha").value;
/* BUG INTENCIONAL: validação incorreta permite RA vazio e alfanumérico */
if(senha.length>=1) msg("loginMsg","Acesso autorizado. Bem-vindo!",true); else msg("loginMsg","Senha obrigatória.",false)};

$("cadastroBtn").onclick=()=>{tested();let nome=$("nome").value,email=$("email").value,idade=Number($("idade").value),cpf=$("cpf").value;
/* BUGS INTENCIONAIS: e-mail quase não é validado; menor de idade passa; CPF não é checado */
if(nome && email.includes("@") && idade>=15) msg("cadastroMsg","Cliente cadastrado com sucesso!",true);
else msg("cadastroMsg","Verifique os dados informados.",false)};

document.querySelectorAll(".add").forEach(b=>b.onclick=()=>{tested();cart.push({name:b.dataset.name,price:Number(b.dataset.price),qty:1});renderCart()});
function renderCart(){let box=$("cart");box.innerHTML="";cart.forEach((i,n)=>{let row=document.createElement("div");row.className="cartRow";row.innerHTML=`<span>${i.name} — R$ ${i.price.toFixed(2).replace(".",",")}</span><input type="number" value="${i.qty}" data-i="${n}"><button data-r="${n}">Remover</button>`;box.appendChild(row)});
box.querySelectorAll("input").forEach(inp=>inp.onchange=()=>{tested();cart[+inp.dataset.i].qty=Number(inp.value);renderCart()});
box.querySelectorAll("button").forEach(btn=>btn.onclick=()=>{tested();cart.splice(+btn.dataset.r,1);renderCart()});
/* BUG INTENCIONAL: total ignora quantidade e acrescenta R$ 5 por item */
let total=cart.reduce((s,i)=>s+i.price+5,0)*(1-discount);$("total").textContent="R$ "+total.toFixed(2).replace(".",",")}

$("cupomBtn").onclick=()=>{tested();
/* BUG INTENCIONAL: QA10 deveria dar 10%, mas concede 100% */
if($("cupom").value.toUpperCase()==="QA10"){discount=1;msg("checkoutMsg","Cupom aplicado!",true)}else{discount=0;msg("checkoutMsg","Cupom inválido.",false)}renderCart()};

$("finalizarBtn").onclick=()=>{tested();let q=Number($("qtdPedido").value);
/* BUG INTENCIONAL: permite quantidade zero/negativa e pedido sem carrinho */
if(q<=0) msg("checkoutMsg","Pedido finalizado com sucesso! Nº "+Math.floor(Math.random()*9000+1000),true);
else msg("checkoutMsg","Pedido finalizado com sucesso! Nº "+Math.floor(Math.random()*9000+1000),true)};

$("addCaseBtn").onclick=()=>{let c={id:$("ctId").value||"SEM-ID",cenario:$("ctCenario").value,dados:$("ctDados").value,esperado:$("ctEsperado").value,obtido:$("ctObtido").value,status:$("ctStatus").value};cases.push(c);renderCases()};
function renderCases(){$("cases").innerHTML=cases.map(c=>`<tr><td>${c.id}</td><td>${c.cenario}</td><td>${c.dados}</td><td>${c.esperado}</td><td>${c.obtido}</td><td>${c.status==="Aprovado"?"✅":"❌"} ${c.status}</td></tr>`).join("");let p=cases.filter(c=>c.status==="Aprovado").length,f=cases.length-p;$("kTotal").textContent=cases.length;$("kPass").textContent=p;$("kFail").textContent=f;$("kRate").textContent=cases.length?Math.round(p/cases.length*100)+"%":"0%"}

$("resetBtn").onclick=()=>{localStorage.clear();location.reload()};