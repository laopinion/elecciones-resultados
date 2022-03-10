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

  while (regexp.test(amount_parts[0]))
    amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2')

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
  str = str.toLowerCase() // minuscula
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function senadoData() {
  fetch('https://elecciones.laopinion.com.co/api/data/senado-nacional')
    .then((response) => {
      return response.json()
    })
    .then((result) => {
      console.log(result)
      const titleResult =
        '#elecciones_results .elecciones_header .elecciones_title_result'
      $(titleResult)
        .find('.elecciones_num_boletin .num_boletin')
        .text(`Boletín N° ${result.data.Numero.V}`)
      $(titleResult)
        .find('.elecciones_num_boletin .hora_boletin')
        .text(`Hora: ${result.data.Hora.V}:${result.data.Minuto.V} p.m.`)
      $(titleResult)
        .find('.elecciones_mesas .cant_m_informadas span')
        .text(number_format(result.data.Mesas_Informadas.V, 0))
      $(titleResult)
        .find('.elecciones_mesas .total_m span')
        .text(number_format(result.data.Mesas_Instaladas.V, 0))

      const porc = clearZero(result.data.Porc_Mesas_Informadas.V)
      // let porcMesas = parseInt(porc)
      // porcMesas = Math.round(porcMesas)
      $(titleResult)
        .find('.elecciones_mesas .porcentaje_m span')
        .text(porc + '%')

      const footerResult = '.elecciones_footer'
      $(footerResult)
        .find('.total_v_title .total_v')
        .text(
          number_format(
            result.data.Detalle_Circunscripcion.lin[0].Detalle_Partidos_Totales
              .lin[2].Votos.V
          )
        )
      $(footerResult)
        .find('.votos_n_title .votos_n')
        .text(number_format(result.data.Votos_Nulos.V))
      $(footerResult)
        .find('.votos_nm_title .votos_nm')
        .text(number_format(result.data.Votos_No_Marcados.V))

      const candidatos =
        result.data.Detalle_Circunscripcion.lin[0].Detalle_Candidato.lin

      fetch('https://elecciones.laopinion.com.co/api/data/candidatos-senado')
        .then((response) => {
          return response.json()
        })
        .then((result) => {
          // console.log(result.data)
          $('.elecciones_body_senado .eleeciones_r_senado_cantidatos').empty()
          // console.log(candidatos.length)
          candidatos.forEach((candidato) => {
            const infoCandidato = result.data.filter((data) => {
              // console.log(id.id_candidato)
              if (
                data.id_candidato === candidato.Candidato.V &&
                data.id_partido === candidato.Partido.V
              ) {
                return data
              }
            })
            // console.log(infoCandidato)
            if (infoCandidato.length > 0) {
              const { primer_apellido, primer_nombre, segundo_nombre } =
                infoCandidato[0]

              const names = `${capitalizarPrimeraLetra(
                primer_nombre
              )} ${capitalizarPrimeraLetra(
                segundo_nombre
              )} ${capitalizarPrimeraLetra(primer_apellido)}`

              const divCandidato = `<li>
                  <span class="candidato">${names}</span>
                  <span class="cant_votos">${number_format(
                    candidato.Votos.V
                  )}</span>
                </li>
              `
              $(
                '.elecciones_body_senado .eleeciones_r_senado_cantidatos'
              ).append(divCandidato)
            }
          })
        })
        .catch((err) => {
          console.log(err)
        }) // FIn fetch candidatos

      const partidos =
        result.data.Detalle_Circunscripcion.lin[0].Detalle_Partido.lin
      fetch('https://elecciones.laopinion.com.co/api/data/partidos-senado')
        .then((response) => {
          return response.json()
        })
        .then((result) => {
          // console.log(result.data)
          $('.elecciones_body_senado .elecciones_r_senado_partidos').empty()
          console.log(partidos.length)
          partidos.forEach((partido) => {
            const infoPartido = result.data.filter((data) => {
              // console.log(id.id_candidato)
              if (data.id_partido === partido.Partido.V) {
                return data
              }
            })
            // console.log(infoPartido)
            if (infoPartido.length > 0) {
              const { nombre, id_partido } = infoPartido[0]
              const names = capitalizarPrimeraLetra(nombre)
              const porc = clearZero(partido.Porc.V)
              // let porcPartidoReal = parseInt(porc)
              // const porcPartidoRedondeado = Math.round(porcPartidoReal)
              // console.log(partido.Curules.V.trim().length)
              if (partido.Curules.V.trim().length > 0) {
                $(
                  '.elecciones_body_senado .elecciones_partidos_title .posib_curules'
                ).show()
              }
              const divPartido = `<li>
                  <span class="logo_partido partido_${id_partido}">logo_partido</span>
                  <span class="partido">${names}</span>
                  <span class="cant_votos">${number_format(
                    partido.Votos.V
                  )}</span>
                  <span class="porcet_v"
                    ><progress id="file" max="100" value="${porc}">${porc}</progress></span
                  >
                  ${
                    partido.Curules.V.trim().length > 0
                      ? `<span class="posib_curules">${partido.Curules.V}</span>`
                      : ''
                  }
                </li>
              `
              $('.elecciones_body_senado .elecciones_r_senado_partidos').append(
                divPartido
              )
            }
          })
        })
        .catch((err) => {
          console.log(err)
        })
    })
    .catch((err) => {
      console.log(err)
    }) // Fin senado nacional
}

