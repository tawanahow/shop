console.log('This is coming from script tag API!')

const header = $('header.site-header').parent()

header
  .prepend('<div>Hi this is coming from the public folder</div>')
  .css({ 'background-color': 'blue', 'text-align': 'center' })
