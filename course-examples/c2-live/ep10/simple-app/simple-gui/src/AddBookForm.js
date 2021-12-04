import { useState } from 'react'

function AddBookForm (props) {
    const { onAdd } = props
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const add = (evt) => {
        onAdd({
            title,
            content
        })
        setTitle('')
        setContent('')
    }

    return (
        <div>
            <div>
                <input type='text' placeholder='title' value={title} onChange={(evt) => setTitle(evt.target.value)} />
            </div>
            <div>
                <input type='text' placeholder='content' value={content} onChange={(evt) => setContent(evt.target.value)} />
            </div>
            <div>
                <input type='button' value='add me!' onClick={add} />
            </div>
        </div>
    )
}

export default AddBookForm