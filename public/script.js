let loggedIn = localStorage.getItem("hex_login") === "yes";

window.onload = () => {
  if (loggedIn) {
    document.getElementById("loginScreen").classList.remove("active");
    document.getElementById("homeScreen").classList.add("active");
    document.getElementById("taskbar").classList.remove("hidden");
    setRawLink();
  }
};

function setRawLink(){
  document.getElementById("rawLink").innerText = location.origin + "/raw/config.json";
}

async function login(){
  const password = document.getElementById("password").value;
  const msg = document.getElementById("loginMsg");
  msg.innerText = "Checking...";

  const res = await fetch("/api/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({password})
  });

  if(res.ok){
    localStorage.setItem("hex_login","yes");
    document.getElementById("loginScreen").classList.remove("active");
    document.getElementById("homeScreen").classList.add("active");
    document.getElementById("taskbar").classList.remove("hidden");
    setRawLink();
  }else{
    msg.innerText = "Wrong password";
  }
}

function showTab(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelectorAll(".nav").forEach(n=>n.classList.remove("active"));
  event.currentTarget.classList.add("active");
  setRawLink();
}

async function updateConfig(){
  const msg = document.getElementById("updateMsg");
  msg.innerText = "Updating...";

  const res = await fetch("/api/update",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      version:document.getElementById("version").value,
      notes:document.getElementById("notes").value,
      config:document.getElementById("configBox").value
    })
  });

  const data = await res.json();
  msg.innerText = data.success ? "Updated successfully" : "Update failed";
}

function copyRaw(){
  navigator.clipboard.writeText(location.origin + "/raw/config.json");
  alert("Raw link copied");
}
