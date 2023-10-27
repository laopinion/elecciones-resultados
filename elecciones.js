function number_format(amount, decimals) {
  amount += '' // por si pasan un numero en vez de un string
  amount = parseFloat(amount.replace(/[^0-9\.]/g, '')) // elimino cualquier cosa que no sea numero o punto

  decimals = decimals || 0 // por si la variable no fue fue pasada

  // si no es un numero o es igual a cero retorno el mismo cero
  if (isNaN(amount) || amount === 0) return parseFloat(0).toFixed(decimals)

  // si es mayor o menor que cero retorno el valor formateado como numero
  amount = '' + amount.toFixed(decimals)

  var amount_parts = amount.split('.'),
    regexp = /(\d+)(\d{3})/

  while (regexp.test(amount_parts[0])) amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2')

  return amount_parts.join('.')
}

function clearZero(string) {
  // const numberValor = parseInt(string)
  // const position = string.indexOf(numberValor)
  // return string.substring(position)

  string = string.replaceAll(',', '.')
  let newString = ''

  if (string.startsWith('00')) {
    // console.log('0' +newString)
    newString = string.slice(2)
  } else if (string.startsWith('0')) {
    newString = string.slice(1)
  }

  return newString
}

function capitalizarPrimeraLetra(str) {
  if (str && str.length > 0) {
    str = str.toLowerCase() // minuscula
    str = str.split(' ')
    str = str.map(text => text.charAt(0).toUpperCase() + text.slice(1)).join(' ')
    return str
  }

  return str
}

const URL_API = 'https://elecciones.laopinion.com.co/api/data' // https://elecciones.laopinion.com.co/api/data

function candidatosMunicipios(candidatos, resultCandidatoInfo, codMunicipio) {
  // console.log({ resultCandidatoInfo })
  // console.log({ candidatos })
  const divCandidato = candidatos.map(candidato => {
    const infoCandidato = resultCandidatoInfo.filter(data => {
      if (candidato.Candidato.V === data.cod_candidato && data.cod_municipio === codMunicipio) {
        return data
      }
    })
    // console.log(infoCandidato)
    // if (infoCandidato.length > 0 && infoCandidato[0].cod_candidato !== '007') {
    if (infoCandidato.length > 0) {
      const { nombre_candidato, apellido_candidato } = infoCandidato[0]

      const names = `${capitalizarPrimeraLetra(nombre_candidato)} ${capitalizarPrimeraLetra(apellido_candidato)} `

      const porc = clearZero(candidato.Porc.V)
      // let porcCandidato = parseInt(porc)
      // porcCandidato = Math.round(porcCandidato)

      return `<li>
              <span class="candidato">(${candidato.Candidato.V}) ${names}</span>
              <span class="cant_votos">${number_format(candidato.Votos.V)} (${porc}%)</span>
            </li>
                  `
    }
  })

  return divCandidato
}

function candidatosPartidos(candidatos, resultCandidatosInfo) {
  // console.log({ resultCandidatosInfo })
  // console.log({ candidatos })
  const divCandidato = candidatos.map(candidato => {
    const infoCandidato = resultCandidatosInfo.filter(data => {
      if (candidato.Candidato.V === data.cod_candidato && candidato.Partido.V === data.cod_partido) {
        return data
      }
    })
    // console.log({ infoCandidato })
    // if (infoCandidato.length > 0 && infoCandidato[0].cod_candidato !== '007') {
    if (infoCandidato.length > 0) {
      const { nombre_candidato, apellido_candidato } = infoCandidato[0]

      const names = `${capitalizarPrimeraLetra(nombre_candidato)} ${capitalizarPrimeraLetra(apellido_candidato)} `

      const porc = clearZero(candidato.Porc.V)
      // let porcCandidato = parseInt(porc)
      // porcCandidato = Math.round(porcCandidato)

      return `<li>
              <span class="candidato">(${candidato.Candidato.V}) ${names}</span>
              <span class="cant_votos">${number_format(candidato.Votos.V)} (${porc}%)</span>
            </li>
            `
    }
  })

  return divCandidato
}

