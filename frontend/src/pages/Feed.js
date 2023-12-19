import React, {useEffect, useState} from 'react';
import "./Feed.css"
import "./Header.css"
import Header from "./Header";
import Loading from "./Loading";
import {useNavigate} from 'react-router-dom';
import Icon from '@mdi/react';
import {mdiOpenInNew, mdiAccountCircle} from '@mdi/js';

import {fetchAllSummaries, fetchUserById} from "../services/service";
import moment from "moment";

const CardGeneration = (summary) => {
    let navigate = useNavigate();
    const date = moment(summary.summary.publish_date);

    return (
        <div className={"summary-card"}>
            <div className={"summary-card-stats-wrap"}>
                <div className={"summary-card-stats"}>
                    <div className={"summary-card-stats-label"}>{Math.round(summary.summary.rating)} rating</div>
                    <div className={"summary-card-stats-label"}>{summary.summary.reviews.length} reviews</div>
                    <div className={"summary-card-stats-label"}>{summary.summary.marksNumber} marks</div>
                </div>
            </div>
            <div className={"summary-card-data"}>
                <div className={"summary-card-data-title"}>
                    <div className={"summary-card-data-title-link"}
                         style={{textAlign: "left"}}
                         onClick={() => navigate("/summary", {state: {summaryId: summary.summary.id}})}>
                        {summary.summary.title}
                    </div>
                </div>
                <div className={"summary-card-data-tags"}>
                    {
                        summary.summary.tags.map((res) => {
                            return <div className={"summary-card-data-tag"} key={res}>{res}</div>
                        })
                    }
                </div>
                <div className={"summary-card-data-links"}>
                    <a className={"summary-card-data-links-source"}
                       href={summary.summary.resource_url}
                       target="_blank"
                       rel="noopener noreferrer">
                        <Icon className={"summary-card-data-links-source-icon"} path={mdiOpenInNew} size={0.7}/>
                        origin link
                    </a>
                    <div className={"summary-card-data-links-author"}>
                        <Icon className={"summary-card-data-links-source-icon"} path={mdiAccountCircle} size={0.8}/>
                        {summary.summary?.user?.login} ({date.fromNow()})
                    </div>
                </div>
            </div>
        </div>

  )
}

const SummariesPageGeneration = ({summaries, page}) => {
    // let _summaries = []
    //
    // for (let i = summaries.length - 5 * (page - 1) - 1; i > summaries.length - 1 - 5 * page && i >= 0; i--)
    //     _summaries[i] = summaries[i];

    return (summaries.map((s) => {
            return <CardGeneration summary={s}/>
        }
    ).reverse())
}

// const PagesBarGeneration = ({summaries, page, setPage, navigate}) => {
//     let j = 0;
//     let i = summaries.length / 5;
//     let result = [];
//
//     for (; i > 0; i--, j++) {
//         result[j] = j + 1;
//     }
//
//     return (
//
//         <div className={"main-div-page"}><span style={{color: "white"}} className={"main-div-page-text"}></span>
//             {
//                 result.map((res) => {
//                     if (res === page) {
//                         return <span style={{color: "wheat"}} className={"main-div-page-text"} key={res}
//                                      onClick={() => {
//                                          setPage(res)
//                                      }}>
//                             {res}
//                         </span>
//                     } else return (<span style={{color: "chocolate"}} className={"main-div-page-text"}
//                                          onClick={() => {
//                                              setPage(res)
//                                          }}>
//                         {res}
//                     </span>)
//                 })
//             }<span style={{color: "chocolate"}} className={"main-div-page-text"}>)</span>
//         </div>
//     )
// }

const Feed = () => {
  const [summaries, setSummaries] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filteredData, setFilteredData] = useState(null);
  const [filterTitle, setFilterTitle] = useState(null);
  const [filterAuthor, setFilterAuthor] = useState(null);
  const [page, setPage] = useState(1)
  const [sortDirection, setSortDirection] = useState( true );
  const [sortKey, setSortKey] = useState('author');

  let navigate = useNavigate();
  useEffect(() => {
      const getSummariesForUser = async () => {
        const _summaries = await fetchAllSummaries()
        for (let i = 0; i < _summaries.length; i++) {
          _summaries[i].user = await fetchUserById(_summaries[i].creator);
          _summaries[i].author = _summaries[i]?.user?.login
        }
        setSummaries(_summaries)
        setFilteredData(_summaries)
        setLoading(false)
      }
      getSummariesForUser()
    },
    [navigate]
  )

  useEffect(() => {
    if (loading === false) {
      const filtered = summaries.filter(item => {
        if (filterTitle)
          if (!item.title.toLowerCase().includes(filterTitle.toLowerCase())) return false;
        if (filterAuthor)
          if (!item.author.toLowerCase().includes(filterAuthor.toLowerCase())) return false;
        return true;
      }
    );
      setFilteredData(filtered);
    }
  }, [summaries, filterAuthor, filterTitle]);


  useEffect(() => {
    if (loading === false) {
      let _summaries = filteredData
      _summaries.sort((a, b) => {
        if (a[sortKey] < b[sortKey]) {
          return sortDirection === true ? -1 : 1;
        }
        if (a[sortKey] > b[sortKey]) {
          return sortDirection === true ? 1 : -1;
        }
        return 0;
      });
      setFilteredData(_summaries);
    }
  }, [summaries, sortDirection, sortKey])

  return (
    <div className={loading ? "no-scroll" : ""}>
      {Header()}
      <div className={"main-div"}>
        <div className={"main-div-tools"}>
            <p className={"main-div-major-text"}>Recent Summaries:</p>
            <div className={"main-div-button"} onClick={() => navigate("/push_summary")}>Add summary</div>
        </div>
        <div style={{display: "flex"}}>

            <input
              type="text"
              value={filterTitle}
              placeholder="Find by title"
              onChange={(event)=>{setFilterTitle(event.target.value)}}
              className={"custom-input"}
            />
            <input
                type="text"
                value={filterAuthor}
                placeholder="Find by author"
                onChange={(event)=>{setFilterAuthor(event.target.value)}}
                className={"custom-input"}
            />


            <div style={{margin: "20px"}}>
                <label style={{color: "white"}}>Sort by:</label>
                <select onChange={(e) => setSortKey(e.target.value)}>
                    <option value="author">Author</option>
                    <option value="rating">Rating</option>
                    <option value="title">Title</option>
                </select>
            </div>

            <div style={{margin: "20px"}}>
                <label style={{color: "white"}}>Sort ASC</label>
                <input type="radio" checked={sortDirection} onClick={() => {setSortDirection(!sortDirection)}}/>
            </div>
        </div>
        <div className={"card-holder"}>
          {loading ? <div className="company-name"><Loading/></div> :
            <SummariesPageGeneration summaries={filteredData} page={page}/>
          }
        </div>
          {/*{loading ? <div className="company-name"></div> :*/}
          {/*    // <PagesBarGeneration summaries={summaries} page={page} setPage={setPage} navigate={navigate}/>*/}
          {/*}*/}
      </div>
    </div>
  );
}

export default Feed;