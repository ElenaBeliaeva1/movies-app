import React from 'react'
import { Spin, Pagination, Tabs } from 'antd'

import CardList from '../card-list/card-list'
import SearchEngine from '../../services/searchEngine'
import SearchForm from '../search-form/search-form'
import { Provider } from '../context/context'

import './app.css'

export default class App extends React.Component {
  searchEngine = new SearchEngine()

  state = {
    elements: [],
    elementsRanked: [],
    page: 1,
    pageRanked: 1,
    totalPages: 50,
    totalPagesRanked: 10,
    isLoading: true,
    error: false,
    value: '',
    genresList: [],
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.value !== this.state.value) {
      this.updateElementsBySearch(this.state.value, 1)
      this.setState({
        page: 1,
      })
    }
    if (prevState.page !== this.state.page && this.state.value !== '') {
      this.updateElementsBySearch(this.state.value, this.state.page)
    }
    if (prevState.page !== this.state.page && this.state.value.length === 0) {
      this.updateElementsDefault(this.state.page)
    }
    if (prevState.value !== this.state.value && this.state.value.length === 0) {
      this.updateElementsDefault(1)
      this.setState({ page: 1 })
    }
    if (prevState.pageRanked !== this.state.pageRanked) {
      this.getRankedList()
    }
  }

  async updateElementsBySearch(value, page) {
    await this.searchEngine.getFilmBySearching(value, page).then((res) => {
      this.setState({ elements: res.elements, isLoading: false, totalPages: res.maxPage })
    })
  }

  async updateElementsDefault(page) {
    await this.searchEngine.getResource(page).then((res) => {
      this.setState({ elements: res.elements, isLoading: false, totalPages: res.maxPage })
    })
  }

  onInputChange = async (e) => {
    await this.setState({
      value: e.target.value,
    })
  }

  async onChangingPage(e) {
    await this.setState({
      page: e,
    })
  }

  async onChangingPageRanked(e) {
    await this.setState({
      pageRanked: e,
    })
  }

  getRankedList = async () => {
    await this.searchEngine.getRatedMovies(this.state.pageRanked).then(({ results, totalPagesRanked }) => {
      this.setState({ elementsRanked: results, totalPagesRanked: totalPagesRanked * 10 })
    })
  }

  constructor() {
    super()
    this.updateElementsDefault(1)
    this.searchEngine.getGenreList().then((res) => {
      this.setState(() => {
        return {
          genresList: res,
        }
      })
    })
    if (!localStorage.getItem('guestToken')) {
      this.searchEngine.getGuestToken()
    }
  }

  render() {
    const loadedPage = this.state.isLoading ? (
      <Spin size="large" tip="loading..." className="spin">
        <div />
      </Spin>
    ) : (
      <React.Fragment>
        <SearchForm value={this.state.value} onInputChange={this.onInputChange} />
        <CardList data={this.state.elements} />
        <Pagination
          className="pagination"
          defaultCurrent={1}
          total={this.state.totalPages}
          current={this.state.page}
          onChange={(e) => this.onChangingPage(e)}
        />
      </React.Fragment>
    )

    let tabsElements = [
      {
        key: 1,
        label: 'Search',
        children: [loadedPage],
      },
      {
        key: 2,
        label: 'Rated',
        children: (
          <React.Fragment>
            <CardList data={this.state.elementsRanked} />
            <Pagination
              className="pagination"
              defaultCurrent={1}
              total={this.state.totalPagesRanked}
              current={this.state.pageRanked}
              onChange={(e) => this.onChangingPageRanked(e)}
            />
          </React.Fragment>
        ),
      },
    ]

    return (
      <div className="app">
        <Provider value={this.state.genresList}>
          <Tabs
            defaultActiveKey="1"
            items={tabsElements}
            onChange={async (e) => {
              if (e == 2) {
                await this.getRankedList()
              }
            }}
            className="tabs"
            destroyInactiveTabPane={true}
          />
        </Provider>
      </div>
    )
  }
}
