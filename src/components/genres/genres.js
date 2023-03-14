import React from 'react'

import './genres.css'

export default class Genres extends React.Component {
  getGenreById = (id, genresList) => {
    let res
    for (let i = 0; i < genresList.length; i++) {
      if (genresList[i].id === id) {
        res = genresList[i].name
      }
    }
    return res
  }

  render() {
    const { genreIds, genresList } = this.props
    const namesOfGenre = genreIds.map((el) => {
      return (
        <div key={el} className="genre">
          {this.getGenreById(el, genresList)}
        </div>
      )
    })
    return <div className="genres">{namesOfGenre}</div>
  }
}
