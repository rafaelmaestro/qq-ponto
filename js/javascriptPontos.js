async function tela() {
    const response = await fetch('/dados')
    const data = await response.json()
    console.log(data)
  
    const container = document.getElementById('cadastro')
    const container2 = document.getElementById('acesso')
    const container3 = document.getElementById('senha')
    console.log(container3)
    for (const u of data[0]) {
      if (u.isadm == false) {
        container.style.display = "none"
        container2.style.display = "none"
        container3.style["left"] = "685px"
  
      } else {
        container3.style["left"] = "399px"
      }
    }
  }
  tela()





