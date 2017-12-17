class window.Fancybox
  constructor: ->
    @setupFancybox()

  setupFancybox: ->
    $(".fancybox").fancybox(
      maxWidth	: 1000,
      fitToView	: true,
      width		: '90%',
      height		: '70%',
      autoSize	: true,
      closeClick	: false,
      openEffect	: 'none',
      closeEffect	: 'none',
      helpers:
        overlay:
          locked: false
    )