senadoData()

function camaraData() {
  fetch('https://elecciones.laopinion.com.co/api/data/camara-departamental')
    .then((response) => {
      return response.json()
    })
    .then((result) => {
      console.log(result)
      const titleResult =
        '#elecciones_results .elecciones_header .elecciones_title_result'
      $(titleResult)
        .find('.elecciones_num_boletin .num_boletin')
        .text(`Boletín N° ${result.data.Numero.V}`)
      $(titleResult)
        .find('.elecciones_num_boletin .hora_boletin')
        .text(`Hora: ${result.data.Hora.V}:${result.data.Minuto.V} p.m.`)
      $(titleResult)
        .find('.elecciones_mesas .cant_m_informadas span')
        .text(number_format(result.data.Mesas_Informadas.V, 0))
      $(titleResult)
        .find('.elecciones_mesas .total_m span')
        .text(number_format(result.data.Mesas_Instaladas.V, 0))

      const porc = clearZero(result.data.Porc_Mesas_Informadas.V)
      // let porcMesas = parseInt(porc)
      // porcMesas = Math.round(porcMesas)
      $(titleResult)
        .find('.elecciones_mesas .porcentaje_m span')
        .text(porc + '%')

      const footerResult = '.elecciones_footer'
      $(footerResult)
        .find('.total_v_title .total_v')
        .text(
          number_format(
            result.data.Detalle_Circunscripcion.lin[0].Detalle_Partidos_Totales
              .lin[2].Votos.V
          )
        )
      $(footerResult)
        .find('.votos_n_title .votos_n')
        .text(number_format(result.data.Votos_Nulos.V))
      $(footerResult)
        .find('.votos_nm_title .votos_nm')
        .text(number_format(result.data.Votos_No_Marcados.V))

      const candidatos =
        result.data.Detalle_Circunscripcion.lin[0].Detalle_Candidato.lin

      const partidos =
        result.data.Detalle_Circunscripcion.lin[0].Detalle_Partido.lin
      fetch('https://elecciones.laopinion.com.co/api/data/partidos-camara')
        .then((response) => {
          return response.json()
        })
        .then((result) => {
          // console.log(result.data)
          $('.elecciones_body_camara .eleeciones_r_camara_partidos').empty()
          // console.log(partidos.length)
          listCandidatosInfo().then((resultCandidatoInfo) => {
            partidos.forEach((partido) => {
              const infoPartido = result.data.filter((data) => {
                // console.log(id.id_candidato)
                if (data.id_partido === partido.Partido.V) {
                  return data
                }
              })
              // console.log(infoPartido)
              if (infoPartido.length > 0) {
                const { nombre } = infoPartido[0]
                const names = capitalizarPrimeraLetra(nombre)
                const porc = clearZero(partido.Porc.V)
                // let porcPartido = parseInt(porc)
                // porcPartido = Math.round(porcPartido)

                const divCandidato = candidatosCamara(
                  candidatos,
                  partido.Partido.V,
                  resultCandidatoInfo
                )

                if (partido.Curules.V.trim().length > 0) {
                  $(
                    '.elecciones_body_camara .elecciones_partidos_title .posib_curules'
                  ).show()
                }

                const divPartido = `<li class="list_partido">
                <div class="elecciones_logos_partidos">
                  <div class="btn_flecha" onclick="handleClickCandidatos(this)" data-partido="partido_${
                    partido.Partido.V
                  }"></div>
                  <span class="logo_partido partido_${
                    partido.Partido.V
                  }">Logo</span>
                  <span class="partido">${names}</span>
                </div>
                <span class="cant_votos">${number_format(
                  partido.Votos.V
                )}</span>
                <span class="porcet_v"
                  ><progress id="file" max="100" value="${porc}">${porc}</progress></span
                >
                ${
                  partido.Curules.V.trim().length > 0
                    ? `<span class="posib_curules">${partido.Curules.V}</span>`
                    : ''
                }
              </li>
              <div class="list_candidatos partido_${partido.Partido.V} hidden">
                <ul>
                 ${divCandidato.map((candidato) => candidato).join('')}
                </ul>
              </div>
            `
                $(
                  '.elecciones_body_camara .eleeciones_r_camara_partidos'
                ).append(divPartido)
              }
            })
          })
        })
        .catch((err) => {
          console.log(err)
        })
    })
    .catch((err) => {
      console.log(err)
    }) // Fin camara departamental
}

