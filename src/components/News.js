import React, { Component } from "react";
import NewsItem from "./NewsItem";
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";


export class News extends Component {
  static defaultProps = {
    country :'in',
    pageSize : 4,
    category : 'general'

  }

  static propTypes = {
    country : PropTypes.string,
    pageSize : PropTypes.number,
    category : PropTypes.string
  }

  capitalizeFirstLetter = (string) =>{
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults:0
    }
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - News`
  }

  async updateNews(){
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading:true})
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedata = await data.json();
    this.props.setProgress(50);
    this.setState({
      articles: parsedata.articles,
      totalResults: parsedata.totalResults,
      loading: false
    })
    this.props.setProgress(100);

  }

  async componentDidMount() {
    this.updateNews();
  }

  handlePrevClick = async () => {
      this.setState({
        page : this.state.page - 1
      })
      this.updateNews();
  };

  handleNextClick = async () => {
    this.setState({
      page : this.state.page + 1
    })
    this.updateNews();
  };

  fetchMoreData = async () => {
    this.setState({page : this.state.page + 1});
    
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}bc8ea8f5f5c2418ebe72326ecee02322&page=${this.state.page}&pageSize=${this.props.pageSize}`;

    let data = await fetch(url);
    let parsedata = await data.json();

    this.setState({
      articles: this.state.articles.concat(parsedata.articles),
      totalResults: parsedata.totalResults
    })
  };

  render() {
    return (
      <>
        <h2 className="text-center">Top {this.capitalizeFirstLetter(this.props.category)} headlines </h2>
        {this.state.loading && <spinner/>}

        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<spinner/>}
        >
          <div class="container">
            
        <div className="row">
          { this.state.articles.map((element) => {
            return (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title: ""} description={element.description ? element.description : ""} imageurl={element.urlToImage} newsUrl={element.url} author={element.author} date = {element.publishedAt} source = {element.source.name}/>
              </div>
            );
          })}
        </div>
        
        </div>
        </InfiniteScroll>
      </>
    );
  }
}

export default News;
