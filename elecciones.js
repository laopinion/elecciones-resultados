// function seeCandidatos() {
//   console.log('ok')
// }

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