function candidatosCamara(candidatos, id_partido, resultCandidatoInfo) {
  // console.log(resultCandidatoInfo)
  const divCandidato = candidatos.map((candidato) => {
    const infoCandidato = resultCandidatoInfo.filter((data) => {
      if (
        id_partido === data.id_partido &&
        data.id_candidato === candidato.Candidato.V
      ) {
        return data
      }
    })
    // console.log(infoCandidato)
    if (infoCandidato.length > 0 && candidato.Partido.V === id_partido) {
      const { primer_apellido, primer_nombre, segundo_nombre } =
        infoCandidato[0]

      const names = `${capitalizarPrimeraLetra(
        primer_nombre
      )} ${capitalizarPrimeraLetra(segundo_nombre)} ${capitalizarPrimeraLetra(
        primer_apellido
      )}`

      const porc = clearZero(candidato.Porc.V)
      // let porcCandidato = parseInt(porc)
      // porcCandidato = Math.round(porcCandidato)

      return `<li>
              <span class="candidato">${names}</span>
              <span class="cant_votos">${number_format(
                candidato.Votos.V
              )} (${porc}%)</span>
            </li>
                  `
    }
    // else {
    //   // console.log(candidato.Candidato.V)
    // }
  })

  return divCandidato
}

function listCandidatosInfo() {
  return fetch('https://elecciones.laopinion.com.co/api/data/candidatos-camara')
    .then((response) => {
      return response.json()
    })
    .then((result) => {
      return result.data
    })
    .catch((err) => {
      console.log(err)
    }) // FIn fetch candidatos
}

