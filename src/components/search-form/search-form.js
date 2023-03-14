import React from 'react'
import { debounce } from 'lodash'

import SearchEngine from '../../services/searchEngine'
import './search-form.css'

export default class SearchForm extends React.Component {
  searchEngine = new SearchEngine()

  render() {
    return (
      <form
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            e.preventDefault()
          }
        }}
      >
        <input
          placeholder="Type to search..."
          className="search-input"
          onChange={debounce(this.props.onInputChange, 400)}
        />
      </form>
    )
  }
}
