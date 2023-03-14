import { Card, Rate, Spin } from 'antd'
import { format } from 'date-fns'
import React from 'react'

import './card.css'
import Genres from '../genres/genres'
import SearchEngine from '../../services/searchEngine'

import errorImg from './errorImg.jpg'

export default class CardMovie extends React.Component {
  searchEngine = new SearchEngine()

  state = {
    starsCount: 0,
    isImageLoaded: false,
  }

  cutLastChar = (text) => {
    let res = text.slice(0, -1)
    if (res.slice(-1) === ' ' || res.slice(-1) === ',') {
      return this.cutLastChar(res)
    }
    return res
  }

  cutTextDescription = (text, maxLength) => {
    let truncated = text.substr(0, maxLength)
    if (text.length <= maxLength) {
      return text
    }
    return this.cutLastChar(truncated) + '...'
  }

  truncateText = (text) => {
    if (text.length > 150) {
      const lastSpaceIndex = text.lastIndexOf(' ', 150)
      if (lastSpaceIndex === -1) {
        text = text.slice(0, 150)
      } else {
        text = text.slice(0, lastSpaceIndex)
      }
      text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_~()]/g, '')
      const lastWordIndex = text.lastIndexOf(' ')

      if (/[.,\/#!$%\^&\*;:{}=\-_~()]/.test(text.slice(-1))) {
        text = text.slice(0, lastWordIndex)
      }

      return text + '...'
    } else {
      return text
    }
  }

  translateDateToFormat(dateOfCreation) {
    if (typeof dateOfCreation === 'string' && dateOfCreation !== '') {
      const res = format(new Date(dateOfCreation), 'MMMM dd, yyyy')
      return res
    } else {
      return 'unknown'
    }
  }

  onLoadedImage = () => {
    this.setState({ isImageLoaded: true })
  }

  render() {
    const { name, description, dateOfCreation, imageAddress, genreIds, genresList, rating, movieId, ratingStars } =
      this.props
    let classNamesRating = 'rating'
    if (rating < 3) {
      classNamesRating += ' red-border'
    } else if (rating >= 3 && rating < 5) {
      classNamesRating += ' orange-border'
    } else if (rating >= 5 && rating < 7) {
      classNamesRating += ' yellow-border'
    } else if (rating >= 7) {
      classNamesRating += ' green-border'
    }
    let classNameSpin
    if (this.state.isImageLoaded) {
      classNameSpin = 'hidden'
    } else {
      classNameSpin = 'spin'
    }
    return (
      <Card style={{ width: 454 }} className="movie-card">
        <div className="image-container">
          <Spin className={classNameSpin} />
          <img
            src={imageAddress ? `https://image.tmdb.org/t/p/w500${imageAddress}` : `${errorImg}`}
            alt="#"
            className="movie-poster"
            onLoad={this.onLoadedImage}
          />
        </div>

        <div className="card-info">
          <div className="title-container">
            <p className="title">{name}</p>
            <div className={classNamesRating}>{rating.toFixed(1)}</div>
          </div>
          <p className="date-of-creation">{this.translateDateToFormat(dateOfCreation)}</p>
          <Genres genreIds={genreIds} genresList={genresList} />
          <p className="description">{this.truncateText(description)}</p>
          <Rate
            onChange={(value) => {
              this.setState({ starsCount: value })
              this.searchEngine.rateMovie(value, movieId)
            }}
            count={10}
            className="rate"
            value={this.state.starsCount || ratingStars}
            allowHalf={true}
          />
        </div>
      </Card>
    )
  }
}
