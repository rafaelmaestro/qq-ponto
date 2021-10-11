

const zeroFill = n => {
    return ('0' + n).slice(-2);
}

// Cria intervalo
const interval = setInterval(() => {
    // Pega o horário atual
    const now = new Date();

    // Formata a data conforme dd/mm/aaaa hh:ii:ss
    const dataHora = zeroFill(now.getUTCDate()) + '/' + zeroFill((now.getMonth() + 1)) + '/' + now.getFullYear() + ' ' + zeroFill(now.getHours()) + ':' + zeroFill(now.getMinutes()) + ':' + zeroFill(now.getSeconds());

    // Exibe na tela usando a div#data-hora
    document.getElementById('data-hora').innerHTML = dataHora;
}, 1000);

/*---------------------------------------------------------------------------------------------------------*/
// função de retirar acesso 



/*-----------------------------------------------------------------------------------------------------------*/


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

