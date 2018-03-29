class @HistoryJsController extends AbstractFormsliderPlugin
  @config =
    updateUrl: false
    resetStatesOnLoad: true

  init: =>
    @on('after', @onAfter)

    @time = new Date().getTime()

    @pushCurrentHistoryState()
    History.Adapter.bind(window, 'statechange', @handleHistoryChange)

  onAfter: =>
    @pushCurrentHistoryState()

  pushCurrentHistoryState: =>
    index = @index()
    hash  = null
    hash  = "?slide=#{index}" if @config.updateUrl

    History.pushState(
      { index: index, time: @time },
      null,
      hash
    )

  handleHistoryChange: (event) =>
    return if @formslider.locking.locked

    state = History.getState()

    return unless state?.data?.index > -1

    if @config.resetStatesOnLoad
      return unless state.data.time == @time

    @logger.debug('handleHistoryChange', state.data.index)

    @formslider.goto(state.data.index)
