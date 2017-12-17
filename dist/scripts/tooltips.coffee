class @Tooltips
  constructor: (selector)->
    $(selector).each(->
      $this = $(this)

      $this.tooltipster
        theme:         $this.data('tooltip-theme') || 'tooltipster-light'
        contentAsHTML: $this.data('tooltip-html') || true
        animation:     $this.data('tooltip-animation') || 'grow'
        position:      $this.data('tooltip-position') || 'bottom'
        maxWidth:      $this.data('tooltip-max-width') || null
    )
