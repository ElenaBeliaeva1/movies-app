import React from 'react'

import Card from '../card/card'
import './card-list.css'
import { Consumer } from '../context/context'

export default class CardList extends React.Component {
  render() {
    const { data } = this.props
    const Elements = data.map((el) => {
      return (
        <Consumer key={el.id}>
          {(value) => {
            return (
              <Card
                name={el.title}
                description={el.overview}
                dateOfCreation={el.release_date}
                imageAddress={el.poster_path}
                genreIds={el.genre_ids}
                genresList={value}
                rating={el.vote_average}
                movieId={el.id}
                ratingStars={el.rating}
              />
            )
          }}
        </Consumer>
      )
    })
    return <div className="card-list">{Elements}</div>
  }
}
