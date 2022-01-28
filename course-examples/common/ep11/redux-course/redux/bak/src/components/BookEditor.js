import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { bookActions } from '../actions'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dialog } from 'primereact/dialog'


const mapStateToProps = function(state) {
  return {
    bookList : state.book.bookList,
    loading : state.book.fetching
  }
}

const mapDispatchToProps = function(dispatch) {
  return {
    actions: bindActionCreators({
      getBooks: bookActions.getBooks,
      addBook: bookActions.addBook,
      updateBook : bookActions.updateBook,
      deleteBook : bookActions.deleteBook
    }, dispatch)
  }
}


class BookEditor extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      isAddDialogShown: false,
      isNewBook : true,
      book: {
        title: '',
        content: ''
      }
    }

    this.hideDialog = () => {
      this.setState({
        isAddDialogShown : false
      })
    }

    this.updateProperty = (property, value) => {
      let book = this.state.book
      book[property] = value
      this.setState({
        book: book
      })
    }

    this.addNew = () => {
      let emptyBook = {
        title : '',
        content : ''
      }
      this.setState({
        book: emptyBook,
        isAddDialogShown: true
      })
    }

    this.saveBook = () => {
      if (this.state.isNewBook) {
        this.props.actions.addBook(this.state.book)
      } else {
        this.props.actions.updateBook(this.state.book.id, this.state.book)
      }
      this.setState({
        isAddDialogShown : false,
        book: {
            title : '',
            content : '',
        }
      })
    }

    this.deleteBook = (rowData) => {
      this.props.actions.deleteBook(rowData.id)
    }

    this.editBook = (rowData) => {
      let bookCopy = Object.assign({}, rowData)
      this.setState({
        book: bookCopy,
        isNewBook: false,
        isAddDialogShown: true
      })
    }

    this.tableFooter = <div>
      <span>
        <Button label="Add" onClick={this.addNew} icon="pi pi-plus" />
      </span>
    </div>

    this.addDialogFooter = <div>
      <Button   label="Save" icon="pi pi-save" onClick={() => this.saveBook()} />
    </div>

    this.opsTemplate = (rowData) => {
      return <>
          <Button icon="pi pi-times" className="p-button-danger" onClick={() => this.deleteBook(rowData)}  />
          <Button icon="pi pi-pencil" className="p-button-warning" onClick={() => this.editBook(rowData)} />
      </>
    }
  }

  componentDidMount(){
    this.props.actions.getBooks()
  }

  render () {
    const { bookList } = this.props
    return (
      <>
        <DataTable value={bookList} footer={this.tableFooter} >
          <Column header='Title' field='title' />
          <Column header='Content' field='content' />
          <Column body={this.opsTemplate} />
        </DataTable>
        {
          this.state.isAddDialogShown ?
            <Dialog   visible={this.state.isAddDialogShown} 
                      header='add a book' 
                      footer={this.addDialogFooter}
                      onHide={this.hideDialog}>
              <InputText onChange={(e) => this.updateProperty('title', e.target.value)} value={this.state.book.title} name="title" placeholder="title" />
              <InputText onChange={(e) => this.updateProperty('content', e.target.value)} value={this.state.book.content} name="content" placeholder="content" />
            </Dialog>
          :
            null
        }
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookEditor)