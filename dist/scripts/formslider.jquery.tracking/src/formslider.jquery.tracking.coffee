class @JqueryTracking extends AbstractFormsliderPlugin
  @config =
    initialize: true
    eventCategory: 'formslider'
    trackFormSubmission: true
    conversionErrorEvantName: 'conversion-error'

    # this is only relevant if initialize is set to true
    sessionLifeTimeDays: 1 #s ync with google analytics session lifetime
    cookiePrefix:      'tracking_'
    cookiePath:        '.example.com'
    sourceParamName:   'utm_source'
    campaignParamName: 'utm_campaign'
    storageParams: {
      'utm_source': 'organic'   # source
      'utm_campaign': 'organic' # campaign
    }
    adapter: [ ]

  init: =>
    $.tracking(@config) if @config.initialize

    @on('track', @onTrack)

    return unless @config.trackFormSubmission

    submissionPlugin = @formslider.plugins.get('FormSubmissionPlugin')
    if submissionPlugin
      @on(submissionPlugin.config.successEventName, @onTrackConversion)
      @on(submissionPlugin.config.errorEventName,   @onTrackConversionError)

  onTrackConversion: ->
    $.tracking.conversion()

  onTrackConversionError: =>
    $.tracking.event(@config.eventCategory, @config.conversionErrorEvantName)

  onTrack: (event, source, value, category=null) =>
    $.tracking.event(category || @config.eventCategory, source, value, '', '')