function listCandidatosInfo() {
  return fetch(`${URL_API}/candidatos-municipios`)
    .then(response => {
      return response.json()
    })
    .then(result => {
      return result.data
    })
    .catch(err => {
      console.log(err)
    }) // FIn fetch candidatos
}

function listPartidosConcejoInfo() {
  return fetch(`${URL_API}/partidos-concejo`)
    .then(response => {
      return response.json()
    })
    .then(result => {
      return result.data
    })
    .catch(err => {
      console.log(err)
    }) // FIn fetch candidatos
}

function listPartidosAsambleaInfo() {
  return fetch(`${URL_API}/partidos-asamblea`)
    .then(response => {
      return response.json()
    })
    .then(result => {
      return result.data
    })
    .catch(err => {
      console.log(err)
    }) // FIn fetch candidatos
}

function listCandidatosInfoConcejo() {
  return fetch(`${URL_API}/candidatos-concejo`)
    .then(response => {
      return response.json()
    })
    .then(result => {
      return result.data
    })
    .catch(err => {
      console.log(err)
    })
}

function listCandidatosInfoAsamblea() {
  return fetch(`${URL_API}/candidatos-asamblea`)
    .then(response => {
      return response.json()
    })
    .then(result => {
      return result.data
    })
    .catch(err => {
      console.log(err)
    })
}

function getVotosGlobales({ result }) {
  // console.log({ result })
  const elHeader = '#elecciones_results .elecciones_header'
  $(elHeader).find('.elecciones_num_boletin .num_boletin').html(`<strong>Boletín N°</strong> ${result.data.Numero.V}`)
  $(elHeader)
    .find('.elecciones_num_boletin .hora_boletin')
    .html(`<strong>Hora:</strong> ${result.data.Hora.V}:${result.data.Minuto.V} p.m.`)

  const porc = clearZero(result.data.Porc_Mesas_Informadas.V)
  // let porcMesas = parseInt(porc)
  // porcMesas = Math.round(porcMesas)

  const elFooter = '.elecciones_footer'

  $(elFooter).find('.elecciones_mesas .cant_m_informadas span').text(number_format(result.data.Mesas_Informadas.V, 0))
  $(elFooter).find('.elecciones_mesas .total_m span').text(number_format(result.data.Mesas_Instaladas.V, 0))
  $(elFooter)
    .find('.elecciones_mesas .porcentaje_m span')
    .text(porc + '%')

  const totales = result.data.Detalle_Circunscripcion.lin.Detalle_Partidos_Totales.lin[2]

  $(elFooter)
    .find('.elecciones_mesas .porcentaje_votos span')
    .text(clearZero(totales.Porc.V) + '%')

  $(elFooter).find('.total_v_title .total_v').text(number_format(totales.Votos.V))
  $(elFooter).find('.votos_n_title .votos_n').text(number_format(result.data.Votos_Nulos.V))
  $(elFooter).find('.votos_nm_title .votos_nm').text(number_format(result.data.Votos_No_Marcados.V))
}

