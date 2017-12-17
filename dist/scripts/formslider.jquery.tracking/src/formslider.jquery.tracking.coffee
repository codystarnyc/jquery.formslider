class @JqueryTrackingPlugin extends AbstractFormsliderPlugin
  @config =
    initialize: true
    eventCategory: 'formslider'

    # this is only relevant if initialize is set to true
    sessionLifeTimeDays: 1 #s ync with google analytics session lifetime
    cookiePrefix:      'tracking_'
    cookiePath:        '.example.com'
    sourceParamName:   'utm_source'
    campaignParamName: 'utm_campaign'
    storageParams: {
      'utm_source': 'organic' #source
      'utm_campaign': 'organic' #campaign
    }
    adapter: [ ]

  init: =>
    $.tracking(@config) if @config.initialize

    @on('track', @onTrack)
    @on('form-submitted', ->
      $.tracking.conversion()
    )

  onTrack: (event, source, value, category=null) =>
    $.tracking.event(category || @config.eventCategory, source, value, '', '')
