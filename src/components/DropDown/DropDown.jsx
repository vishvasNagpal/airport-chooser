import React from 'react';
import './DropDown.css';
import data from "../../airports.json"

class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showList: false,
      showContainer: false,
      rawData: data,
      filteredData: data,
      list: data.slice(0, 10),
      current: 1,
      next: true,
      prev: false,
      selected: null,
      size: 10
    }
  }
  componentDidMount() {
    // this.showLoader();
  }
  toggleList = () => {
    this.setState(oldState => {
      if(!oldState.showList){
        this.showLoader();
      }
      return {
        showList: !oldState.showList,
        showContainer: !oldState.showContainer,
        filteredData: data
      }
    });

  }
  filterList = (e) => { // filter the list on changing input text in input box
    let text = e.target.value;
    const {rawData, size} = this.state;
    if(text.length > 0) {

      text = text.toLowerCase();
      const filteredData = rawData.filter(i => {
        const name = i.name.toLowerCase();
        const city = i.city.toLowerCase();
        const country = i.country.toLowerCase();
        const code = i.code.toLowerCase();
        if(
          name.indexOf(text) > -1 ||
          city.indexOf(text) > -1 ||
          country.indexOf(text) > -1 ||
          code.indexOf(text) > -1
        ) {
          return i;
        }
      });
      this.setState({
        filteredData,
        list: filteredData.slice(0, size),
        current: 1,
        next: true,
        prev: false,
      });
      if(filteredData.length <= 10) {
        this.setState({
          next: false,
          prev: false
        });
      }
    } else {
      this.setState({
        filteredData: rawData,
        list: rawData.slice(0, size),
        current: 1
      });
    }
    this.showLoader();
  }
  pagination = (e) => { // handle pagination
    const action = e.target.name;
    const {filteredData, current, size, next, prev} = this.state;
    if(action === "next" && next) {
      const nextIndex = current + 1;
      if (Math.abs((current * size) - filteredData.length) <= 10){
        this.setState({next: false})
      }
      this.setState({
        list: filteredData.slice(size * current, size * (nextIndex)),
        prev: true,
        current: nextIndex
      });
    }

    if(action === "prev" && prev) {
      const prevIndex = current - 1;
      this.setState({
        list: filteredData.slice(size * (prevIndex -1), size * (current -1)),
        next: true,
        current: prevIndex
      });
      if (prevIndex <= 1){
        this.setState({prev: false})
      }
    }

  }
  showLoader = () => { // showing loading for 1 second, assuming that getting data from api
    this.setState({
      loading: true,
      showList: false
    });
    setTimeout(() => {
      this.setState({
        loading: false,
        showList: true
      });
    }, 1000)
  }
  selectItem = (selected) => {
    this.setState({
      selected
    })
  }
  render() {
    const {showList, list, size, current, filteredData, prev, next, selected, loading, showContainer} = this.state;
    return (
      <div className="container">
        <div className="header">
          <h2>Airport Chooser</h2>
          <span>{selected && selected.name}</span>
        </div>
        <div className="dropdown">
          <button className="select" onClick={this.toggleList}>
            {showList ? "Hide Airport List" : "Show Airport List"}
          </button>
          {
            loading &&
              <div className="loading">Loading...</div>
          }

          {
            showContainer &&
              <>
                <input className="search" type="text" placeholder="Search Airport" onChange={this.filterList}/>
              {
                showList &&
                  <div>
                    <div className="list">
                      {
                        list.map((i, idx) => (
                          <div
                            className="list-item"
                            key={`${idx}_${i.code}`}
                            onClick={() => this.selectItem(i)}
                          >
                            <div className="cell">
                              <span>{i.name}</span>
                              <span>{i.code}</span>
                            </div>
                            <div className="cell right">
                              <span>{i.city}</span>
                              <span>{i.country}</span>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                    {
                      filteredData.length > 0 ?
                        <div className="pagination">
                          <div>
                            {`${(current-1)*size + 1} to ${next ? size * current : filteredData.length } of ${filteredData.length}`}
                          </div>
                          <div className="buttonGroup">
                            <button name="prev" disabled={!prev} onClick={this.pagination}>prev</button>
                            <button name="next" disabled={!next} onClick={this.pagination}>next</button>
                          </div>
                        </div> :
                        <div className="noResult">No results found!</div>
                    }
                  </div>
              }


              </>
          }
        </div>
      </div>
    );
  }

}

export default DropDown;