function getVotosAlcalde() {
  fetch(`${URL_API}/alcalde`)
    .then(response => {
      return response.json()
    })
    .then(result => {
      console.log(result)
      getVotosGlobales({ result })

      let candidatos = result.data.Detalle_Circunscripcion.lin.Detalle_Candidato.lin

      // console.log(candidatos)
      const newCandidatos = candidatos.sort((a, b) => b.Votos.V - a.Votos.V)
      fetch(`${URL_API}/candidatos-alcalde`)
        .then(response => {
          return response.json()
        })
        .then(dataCandidatos => {
          $('.elecciones_body_alcalde .left .elecciones_body_alcalde_result').empty()
          $('.elecciones_body_alcalde .right .elecciones_body_alcalde_result').empty()
          // console.log({ dataCandidatos })
          newCandidatos.forEach((candidato, index) => {
            const infoCandidato = dataCandidatos.data.filter(data => {
              // console.log(data.cod_candidato)
              // console.log(candidato.Candidato.V)
              if (data.cod_candidato === candidato.Candidato.V) {
                return data
              }
            })
            // console.log(infoCandidato)
            // if (infoCandidato.length > 0 && infoCandidato[0].cod_candidato !== '007') {
            if (infoCandidato.length > 0) {
              const { nombre_candidato, apellido_candidato } = infoCandidato[0] ?? ['', '']
              // console.log(infoCandidato[0])

              // const firstName = nombre_candidato.split(' ')[0]
              // const firstLastname = apellido_candidato.split(' ')[0]
              // console.log({ firstLastname })

              const names = `${capitalizarPrimeraLetra(nombre_candidato)} ${capitalizarPrimeraLetra(
                apellido_candidato || ''
              )}`

              // console.log({ names })
              const porc = clearZero(candidato.Porc.V)
              let porcCandidato = parseInt(porc)
              porcCandidato = Math.round(porcCandidato)

              const elCandidatoResult = `
                <li>
                  <div class="info">
                    <div class="candidato">
                      <span class="foto_candidato candidato_${candidato.Candidato.V}"></span>
                      <span class="name_candidato">${names}</span>
                    </div>
                    <div class="cant_votos">
                      <span>${number_format(candidato.Votos.V)}</span>
                      <progress id="file" max="100" value="${porcCandidato}">${porcCandidato}</progress>
                    </div>
                  </div>
                  <span class="porce_votos">${porcCandidato}%</span>
                </li>
              `
              if (index <= 6) {
                $('.elecciones_body_alcalde .left .elecciones_body_alcalde_result').append(elCandidatoResult)
              } else {
                $('.elecciones_body_alcalde .right .elecciones_body_alcalde_result').append(elCandidatoResult)
              }
            }
          })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

getVotosAlcalde()

function handleChangeAlcaldeMunicipios(event) {
  const idMunicipio = event.value
  getVotosGobernador({ idMunicipio })
}

function getVotosGobernador({ idMunicipio = '000' }) {
  fetch(`${URL_API}/gobernador/${idMunicipio}`)
    .then(response => {
      return response.json()
    })
    .then(result => {
      console.log(result)
      getVotosGlobales({ result })

      let candidatos = result.data.Detalle_Circunscripcion.lin.Detalle_Candidato.lin

      // console.log(candidatos)
      const newCandidatos = candidatos.sort((a, b) => b.Votos.V - a.Votos.V)
      fetch(`${URL_API}/candidatos-gobernador`)
        .then(response => {
          return response.json()
        })
        .then(dataCandidatos => {
          $('.elecciones_body_gobernador .elecciones_body_gobernador_result .candidatos').empty()
          // console.log({ dataCandidatos })
          newCandidatos.forEach(candidato => {
            const infoCandidato = dataCandidatos.data.filter(data => {
              // console.log(data.cod_candidato)
              // console.log(candidato.Candidato.V)
              if (data.cod_candidato === candidato.Candidato.V) {
                return data
              }
            })
            // console.log(infoCandidato)
            // if (infoCandidato.length > 0 && infoCandidato[0].cod_candidato !== '007') {
            if (infoCandidato.length > 0) {
              const { nombre_candidato, apellido_candidato } = infoCandidato[0]
              // console.log(infoCandidato[0])

              const names = `${capitalizarPrimeraLetra(nombre_candidato)} ${capitalizarPrimeraLetra(
                apellido_candidato || ''
              )}`

              // console.log({ names })
              const porc = clearZero(candidato.Porc.V)
              let porcCandidato = parseInt(porc)
              porcCandidato = Math.round(porcCandidato)

              const elCandidatoResult = `
                <li>
                <div class="barra">
                  <div class="progress-bar-vertical porcet_v">
                    <div class="bar" style="height: ${porcCandidato}%"><span>${porcCandidato}%</span></div>
                  </div>
                  <span class="cant_votos">${number_format(candidato.Votos.V)}</span>
                </div>
                <div class="info_candidato">
                  <div class="foto candidato_${candidato.Candidato.V}"></div>
                  <div class="name_candidato">${names}</div>
                </div>
              </li>
              `
              $('.elecciones_body_gobernador .elecciones_body_gobernador_result .candidatos').append(elCandidatoResult)
            }
          })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

function getVotosMunicipios() {
  fetch(`${URL_API}/municipios`)
    .then(response => {
      return response.json()
    })
    .then(result => {
      // console.log({ result })
      const votosGlobales = result.data.filter(
        data => data.Municipio.V === '000' && data.Desc_Municipio.V === 'NO APLICA'
      )
      getVotosGlobales({ result: { data: votosGlobales[0] } })

      let municipiosList = result.data
        .filter(data => data.Municipio.V !== '000')
        .sort(
          (a, b) =>
            b.Detalle_Circunscripcion.lin.Detalle_Partidos_Totales.lin[2].Votos.V -
            a.Detalle_Circunscripcion.lin.Detalle_Partidos_Totales.lin[2].Votos.V
        )

      listCandidatosInfo()
        .then(resultCandidatoInfo => {
          $('.elecciones_body_municipios .elecciones_body_municipios_result').empty()

          municipiosList.forEach(data => {
            // console.log({ data })
            const votos = data.Detalle_Circunscripcion.lin.Detalle_Partidos_Totales.lin[2].Votos.V
            const porc = clearZero(data.Detalle_Circunscripcion.lin.Detalle_Partidos_Totales.lin[2].Porc.V)

            const candidatos = data.Detalle_Circunscripcion.lin.Detalle_Candidato.lin.sort(
              (a, b) => b.Votos.V - a.Votos.V
            )

            // console.log({ municipio: data.Municipio.V })
            // console.log({ resultCandidatoInfo })
            const codMunicipio = data.Municipio.V

            // const listCandidatosMunicipioInfo = resultCandidatoInfo.filter(
            //   candidato => candidato.cod_municipio === data.Municipio.V
            // )

            // const divCandidato = candidatosPresidenciales(candidatos, resultCandidatoInfo)
            const liCandidatos = candidatosMunicipios(candidatos, resultCandidatoInfo, codMunicipio)

            // console.log(liCandidatos)

            const liMunicipio = `<li class='item_municipio'>
                <div class="name_municipio">
                    <div
                      class="btn_flecha"
                      onclick="handleClickCandidatos(this)"
                      data-municipio="municipio_${data.Municipio.V}"
                    ></div>
                    <span class="municipio">${capitalizarPrimeraLetra(data.Desc_Municipio.V)}</span>
                  </div>
                  <span class="cant_votos">${number_format(votos)}</span>
                  <div class="porcet_v">
                    <progress id="file" max="100" value="${porc}">${porc}</progress>
                  </div>
                  <span>${porc}%</span>
              </li>
              
              <ul class="list_candidatos municipio_${data.Municipio.V} hidden">
                ${liCandidatos.map(candidato => candidato).join('')}
              </ul>
            `
            $('.elecciones_body_municipios .elecciones_body_municipios_result').append(liMunicipio)
          })
        })
        .catch(err => {
          console.log(err)
        })
    })
    .catch(err => console.log(err))
}

function getVotosConcejo() {
  fetch(`${URL_API}/concejo`)
    .then(response => {
      return response.json()
    })
    .then(result => {
      // console.log({ result })
      // const votosGlobales = result.data.filter(
      //   data => data.Municipio.V === '000' && data.Desc_Municipio.V === 'NO APLICA'
      // )
      getVotosGlobales({ result })

      let partidosList = result.data.Detalle_Circunscripcion.lin.Detalle_Partido.lin.sort(
        (a, b) => b.Votos.V - a.Votos.V
      )

      const candidatos = result.data.Detalle_Circunscripcion.lin.Detalle_Candidato.lin.sort(
        (a, b) => b.Votos.V - a.Votos.V
      )

      listPartidosConcejoInfo()
        .then(resultPartidosInfo => {
          $('.elecciones_body_concejo .elecciones_body_concejo_result').empty()

          // console.log({ resultPartidosInfo })
          listCandidatosInfoConcejo()
            .then(candidatosConcejo => {
              partidosList.forEach(data => {
                const votos = data.Votos.V
                const porc = clearZero(data.Porc.V)
                // console.log({ candidatos })

                const partidoInfo = resultPartidosInfo.filter(partidoInfo => partidoInfo.codigo === data.Partido.V)[0]
                const listCandidatosPartido = candidatos.filter(candidato => candidato.Partido.V === data.Partido.V)

                const liCandidatos = candidatosPartidos(listCandidatosPartido, candidatosConcejo)

                // console.log(liCandidatos)

                const liPartido = `
                  <li class="item_partido">
                    <div class="info_partido">
                      <div class="btn_flecha" onclick="handleClickCandidatosPartidos(this)" data-partido="partido_${
                        partidoInfo?.codigo
                      }"></div>
                      <div class="logo partido_${partidoInfo?.codigo}"></div>
                      <span class="partido">${capitalizarPrimeraLetra(partidoInfo?.nombre)}</span>
                    </div>
                    <span class="cant_votos">${number_format(votos)}</span>
                    <div class="porcet_v">
                      <progress id="file" max="100" value="${porc}">${porc}</progress>
                    </div>
                    <span class="porcentaje">${porc}%</span>
                  </li>
    
                  <ul class="list_candidatos partido_${partidoInfo?.codigo} hidden">
                    ${liCandidatos.map(candidato => candidato).join('')}
                  </ul>
                `
                $('.elecciones_body_concejo .elecciones_body_concejo_result').append(liPartido)
              })
            })
            .catch(err => console.log(err))
        })
        .catch(err => {
          console.log(err)
        })
    })
    .catch(err => console.log(err))
}

function getVotosAsamblea() {
  fetch(`${URL_API}/asamblea`)
    .then(response => {
      return response.json()
    })
    .then(result => {
      // console.log({ result })
      // const votosGlobales = result.data.filter(
      //   data => data.Municipio.V === '000' && data.Desc_Municipio.V === 'NO APLICA'
      // )
      getVotosGlobales({ result })

      let partidosList = result.data.Detalle_Circunscripcion.lin.Detalle_Partido.lin.sort(
        (a, b) => b.Votos.V - a.Votos.V
      )

      const candidatos = result.data.Detalle_Circunscripcion.lin.Detalle_Candidato.lin.sort(
        (a, b) => b.Votos.V - a.Votos.V
      )

      listPartidosAsambleaInfo()
        .then(resultPartidosInfo => {
          $('.elecciones_body_asamblea .elecciones_body_asamblea_result').empty()

          // console.log({ resultPartidosInfo })
          listCandidatosInfoAsamblea()
            .then(candidatosAsamblea => {
              partidosList.forEach(data => {
                const votos = data.Votos.V
                const porc = clearZero(data.Porc.V)
                // console.log({ candidatos })

                const partidoInfo = resultPartidosInfo.filter(partidoInfo => partidoInfo.codigo === data.Partido.V)[0]
                const listCandidatosPartido = candidatos.filter(candidato => candidato.Partido.V === data.Partido.V)

                const liCandidatos = candidatosPartidos(listCandidatosPartido, candidatosAsamblea)
                // console.log(liCandidatos)

                const liPartido = `
                  <li class="item_partido">
                    <div class="info_partido">
                      <div class="btn_flecha" onclick="handleClickCandidatosPartidos(this)" data-partido="partido_${
                        partidoInfo?.codigo
                      }"></div>
                      <div class="logo partido_${partidoInfo?.codigo}"></div>
                      <span class="partido">${capitalizarPrimeraLetra(partidoInfo?.nombre)}</span>
                    </div>
                    <span class="cant_votos">${number_format(votos)}</span>
                    <div class="porcet_v">
                      <progress id="file" max="100" value="${porc}">${porc}</progress>
                    </div>
                    <span class="porcentaje">${porc}%</span>
                  </li>
    
                  <ul class="list_candidatos partido_${partidoInfo?.codigo} hidden">
                    ${liCandidatos.map(candidato => candidato).join('')}
                  </ul>
                `
                $('.elecciones_body_asamblea .elecciones_body_asamblea_result').append(liPartido)
              })
            })
            .catch(err => console.log(err))
        })
        .catch(err => {
          console.log(err)
        })
    })
    .catch(err => console.log(err))
}

$('#elecciones_results .elecciones_menu li').click(function (e) {
  // console.log($(this).data('corporacion'))
  $(this).addClass('active')
  $(this).siblings().removeClass('active')
  const corporacion = $(this).data('corporacion')
  console.log({ corporacion })
  if (corporacion === 'alcalde') {
    $('#elecciones_results .elecciones_body_gobernador').hide()
    $('#elecciones_results .elecciones_body_municipios').hide()
    $('#elecciones_results .elecciones_body_concejo').hide()
    $('#elecciones_results .elecciones_body_asamblea').hide()
    $('#elecciones_results .elecciones_body_alcalde').show()

    getVotosAlcalde()
  } else if (corporacion === 'gobernador') {
    $('#elecciones_results .elecciones_body_alcalde').hide()
    $('#elecciones_results .elecciones_body_municipios').hide()
    $('#elecciones_results .elecciones_body_concejo').hide()
    $('#elecciones_results .elecciones_body_asamblea').hide()
    $('#elecciones_results .elecciones_body_gobernador').show()

    document.querySelector('#elecciones_results .elecciones_body_gobernador .select_municipios select').value = '000'
    getVotosGobernador({ idMunicipio: '000' })
  } else if (corporacion === 'municipios') {
    $('#elecciones_results .elecciones_body_alcalde').hide()
    $('#elecciones_results .elecciones_body_gobernador').hide()
    $('#elecciones_results .elecciones_body_concejo').hide()
    $('#elecciones_results .elecciones_body_asamblea').hide()
    $('#elecciones_results .elecciones_body_municipios').show()

    getVotosMunicipios()
  } else if (corporacion === 'concejo') {
    $('#elecciones_results .elecciones_body_alcalde').hide()
    $('#elecciones_results .elecciones_body_gobernador').hide()
    $('#elecciones_results .elecciones_body_municipios').hide()
    $('#elecciones_results .elecciones_body_asamblea').hide()
    $('#elecciones_results .elecciones_body_concejo').show()

    getVotosConcejo()
  } else if (corporacion === 'asamblea') {
    $('#elecciones_results .elecciones_body_alcalde').hide()
    $('#elecciones_results .elecciones_body_gobernador').hide()
    $('#elecciones_results .elecciones_body_municipios').hide()
    $('#elecciones_results .elecciones_body_concejo').hide()
    $('#elecciones_results .elecciones_body_asamblea').show()

    getVotosAsamblea()
  }
})

function handleClickCandidatos(e) {
  // console.log($(e).data('municipio'))
  const municipio = $(e).data('municipio')
  const resultMunicipios = $(e).parent().parent().parent()

  if ($(e).hasClass('activeList')) {
    $(e).removeClass('activeList')
  } else {
    $(e).addClass('activeList')
  }

  resultMunicipios.find(`.list_candidatos.${municipio}`).toggle()
}

function handleClickCandidatosPartidos(e) {
  // console.log($(e).data('partido'))
  const partido = $(e).data('partido')
  const resultCandidatos = $(e).parent().parent().parent()
  if ($(e).hasClass('activeList')) {
    $(e).removeClass('activeList')
  } else {
    $(e).addClass('activeList')
  }

  resultCandidatos.find(`.list_candidatos.${partido}`).toggle()
}
