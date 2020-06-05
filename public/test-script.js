console.log('This is coming from script ta API!')

const header = $('header.site-header').parent()

const makeHeader = (data) => {
  header
    .prepend(`<div>${data}</div>`)
    .css({ 'background-color': 'blue', 'text-align': 'center' })
}

fetch(
  'https://cors-anywhere.herokuapp.com/https://bfae6683e0c4.ngrok.io/api/products?shop=thdevstore.myshopify.com'
)
  .then((res) => res.json())
  .then((data) => {
    //call function to create header
    makeHeader(data.data)
  })
  .catch((error) => console.log(error))
