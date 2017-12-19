# coffeelint: disable=max_line_length
#= include dist/scripts/jquery.formslider/src/coffee/jquery.formslider.coffee

#= include dist/scripts/jquery.animate.css/src/jquery.animate.css.coffee
#= include dist/scripts/formslider.animate.css/src/formslider.animate.css.coffee
#= include dist/scripts/formslider.dramatic.loader/src/formslider.dramatic.loader.coffee
#= include dist/scripts/formslider.jquery.tracking/src/formslider.jquery.tracking.coffee
# coffeelint: enable=max_line_length

(($) ->

  $.debug(1)

  window.formslider = $('.formslider-wrapper').formslider(
    version: 1

    driver:
      class:    'DriverFlexslider'
      selector: '.formslider > .slide'
      animationSpeed: 600

    pluginsGlobalConfig:
      transitionSpeed: 600
      answersSelector: '.answers'
      answerSelector:  '.answer'
      answerSelectedClass: 'selected'

    plugins: [
      # { class: 'NextSlideResolverPlugin' }
      { class: 'AddSlideClassesPlugin'          }
      { class: 'JqueryAnimatePlugin'            }
      { class: 'JqueryValidatePlugin'           }
      { class: 'ArrowNavigationPlugin'          }
      { class: 'AnswerClickPlugin'              }
      { class: 'InputFocusPlugin'               }
      { class: 'BrowserHistoryPlugin'           }
      { class: 'NormalizeInputAttributesPlugin' }
      { class: 'FormSubmissionPlugin'           }
      { class: 'InputSyncPlugin'                }
      { class: 'NextOnKeyPlugin'                }
      { class: 'TabIndexSetterPlugin'           }
      { class: 'NextOnClickPlugin'              }
      {
        class: 'LoadingStatePlugin'
        config:
          selector: '.progressbar-wrapper, .formslider-wrapper'
      }
      { class: 'ProgressBarPlugin'             }
      {
        class: 'LoaderSlidePlugin'
        config:
          loaderClass: 'DramaticLoaderIplementation'
      }
      { class: 'ContactSlidePlugin'            }
      { class: 'ConfirmationSlidePlugin'       }
      { class: 'EqualHeightPlugin'             }
      {
        class: 'ScrollUpPlugin'
        config:
          scrollUpOffset: 40
      }
      { class: 'LazyLoadPlugin'                }
      { class: 'TrackSessionInformationPlugin' }
      { class: 'TrackUserInteractionPlugin'    }
      {
        class: 'JqueryTrackingPlugin'
        config:
          initialize: true
          adapter: [
            {
              class: 'JqueryTrackingGTagmanagerAdapter'
            }
          ]
      }
    ]
  )

)(jQuery)
