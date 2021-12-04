import { useState } from 'react'
import './Book.css'

function Book (props) {
    const { item, onDelete, onSave } = props
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState(item.title)
    const [content, setContent] = useState(item.content)

    const deleteBook = (evt) => {
        onDelete(item.id)
    }

    const edit = () => {
        setIsEditing(true)
    }

    const cancel = () => {
        setIsEditing(false)
    }

    const saveBook = () => {
        onSave(item.id, {
            title,
            content
        })
        setIsEditing(false)
    }

    return (
        <div>
            {
                isEditing
                    ? (
                        <>
                            i have the title
                            <input type='text' value={title} onChange={(evt) => setTitle(evt.target.value)} />
                            and content
                            <input type='text' value={content} onChange={(evt) => setContent(evt.target.value)} />
                            <input type='button' value='save' onClick={saveBook} />
                            <input type='button' value='cancel' onClick={cancel} />

                        </>
                    )
                    : (
                        <>
                            i have the title <span className='book-title'>{item.title}</span> and content <span style={{ backgroundColor: 'lightgreen'}}>{item.content}</span>
                            <input type='button' value='delete' onClick={deleteBook} />
                            <input type='button' value='edit' onClick={edit} />
                        </>
                    )
            }
        </div>
    )
}

export default Book