const newNoteTitle = document.querySelector("#title")
const newNoteContent = document.querySelector("#content")
const allNotes = document.querySelector("#all-notes")
const burgerIcon = document.querySelector("#burger-icon")
const form = document.querySelector("#new-note");
const liElements = document.querySelectorAll(".li-elements")

let liElementsText = []
let notes = []

let grid = new Muuri(".grid", {

  layout: {
    fillGaps: true
  },

  dragEnabled: true

})

const observer = new ResizeObserver(() => {
  grid.refreshItems().layout()
})

burgerIcon.addEventListener("click", toggleLiElementsText)
liElements.forEach(li=>li.addEventListener("click", toggleLiElementsText))

function toggleLiElementsText() {
    liElements.forEach((li, index)=>{
        if(li.textContent!==""){
            liElementsText.push(li.textContent)
            li.textContent = ""
        }
        else{
            li.textContent = liElementsText[index]   
        }
    })
    let workingAreaWidth = document.querySelector("#working-area")
    if(liElements[0].textContent===""){
        workingAreaWidth.style.width="90%"
    }
    else{
        workingAreaWidth.style.width="60%"
    }
}


const addNote = (event) => {
    if (!form.contains(event.relatedTarget)) {
        const title = document.querySelector("#title")
        const content = document.querySelector("#content")

        const titleValue = title.value.trim()
        const contentValue = content.value.trim()

        if (titleValue !== "" || contentValue !== "") {
            const id = notes.length
            const note = { id:id ,title: titleValue, content: contentValue }
            notes.push(note)
            render()
            title.value = ""
            content.value = ""
        }
    }
}

form.addEventListener("focusout", addNote);


function render() {

    const container = document.querySelector(".grid")

    if (grid) {
        grid.destroy()
    }

    observer.disconnect()

    container.innerHTML = ""

    const elements = []

    notes.forEach(n => {

        const div = document.createElement("div")
        const innerDiv = document.createElement("div")

        const textareaTitle = document.createElement("textarea")
        const textareaContent = document.createElement("textarea")

        textareaTitle.value = n.title
        textareaContent.value = n.content
        div.dataset.id = n.id

        formatNote(div, innerDiv, textareaTitle, textareaContent)

        textareaTitle.addEventListener("input", resizeTextarea)
        textareaContent.addEventListener("input", resizeTextarea)
        textareaTitle.addEventListener("focusout", editNote)
        textareaContent.addEventListener("focusout", editNote)

        innerDiv.appendChild(textareaTitle)
        innerDiv.appendChild(textareaContent)

        div.appendChild(innerDiv)

        elements.push(div)
    })

    elements.forEach(el => {
        container.prepend(el)
        observer.observe(el)
    })

    grid = new Muuri(".grid", {
        layout: {
            fillGaps: true
        },
        dragEnabled: true
    })

    requestAnimationFrame(() => {
        grid.refreshItems().layout()
    })
}


function formatNote(div, innerDiv, textareaTitle, textareaContent) {
    div.classList.add("item")
    innerDiv.style.cssText = "display:flex; flex-direction:column; height:auto; border:1px solid gray; border-radius:10px;"
    innerDiv.classList.add("item-content")
    let commonCssRules = "margin:1px; padding:10px; border:none; outline:none; font-size:16px; field-sizing:content; resize:none; overflow:hidden;" 
    textareaTitle.style.cssText = commonCssRules
    textareaTitle.classList.add("title")
    textareaContent.style.cssText = commonCssRules
    textareaContent.classList.add("content")
}

const resizeTextarea = function() {
    this.style.fieldSizing = "content"
}

newNoteTitle.addEventListener("input", resizeTextarea)
newNoteContent.addEventListener("input", resizeTextarea)

const editNote = function(event) {
    const noteId = event.target.closest('div.item').dataset.id;
    this.classList.contains("title")? notes[noteId].title = this.value : notes[noteId].content = this.value
}