function consultasData(consulta) {
  fetch(`https://elecciones.laopinion.com.co/api/data/${consulta}`)
    .then((response) => {
      return response.json()
    })
    .then((result) => {
      console.log(result)
      const titleResult =
        '#elecciones_results .elecciones_header .elecciones_title_result'
      $(titleResult)
        .find('.elecciones_num_boletin .num_boletin')
        .text(`Boletín N° ${result.data.Numero.V}`)
      $(titleResult)
        .find('.elecciones_num_boletin .hora_boletin')
        .text(`Hora: ${result.data.Hora.V}:${result.data.Minuto.V} p.m.`)
      $(titleResult)
        .find('.elecciones_mesas .cant_m_informadas span')
        .text(number_format(result.data.Mesas_Informadas.V, 0))
      $(titleResult)
        .find('.elecciones_mesas .total_m span')
        .text(number_format(result.data.Mesas_Instaladas.V, 0))

      const porc = clearZero(result.data.Porc_Mesas_Informadas.V)
      // let porcMesas = parseInt(porc)
      // porcMesas = Math.round(porcMesas)
      $(titleResult)
        .find('.elecciones_mesas .porcentaje_m span')
        .text(porc + '%')

      const footerResult = '.elecciones_footer'
      $(footerResult)
        .find('.total_v_title .total_v')
        .text(
          number_format(
            result.data.Detalle_Circunscripcion.lin.Detalle_Partidos_Totales
              .lin[2].Votos.V
          )
        )
      $(footerResult)
        .find('.votos_n_title .votos_n')
        .text(number_format(result.data.Votos_Nulos.V))
      $(footerResult)
        .find('.votos_nm_title .votos_nm')
        .text(number_format(result.data.Votos_No_Marcados.V))

      const candidatos =
        result.data.Detalle_Circunscripcion.lin.Detalle_Candidato.lin

      // console.log(candidatos)

      fetch(
        `https://elecciones.laopinion.com.co/api/data/candidatos-${consulta}`
      )
        .then((response) => {
          return response.json()
        })
        .then((result) => {
          // console.log(result.data)
          $(
            '.elecciones_body_consultas .elecciones_r_consulta .consulta_barras'
          ).empty()
          $(
            '.elecciones_body_consultas .elecciones_r_consulta .consulta_candidatos'
          ).empty()
          // console.log(candidatos.length)
          candidatos.forEach((candidato) => {
            const infoCandidato = result.data.filter((data) => {
              // console.log(id.id_candidato)
              if (
                data.id_candidato === candidato.Candidato.V &&
                data.id_partido === candidato.Partido.V
              ) {
                return data
              }
            })
            // console.log(infoCandidato)
            if (infoCandidato.length > 0) {
              const { primer_apellido, primer_nombre, segundo_nombre } =
                infoCandidato[0]

              const names = `${capitalizarPrimeraLetra(
                primer_nombre
              )} ${capitalizarPrimeraLetra(
                segundo_nombre
              )} ${capitalizarPrimeraLetra(primer_apellido || '')}`

              const porc = clearZero(candidato.Porc.V)
              let porcCandidato = parseInt(porc)
              porcCandidato = Math.round(porcCandidato)

              const divBarra = `
                  <li>
                  <div class="progress-bar-vertical porcet_v">
                    <div class="bar" style="height: ${porcCandidato}%"><span>${porcCandidato}%</span></div>
                  </div>
                  <span class="cant_votos">${number_format(
                    candidato.Votos.V
                  )}</span>
                </li> 
              `
              $(
                '.elecciones_body_consultas .elecciones_r_consulta .consulta_barras'
              ).append(divBarra)

              // let consulta = 'centro-esperanza'

              const divCandidato = `<li class="candidato">
                  <div class="foto ${consulta} candidato_${candidato.Candidato.V}"></div>
                  <div class="name_candidato">${names}</div>
                </li>
              `
              $(
                '.elecciones_body_consultas .elecciones_r_consulta .consulta_candidatos'
              ).append(divCandidato)
            }
          })
        })
        .catch((err) => {
          console.log(err)
        }) // FIn fetch candidatos
    })
    .catch((err) => {
      console.log(err)
    }) // Fin consultas data
}

