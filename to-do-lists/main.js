const listsBox = document.querySelector('.lists')
const inputField = document.getElementById('inputField')
const totalItems = document.getElementById('itemLeft')
const filterMethods = document.querySelectorAll('.filter-methods p')
const clearCompleteBtn = document.getElementById('clearCompletedBtn')
const themeToggleBtn = document.getElementById('themeToggleBtn')
const root = document.documentElement
const p = document.querySelectorAll('p')

let totalLists = []
let completedLists = []

let checkBtn = undefined
let items = undefined

let countAll = 0
let countActive = 0
let countCompleted = 0

window.addEventListener('load', () => {
    inputField.value = ''
})

window.addEventListener('keydown', (e) => {

    if(inputField.value === ''){
        return
    }

    if(e.key === 'Enter'){
        countAll++
        countActive = countAll - countCompleted

        // displaying innerHTML 
        listsBox.innerHTML += `
        <div class='display-item'>
          <div class="check"></div>
          <div class="display-input-list">
          <p class="display-text">${inputField.value}</p>
          </div> 
        </div>
        `

        checkBtn = [...document.querySelectorAll('.check')]

        swithBackToNonFilterMode()

        // reset the input value to empty string after hitting enter
        inputField.value = ''


        items = document.querySelectorAll('.display-text')

        // getting the array of toDO lists
        totalLists = [...items]


        // making check btn works
        checkBtnFunction()

        // changing the total item
        totalItems.textContent = countAll

    }

})
filterMethods.forEach((FM,i) => {

    FM.addEventListener('click', () => {

        if(checkBtn === undefined){
            return
        }

        for(const fm of filterMethods){
            fm.classList.remove('active-filter')
        }
        if(i === 0){

            FM.classList.add('active-filter')
            for(const cb of checkBtn){
                cb.parentElement.style.display = 'flex'
                if(cb.classList.contains('deleted')){
                    cb.parentElement.style.display = 'none'
                }
            }
            totalItems.textContent = countAll
        }else if(i === 1){
            FM.classList.add('active-filter')
            checkBtn.forEach(CB => {
                
                if(CB.classList.contains('active-check')){
                    CB.parentElement.style.display = 'none'
                }else if(!CB.classList.contains('active-check')){
                    CB.parentElement.style.display = 'flex'
                }

                if(CB.classList.contains('deleted')){
                    CB.parentElement.style.display = 'none'
                }
            })
            totalItems.textContent = countActive
        }else if(i === 2){

            FM.classList.add('active-filter')
            checkBtn.forEach(CB => {
                CB.parentElement.style.display = 'none'
                if(CB.classList.contains('deleted')){
                    CB.parentElement.style.display = 'none'
                }
                if(CB.classList.contains('active-check')){
                    CB.parentElement.style.display = 'flex'
                }
            })
            totalItems.textContent = countCompleted
        }
    })
})

clearCompleteBtn.addEventListener('click', () => {

    checkBtn.forEach(CB => {
        if(CB.classList.contains('active-check')){
            CB.classList.remove('active-check')
            CB.classList.add('deleted')
            CB.parentElement.style.display = 'none'
            countAll -= countCompleted
            countCompleted = 0
            filterMethods.forEach((FM,i)=> {
                if(FM.classList.contains('active-filter')){
                    if(i === 0){
                        totalItems.textContent = countAll - countCompleted
                    }else if (i === 1){
                        totalItems.textContent = countActive
                    }else if(i === 2){
                        totalItems.textContent = countCompleted
                    }
                }
            })
            
        }
    })
})

themeToggleBtn.addEventListener('click', toggleDayNightMode)

function toggleDayNightMode(){
   this.classList.toggle('day')
   const toggleImg =  this.classList.contains('day') ? `images/icon-moon.svg` : `images/icon-sun.svg`
   this.src = toggleImg
   if(this.classList.contains('day')){
    root.style.setProperty('--night-backgroundClr','hsl(226, 5%, 54%)')
    root.style.setProperty('--night-listsBgClr','hsl(235, 35%, 68%)')
   
    p.forEach(pAll => {
        pAll.classList.add('p-color-white')
    })

    root.style.setProperty('--active-color','hsl(0, 0%, 0%)')
    inputField.style.color = 'white'
    listsBox.style.color = 'white' 
   }else if(!this.classList.contains('day')){
    root.style.setProperty('--night-backgroundClr','hsl(235, 21%, 11%)')
    root.style.setProperty('--night-listsBgClr','hsl(235, 24%, 19%)')
    root.style.setProperty('--active-color','hsl(236, 33%, 92%)')
    p.forEach(pAll => {
        pAll.classList.remove('p-color-black')
    })
    inputField.style.color = 'var(--accent-color)'
    listsBox.style.color = 'var(--accent-color)'
   }
   
}
// sub functions    
function swithBackToNonFilterMode(){
    filterMethods.forEach(FM => {
        FM.classList.remove('active-filter')
    })
    filterMethods[0].classList.add('active-filter')
    checkBtn.forEach(CB => {
        // display both finished and unfinished ones
        if(!CB.classList.contains('deleted')){
            CB.parentNode.style.display = 'flex'
        }
       
        totalItems.textContent = countAll
    })
}


function checkBtnFunction(){
    checkBtn.forEach((CB,i) => {
        CB.addEventListener('click',() => {
            totalLists[i].classList.toggle('active-display-text')
            CB.classList.toggle('active-check')

            const cbInnerHTML = CB.classList.contains('active-check') ? `<img class='check-image' src='images/icon-check.svg'>` : ''

            CB.innerHTML = cbInnerHTML

            if(CB.classList.contains('active-check')){
              countCompleted++
              countActive = countAll - countCompleted
              completedLists.push(items[i].textContent)
            }else if(!CB.classList.contains('active-check')){
              countCompleted--
              countActive++
              const getIndex = completedLists.indexOf(items[i].textContent)
              completedLists.splice(getIndex,1)
            }


            // for hide and show list when user interact in active/completed section
            filterMethods.forEach((fm,i) => {
                if(fm.classList.contains('active-filter')){
                    if(i === 1){
                        CB.parentElement.style.display = 'none'
                        totalItems.textContent = countActive
                    }else if(i === 2){
                        CB.parentElement.style.display = 'none'
                        totalItems.textContent = countCompleted
                    }
                }
            })
        })
    })
}
