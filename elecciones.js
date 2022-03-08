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
  const numberValor = parseInt(string)
  const position = string.indexOf(numberValor)
  return string.substring(position)
}

function capitalizarPrimeraLetra(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function mainData() {
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
      let porcMesas = parseInt(porc)
      porcMesas = Math.round(porcMesas)
      $(titleResult)
        .find('.elecciones_mesas .porcentaje_m span')
        .text(porcMesas + '%')

      const footerResult = '.elecciones_footer'
      $(footerResult)
        .find('.total_v_title .total_v')
        .text(
          number_format(
            result.data.Detalle_Circunscripcion.lin[0].Detalle_Partidos_Totales
              .lin[0].Votos.V
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
            console.log(infoCandidato)
            if (infoCandidato.length > 0) {
              const { primer_apellido, primer_nombre, segundo_nombre } =
                infoCandidato[0]
              const divCandidato = `<li>
                  <span class="candidato">${capitalizarPrimeraLetra(
                    primer_nombre
                  )} ${segundo_nombre} ${primer_apellido}</span>
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
    })
}

mainData()

$('#elecciones_results .elecciones_menu li').click(function (e) {
  console.log($(this).data('corporacion'))
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
  } else if (corporacion === 'camara') {
    $('#elecciones_results .elecciones_body_camara').show()
    $('#elecciones_results .elecciones_body_senado').hide()
    $('#elecciones_results .elecciones_body_consultas').hide()
    $(
      '#elecciones_results .elecciones_header .elecciones_title_result h2'
    ).text('Resultados Norte de Santander')
  } else {
    $('#elecciones_results .elecciones_body_consultas').show()
    $('#elecciones_results .elecciones_body_camara').hide()
    $('#elecciones_results .elecciones_body_senado').hide()
    $(
      '#elecciones_results .elecciones_header .elecciones_title_result h2'
    ).text('Resultados Elecciones Nacionales')
  }
})

$('.eleeciones_r_camara_partidos .elecciones_logos_partidos .btn_flecha').click(
  function (e) {
    // $(this).slideUp()
    console.log(e)
    console.log($(this).data('partido'))
    const partido = $(this).data('partido')
    // $(this).parent().parent().css('height', 'auto')
    const resultCamara = $(this).parent().parent().parent()

    resultCamara.find(`.list_candidatos.${partido}`).toggle()
    // const listPartido = $(this).parent().parent()
    // $(this).parent().parent().find('.list_candidatos').toggle('slow')

    console.log('ok')
  }
)

$('.elecciones_body_consultas .consultas li').click(function (e) {
  console.log($(this).data('consulta'))
  $(this).addClass('active')
  $(this).siblings().removeClass('active')
  // $(this).parent().parent().find('.consultas_content').hide()
  // $(this).parent().parent().find(`.consultas_content.${$(this).data('consulta')}`).show()
})
