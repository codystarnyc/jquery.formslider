load_yaml = require('ewg-config').loadRawYaml

formsliderBasePath = formsliderConfig = undefined

module.exports =
  render_formslider: (configFile) ->
    formsliderConfig   = load_yaml 'src/config/formslider.yml'
    formsliderBasePath = "formslider/#{formsliderConfig.version}"

    result = ''
    for slide, index in formsliderConfig.slides
      slide.index = index
      slide.id    = slide.id || slide.role

      result += @render_partial("#{formsliderBasePath}/slide", config: slide)
      # very strange variable scoing behaviour occured here, scope merges
      # -> see slide.haml
    result

  render_formslider_role: (role, config) ->
    @render_partial("#{formsliderBasePath}/roles/#{role}", {config: config})

  render_formslider_element: (element, config) ->
    @render_partial("#{formsliderBasePath}/elements/#{element}", {config: config})

  render_question_answer: (answer, slide) ->
    answer.inputName = "slides[#{@config.index}][answer]"
    answer.inputId   = "question_#{@config.index}_answer_#{}"
    answer.next = answer.next || slide.next || 'native'

    @render_formslider_element('answer', answer)

  formslider_image: (image, options={}) ->
    @image_tag("#{formsliderConfig.imagePath}/#{image}", options)
