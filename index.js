import { data } from "./data/data.js"

const brand = document.querySelector('.brand')
const categoryList = document.querySelector('.categorylist')
const range = document.getElementById('range')
const price = document.getElementById('price')
const container = document.getElementById('main')
const clearFilter = document.querySelector('.clearfilter')
const item = document.querySelector('.item')
const noFound = document.querySelector('.no_found')
const search_product = document.querySelector('.search_product')
const cartContainer = document.getElementById('cartContainer')
const cartCount = document.querySelector('.cartCount')
const total = document.getElementById('total')
noFound.innerText = data.length
item.innerText = `All`

const product = (data) =>{ 
              return  container.innerHTML =  data.map((p) =>{
                      return`<div class="card" alt="${p.name}">
                              <img src="${p.img}" class="product_img">
                                  <div class="product_info">
                                      <span class="product_brand">${p.name.substring(0, 17)}...</span>
                                      <span class="product_price">${p.price.toLocaleString("en-US", {style: "currency", currency: "PHP"})}</span>
                                  </div>
                                  <button onclick="addToCart(${p.id})" class="add_to_cart">Add to cart</button>
                          </div> `     
                        }).join("")      
                        }

const categoriesFiltered = (c) =>{
  categoryList.innerHTML = Array.from(new Set(c.map((c) =>{
      return `<span class="category">${c.category}</span><hr>`
    }))).join("")

  categoryList.addEventListener("click", (e)=>{
    const selectedByCategory = e.target.textContent
    const filteredselectedByCategory = data.filter(p => p.category === selectedByCategory)
    const selectedByAll = filteredselectedByCategory.filter(p => p.brand === brand.value)
   
    if(brand.value === "All"){
      product(data.filter(c=> c.category === selectedByCategory))
      noFound.innerText = filteredselectedByCategory.length
      item.innerText = `of "All ${selectedByCategory}"`
    }
    if(brand.value !== "All" && item.innerText !== "All"){
      product(selectedByAll)
      noFound.innerText = selectedByAll.length
      item.innerText = `of "${brand.value} ${selectedByCategory}"`
    }
  })
}
const f =() =>{
    categoriesFiltered(data)
    product(data)
    item.innerText = `All`
    noFound.innerText = data.length
}
const brands = () =>{
    const brandList = Array.from(new Set(data.map(b => b.brand)))
    const allBrand = ["All",...brandList.map(b =>b )]

    brand.innerHTML = allBrand.map(b =>{
      return `<option value=${b}>${b}</option>`
    }).join("")

    brand.addEventListener("change", (e)=>{
        const selectedByBrand = e.target.value
        const filterBrand = data.filter(p => p.brand === selectedByBrand)
   
        if(selectedByBrand === "All" ){
          return f()
        } 
        product(filterBrand.filter(p => p.price <= price.innerText))
        categoriesFiltered(data.filter(p => p.brand === selectedByBrand))
        item.innerText = `of "${selectedByBrand}"`
        noFound.innerText = filterBrand.length
     })}

clearFilter.addEventListener("click", ()=>{
    product(data)
    categoriesFiltered(data)
    noFound.innerText = data.length
    item.innerText = `All`
    brand.value = "All"
})

const priceList = () =>{
    const pList = Array.from(new Set(data.map(p => p.price)))
    const minPrice = Math.min(...pList)
    const maxPrice = Math.max(...pList)

   range.value = maxPrice
    price.innerText = maxPrice
 
    range.addEventListener("change",(e)=>{
      const valPrice = e.target.value
     
      range.max = maxPrice
      range.min = minPrice
      price.innerText = valPrice
  
      const filterByBrand = data.filter(p => p.brand === brand.value)
      if(brand.value === "All" && item.innerText === "All")product(data.filter(p => p.price <= price.innerText))
      if(brand.value === "All" && item.innerText !== "All")product(data.filter(p => p.price <= price.innerText))
      if(brand.value !== "All" && item.innerText !== "All")product(filterByBrand.filter(p => p.price <= price.innerText))
    })
}
search_product.addEventListener("keyup", e =>{
  const searchByName = e.target.value.toLowerCase()
  product(data.filter(p => p.name.toLowerCase().includes(searchByName)))
 })

let myCart = []   
const addToCart = (id)=>{
  let searchByID = myCart.find(x => x.id === id)
  if(searchByID === undefined){
      myCart.push({
        id,
        qty: 1
      })
  }else{
      searchByID.qty +=1
  }
  loadCart(myCart)
  update()
}
const decrement = (id)=>{
  let searchByID = myCart.find(x => x.id === id)

  if(searchByID.qty === 1){
      return
  }else{
      searchByID.qty -=1
  }
  update()
 
  loadCart(myCart)
}
let allTotal =''
const update=()=>{
  let countItem = myCart.map(x => x.qty).reduce((x, y) => x + y, 0)
  let searchid = myCart.map(d=> {
    const { id, qty } = d
    let search = data.find(y => y.id === id) || []
    return qty * search.price
  })
   allTotal = searchid.reduce((x, y) => x + y, 0)
  cartCount.innerText = countItem
  total.innerText = allTotal.toLocaleString("en-US", {style: "currency", currency: "PHP"})
  
}

if (myCart.length === 0) {
   cartContainer.innerHTML = `<h2 class="empty">Cart is Empty</h2>`
}


const loadCart = (cart) =>{
  console.log(cart, 9)
  if (cart.length === 0) {
    return cartContainer.innerHTML = `<h2 class="empty">Cart is Empty</h2>`
  } else {
    return cartContainer.innerHTML = cart.map((c, cid)=>{
      let search = data.find(y=> y.id === c.id) || []
      let res = search.price * c.qty
      return `<div class="item">
                <div class="pic_name">
                    <img src="${search.img}" class = "cart_img" alt="">
                </div>
                <div class="price">
                    <h4 id="brand_name">${search.name.substring(0, 20)}...</h4>
                    <h4 id="price_per_item">Price: ${search.price.toLocaleString("en-US", {style: "currency", currency: "PHP"})}</h4>
                    <h4 id="qty">Qty: ${c.qty}</h4>
                    <p id="price2">${res.toLocaleString("en-US", {style: "currency", currency: "PHP"})}</p>
                </div>
                <div class="add_remove">
                        <button id="remove" onclick='decrement(${c.id})' class="button_cart">-</button>
                        <button id="add" onclick='addToCart(${c.id})' class="button_cart">+</button>
                </div>
                  </div>
                <hr>`
              }).join("")}
            }
document.querySelector('.removeAll').addEventListener('click', ()=>{
  let text= "Press OK or Cancel"
  if(confirm(text) == true && myCart.length !== 0){
    loadCart(myCart = [])
    cartCount.innerText = 0
    total.innerText = 0
  }
})
document.querySelector('.btnCheckout').addEventListener('click', ()=>{
   if (myCart.length) {
       const totalPayment = allTotal.toLocaleString("en-US", {style: "currency", currency: "PHP"})
      alert(`Your total payment is ${totalPayment}`)
   }
})
console.log('first')
window.product = product
const card = document.querySelector('.card')
console.log(card)
window.addToCart = addToCart
window.decrement = decrement
product(data)
priceList()
brands()
categoriesFiltered(data)
