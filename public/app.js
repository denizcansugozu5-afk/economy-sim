async function refresh() {
  let res = await fetch("/state");
  let data = await res.json();
 
  document.getElementById("stats").innerHTML = `
    Para: ${data.money} <br>
    Banka: ${data.bank} <br>
    Seviye: ${data.level} <br>
    XP: ${data.xp} <br>
    Çalışan: ${data.employees} <br>
    Moral: ${data.morale}
  `;
}
 
async function openBusiness(type) {
  await fetch("/open", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type })
  });
  refresh();
}
 
async function produce() {
  await fetch("/produce", { method: "POST" });
  refresh();
}
 
async function sell() {
  let price = document.getElementById("priceInput").value;
 
  let res = await fetch("/sell", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ price: Number(price) })
  });
 
  let data = await res.json();
 
  if (data.error) {
    document.getElementById("msg").innerText = data.error;
  } else {
    document.getElementById("msg").innerText = "";
  }
 
  refresh();
}
 
async function deposit() {
  let amount = document.getElementById("depositInput").value;
 
  await fetch("/deposit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: Number(amount) })
  });
 
  refresh();
}
 
refresh();
