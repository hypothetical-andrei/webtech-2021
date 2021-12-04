import { useEffect, useState } from 'react'
import store from './BookStore'
import AddBookForm from './AddBookForm'
import Book from './Book'

function BookList() {
  const [books, setBooks] = useState([])

  useEffect(() => {
    store.getBooks()
    store.emitter.addListener('GET_BOOKS_SUCCESS', () => {
        setBooks(store.data)
    })
  }, [])

  const addBook = (book) => {
      store.addBook(book)
  }

  const saveBook = (id, book) => {
      store.saveBook(id, book)
  }

  const deleteBook = (id) => {
      store.deleteBook(id)
  }

  return (
    <div>
        <h3>list of books</h3>
        {
            books.map((e) => <Book key={e.id} item={e} onSave={saveBook} onDelete={deleteBook} />)
        }
        <h3>Add a book</h3>
        <AddBookForm onAdd={addBook} />
    </div>
  )
}

export default BookList