$('#elecciones_results .elecciones_menu li').click(function (e) {
  // console.log($(this).data('corporacion'))
  $(this).addClass('active')
  $(this).siblings().removeClass('active')
  const corporacion = $(this).data('corporacion')
  if (corporacion === 'senado') {
    $('#elecciones_results .elecciones_body_senado').show()
    $('#elecciones_results .elecciones_body_camara').hide()
    $('#elecciones_results .elecciones_body_consultas').hide()
    $(
      '#elecciones_results .elecciones_header .elecciones_title_result h2'
    ).text('Resultados Elecciones Nacionales')
    senadoData()
  } else if (corporacion === 'camara') {
    $('#elecciones_results .elecciones_body_camara').show()
    $('#elecciones_results .elecciones_body_senado').hide()
    $('#elecciones_results .elecciones_body_consultas').hide()
    $(
      '#elecciones_results .elecciones_header .elecciones_title_result h2'
    ).text('Resultados Norte de Santander')
    camaraData()
  } else {
    $('#elecciones_results .elecciones_body_consultas').show()
    $('#elecciones_results .elecciones_body_camara').hide()
    $('#elecciones_results .elecciones_body_senado').hide()
    $(
      '#elecciones_results .elecciones_header .elecciones_title_result h2'
    ).text('Resultados Elecciones Nacionales')
    $('.elecciones_body_consultas .consultas li')
      .siblings()
      .removeClass('active')
    $('.elecciones_body_consultas .consultas .consulta_ce').addClass('active')
    consultasData('centro-esperanza')
  }
})

function handleClickCandidatos(e) {
  console.log($(e).data('partido'))
  const partido = $(e).data('partido')
  // $(e).parent().parent().css('height', 'auto')
  const resultCamara = $(e).parent().parent().parent()

  if ($(e).hasClass('activeList')) {
    $(e).removeClass('activeList')
  } else {
    $(e).addClass('activeList')
  }

  resultCamara.find(`.list_candidatos.${partido}`).toggle()
  // const listPartido = $(e).parent().parent()
  // $(e).parent().parent().find('.list_candidatos').toggle('slow')

  console.log('ok')
}

$('.elecciones_body_consultas .consultas li').click(function (e) {
  // console.log($(this).data('consulta'))
  $(this).siblings().removeClass('active')
  $(this).addClass('active')
  let consulta = $(this).data('consulta')
  if (consulta === 'ce') {
    consulta = 'centro-esperanza'
  } else if (consulta === 'ph') {
    consulta = 'pacto-historico'
  } else {
    consulta = 'equipo-colombia'
  }
  consultasData(consulta)
  // $(this).parent().parent().find('.consultas_content').hide()
  // $(this).parent().parent().find(`.consultas_content.${$(this).data('consulta')}`).show()
})

$(
  '#elecciones_results .elecciones_body_senado .menu_mobile_candidatos_partidos li'
).click(function (e) {
  $(this).siblings().removeClass('active')
  $(this).addClass('active')
  const option = $(this).data('option')
  if (option === 'partidos') {
    $(
      '#elecciones_results .elecciones_body_senado .elecciones_cantidados'
    ).hide()
    $('#elecciones_results .elecciones_body_senado .elecciones_partidos').show()
  } else {
    $(
      '#elecciones_results .elecciones_body_senado .elecciones_cantidados'
    ).show()
    $('#elecciones_results .elecciones_body_senado .elecciones_partidos').hide()
  }
})

$(
  '#elecciones_results .elecciones_body_senado .menu_mobile_candidatos_partidos li input[type=radio]'
).on('click', function (e) {
  // Uncheck others
  $('input[type=radio]').prop('checked', false)

  $(this).prop('checked', true)
  console.log($(this).prop('checked')) // this return true
})
