import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faMagnifyingGlass, faHouse, faFileLines, faStar } from "@fortawesome/free-solid-svg-icons";
import { setInitialState, RootState, ArticleType, idSetting } from "../store";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch } from "../index";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";

export type KrToEnType = (parameter :string[]) => void

export type FilteringType = {
  headline : string,
  date : string,
  country : string[]
}

/* Filtering Function List */
/** 1. Headline Filtering */
function headlineFilter(filteringValue :FilteringType, stateArticle :ArticleType[],
  setArticleArray :Dispatch<SetStateAction<ArticleType[]>>, setScrollEvent :Dispatch<SetStateAction<boolean>>, dispatch :AppDispatch) {

  let copyArticleArray :ArticleType[] = [];
  stateArticle.map((value) => {
    if(typeof value.headline === 'string'){
      if(value.headline.toLowerCase().includes(filteringValue.headline.toLowerCase())){
        copyArticleArray.push(value);
      }
    }
  });

  let idArr :string[] = [];
  copyArticleArray.map((value) => {
    if(typeof value.article_id === 'string'){
      idArr.push(value.article_id);
    }
  });

  dispatch(idSetting(idArr));

  setArticleArray(copyArticleArray);
  setScrollEvent(false);

}

/** 2. Date Filtering */
async function dateFilter(filteringValue :FilteringType,
  setArticleArray :Dispatch<SetStateAction<ArticleType[]>>, setScrollEvent :Dispatch<SetStateAction<boolean>>, dispatch :AppDispatch) {
  try{
    const dateValue = filteringValue.date.replaceAll('.', '');
    // const PROXY = window.location.hostname === 'localhost' ? 'https://api.nytimes.com' : '/proxy';
    // const getData = await axios.get(`${PROXY}/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`);
    const getData = await axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=${process.env.REACT_APP_NYTIMES_API}`);
    let arr :ArticleType[] = [];
    for(let i = 0; i < 10; i++){
      arr.push({
        article_id : getData.data.response.docs[i]._id.slice(-12),
        headline : getData.data.response.docs[i].headline.main,
        byline : getData.data.response.docs[i].byline.original?.slice(3),
        date : getData.data.response.docs[i].pub_date.slice(0, 10),
        source : getData.data.response.docs[i].source,
        keyword : getData.data.response.docs[i].keywords,
        url : getData.data.response.docs[i].web_url
      });
    }

    let idArr :string[] = [];
    arr.map((value) => {
      if(typeof value.article_id === 'string'){
        idArr.push(value.article_id);
      }
    });

    dispatch(idSetting(idArr));

    setArticleArray(arr);
    setScrollEvent(false);
  } catch {
    console.log('error');
  } 
}

/** 3. Country Filtering */
function countryFilter(filteringValue :FilteringType, krToEn :KrToEnType, stateArticle :ArticleType[],
  setArticleArray :Dispatch<SetStateAction<ArticleType[]>>, setScrollEvent :Dispatch<SetStateAction<boolean>>, dispatch :AppDispatch) {
  let countryFilterArr :ArticleType[] = [];
  let copyArr = [...filteringValue.country];
  krToEn(copyArr);
  copyArr.map((nation) => {
    for(let i = 0; i < stateArticle.length; i++){
      if(stateArticle[i].keyword.includes(nation)){
        countryFilterArr.push(stateArticle[i]);
        return
      }
    }
  });

  let idArr :string[] = [];
  countryFilterArr.map((value) => {
    if(typeof value.article_id === 'string'){
      idArr.push(value.article_id);
    }
  });

  dispatch(idSetting(idArr));

  setArticleArray(countryFilterArr);
  setScrollEvent(false);
}

/** 4. Headline + Date */
function headlinePlusDate(filteringValue :FilteringType,
  setArticleArray :Dispatch<SetStateAction<ArticleType[]>>, setScrollEvent :Dispatch<SetStateAction<boolean>>, dispatch :AppDispatch){

  async function getApi(){
    try{
      const dateValue = filteringValue.date.replaceAll('.', '');
      // const PROXY = window.location.hostname === 'localhost' ? 'https://api.nytimes.com' : '/proxy';
      // const getData = await axios.get(`${PROXY}/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`);
      const getData = await axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=${process.env.REACT_APP_NYTIMES_API}`);
      let arr :ArticleType[] = [];
      for(let i = 0; i < 10; i++){
        arr.push({
          article_id : getData.data.response.docs[i]._id.slice(-12),
          headline : getData.data.response.docs[i].headline.main,
          byline : getData.data.response.docs[i].byline.original?.slice(3),
          date : getData.data.response.docs[i].pub_date.slice(0, 10),
          source : getData.data.response.docs[i].source,
          keyword : getData.data.response.docs[i].keywords,
          url : getData.data.response.docs[i].web_url
        });
      }
      
      let copyArticleArray :ArticleType[] = [];
      arr.map((value) => {
        if(typeof value.headline === 'string'){
          if(value.headline.toLowerCase().includes(filteringValue.headline.toLowerCase())){
            copyArticleArray.push(value);
          }
        }
      });

      let idArr :string[] = [];
      copyArticleArray.map((value) => {
        if(typeof value.article_id === 'string'){
          idArr.push(value.article_id);
        }
      });

      dispatch(idSetting(idArr));

      setArticleArray(copyArticleArray);
      setScrollEvent(false);
    } catch {
      console.log('error');
    }
  }
  getApi();
}

/** 5. Headline + Country */
function headlinePlusCountry(filteringValue :FilteringType, krToEn :KrToEnType, stateArticle :ArticleType[],
  setArticleArray :Dispatch<SetStateAction<ArticleType[]>>, setScrollEvent :Dispatch<SetStateAction<boolean>>, dispatch :AppDispatch){

  let countryFilterArr :ArticleType[] = [];
  let copyArr = [...filteringValue.country];
  krToEn(copyArr);
  copyArr.map((nation) => {
    for(let i = 0; i < stateArticle.length; i++){
      if(stateArticle[i].keyword.includes(nation)){
        countryFilterArr.push(stateArticle[i]);
        return
      }
    }
  });

  let copyArticleArray :ArticleType[] = [];
  countryFilterArr.map((value) => {
    if(typeof value.headline === 'string'){
      if(value.headline.toLowerCase().includes(filteringValue.headline.toLowerCase())){
        copyArticleArray.push(value);
      }
    }
  });

  let idArr :string[] = [];
  copyArticleArray.map((value) => {
    if(typeof value.article_id === 'string'){
      idArr.push(value.article_id);
    }
  });

  dispatch(idSetting(idArr));

  setArticleArray(copyArticleArray);
  setScrollEvent(false);

} 

/** 6. Date + Country */
function datePlusCountry(filteringValue :FilteringType, krToEn :KrToEnType,
  setArticleArray :Dispatch<SetStateAction<ArticleType[]>>, setScrollEvent :Dispatch<SetStateAction<boolean>>, dispatch :AppDispatch) {

    async function getApi(){
      try{
        const dateValue = filteringValue.date.replaceAll('.', '');
        // const PROXY = window.location.hostname === 'localhost' ? 'https://api.nytimes.com' : '/proxy';
        // const getData = await axios.get(`${PROXY}/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`);
        const getData = await axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=${process.env.REACT_APP_NYTIMES_API}`);
        let arr :ArticleType[] = [];
        for(let i = 0; i < 10; i++){
          arr.push({
            article_id : getData.data.response.docs[i]._id.slice(-12),
            headline : getData.data.response.docs[i].headline.main,
            byline : getData.data.response.docs[i].byline.original?.slice(3),
            date : getData.data.response.docs[i].pub_date.slice(0, 10),
            source : getData.data.response.docs[i].source,
            keyword : getData.data.response.docs[i].keywords,
            url : getData.data.response.docs[i].web_url
          });
        }

        let countryFilterArr :ArticleType[] = [];
        let copyArr = [...filteringValue.country];
        krToEn(copyArr);
        copyArr.map((nation) => {
          for(let i = 0; i < arr.length; i++){
            if(arr[i].keyword.includes(nation)){
              countryFilterArr.push(arr[i]);
              return
            }
          }
        });

        let idArr :string[] = [];
        countryFilterArr.map((value) => {
          if(typeof value.article_id === 'string'){
            idArr.push(value.article_id);
          }
        });

        dispatch(idSetting(idArr));

        setArticleArray(countryFilterArr);
        setScrollEvent(false);
        
      } catch {
        console.log('error');
      }
    }
    getApi();

}

/** 7. Headline + Date + Country */
function headlinePlusDatePlusCountry(filteringValue :FilteringType, krToEn :KrToEnType,
  setArticleArray :Dispatch<SetStateAction<ArticleType[]>>, setScrollEvent :Dispatch<SetStateAction<boolean>>, dispatch :AppDispatch) {
  async function getApi(){
    try{
      const dateValue = filteringValue.date.replaceAll('.', '');
      // const PROXY = window.location.hostname === 'localhost' ? 'https://api.nytimes.com' : '/proxy';
      // const getData = await axios.get(`${PROXY}/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`);
      const getData = await axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=${process.env.REACT_APP_NYTIMES_API}`);
      let arr :ArticleType[] = [];
      for(let i = 0; i < 10; i++){
        arr.push({
          article_id : getData.data.response.docs[i]._id.slice(-12),
          headline : getData.data.response.docs[i].headline.main,
          byline : getData.data.response.docs[i].byline.original?.slice(3),
          date : getData.data.response.docs[i].pub_date.slice(0, 10),
          source : getData.data.response.docs[i].source,
          keyword : getData.data.response.docs[i].keywords,
          url : getData.data.response.docs[i].web_url
      });
      }
      
      let copyArticleArray :ArticleType[] = [];
      arr.map((value) => {
        if(typeof value.headline === 'string'){
          if(value.headline.toLowerCase().includes(filteringValue.headline.toLowerCase())){
            copyArticleArray.push(value);
          }
        }
      });

      let countryFilterArr :ArticleType[] = [];
        let copyArr = [...filteringValue.country];
        krToEn(copyArr);
        copyArr.map((nation) => {
          for(let i = 0; i < copyArticleArray.length; i++){
            if(copyArticleArray[i].keyword.includes(nation)){
              countryFilterArr.push(copyArticleArray[i]);
              return
            }
          }
        });

        let idArr :string[] = [];
        countryFilterArr.map((value) => {
          if(typeof value.article_id === 'string'){
            idArr.push(value.article_id);
          }
        });

        dispatch(idSetting(idArr));
        setArticleArray(countryFilterArr);
        setScrollEvent(false);
      
    } catch {
      console.log('error');
    }
  }
  getApi();
}

function User(){
  let [filteringValue, setFilteringValue] = useState<FilteringType>({
    headline : '전체 헤드라인',
    date : '전체 날짜',
    country : ['전체 국가']
  });
  const [headerList, setHeaderList] = useState(['전체 헤드라인', '전체 날짜', '전체 국가']);
  const [headerListIcon] = useState([<FontAwesomeIcon className="header-icon" icon={faMagnifyingGlass}/>, <FontAwesomeIcon className="header-icon" icon={faCalendarCheck}/>]);
  let [articleArray, setArticleArray] = useState<ArticleType[]>([]);
  let [scrollCount, setScrollCount] = useState(0);
  let [modalOn, setModalOn] = useState(false);
  let [scrollEvent, setScrollEvent] = useState(true);
  let [scrapped, setScrapped] = useState<ArticleType[]>([]);
  let [reRendering, setReRendering] = useState(true);
  let navigate = useNavigate();
  let location = useLocation();
  const articleState = useSelector((state :RootState) => state.article);
  const dispatch = useDispatch<AppDispatch>();

  /** Scroll Event Handler Function */
  const scrollHandle = () => {
    let html = document.querySelector('html');
    if(html instanceof HTMLHtmlElement){
      let scrollValue = html.scrollTop;
      let heightValue = html.scrollHeight;
      let contentValue = html.clientHeight;

      if(scrollValue + contentValue >= heightValue) {
        return setScrollCount(scrollCount + 1);
      }
    }
  }

  /** Korean to English Funtion */
  // type KrToEnType = (parameter :string[]) => void
  const krToEn :KrToEnType= (parameter :string[]) => {
    parameter.map((value, i, arr) => {
      switch (value) {
        case '대한민국': 
          arr[i] = 'South Korea'; 
          break;
        case '중국': 
          arr[i] = 'China'; 
          break;
        case '일본': 
          arr[i] = 'Japan'; 
          break;
        case '미국': 
          arr[i] = 'US'; 
          break;
        case '북한': 
          arr[i] = 'North Korea'; 
          break;
        case '러시아': 
          arr[i] = 'Russia'; 
          break;
        case '프랑스': 
          arr[i] = 'France'; 
          break;
        case '영국': 
          arr[i] = 'England'; 
          break;
      }
    });
  }

  // Check User Login
  useEffect(() => {
    async function checkUser(){
      const getUser = await axios.get('http://localhost:8080/check');
      if(getUser.data.user === undefined){
        navigate('/');
      } else {
        navigate('/user');
      }
    }
    checkUser();
  }, []);

  // Get API
  useEffect(() => {
    async function getApi(){
      try{
        // const PROXY = window.location.hostname === 'localhost' ? 'https://api.nytimes.com' : '/proxy';
        // const getData = await axios.get(`${PROXY}/svc/search/v2/articlesearch.json?page=${scrollCount}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`);
        const getData = await axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?page=${scrollCount}&api-key=${process.env.REACT_APP_NYTIMES_API}`);

        let arr :ArticleType[] = [];
        let idArr :string[] = [];
        for(let i = 0; i < 10; i++){
          arr.push({
            article_id : getData.data.response.docs[i]._id.slice(-12),
            headline : getData.data.response.docs[i].headline.main,
            byline : getData.data.response.docs[i].byline.original?.slice(3),
            date : getData.data.response.docs[i].pub_date.slice(0, 10),
            source : getData.data.response.docs[i].source,
            keyword : getData.data.response.docs[i].keywords,
            url : getData.data.response.docs[i].web_url
          });
          idArr.push(getData.data.response.docs[i]._id.slice(-12));
        }

        dispatch(idSetting(idArr));
        dispatch(setInitialState(arr));
        setArticleArray(arr);
      } catch {
        console.log('Error');
      }
    }
    getApi();
  }, [scrollCount]);

  useEffect(() => {
    setArticleArray(articleState);
  }, [articleState]);

  // Get Scrap Data
  useEffect(() => {
    async function initScrap(){
      const articleData = await axios.get('http://localhost:8080/article');
      setTimeout(() => {
        articleData.data.result.map((value :ArticleType) => {
          let buttonEl = document.getElementById(`${value.article_id}`);
          if(buttonEl instanceof HTMLButtonElement){
            buttonEl.style.color = 'rgb(255, 180, 35)';
          }
        });
      }, 500);
      let copyArr = [...articleData.data.result];
      setScrapped(copyArr);
    }
    initScrap();
  }, [location, reRendering]);

  // Header UI
  useEffect(() => {
    setHeaderList(['전체 헤드라인', '전체 날짜', '전체 국가']);
    setArticleArray(articleState);
  }, [location]);

  useEffect(() => {
    // Date UI
    if(filteringValue.date === '전체 날짜' || filteringValue.date.length === 0){
      filteringValue.date = '전체 날짜';
      let headerContainerLi = document.querySelector('.li-1');
      if(headerContainerLi instanceof HTMLLIElement){
        headerContainerLi.setAttribute('id', '');
      }
      setArticleArray(articleState);
      setScrollEvent(true);
    } else {
      let headerContainerLi = document.querySelector('.li-1');
      if(headerContainerLi instanceof HTMLLIElement){
        headerContainerLi.setAttribute('id', 'filtering-css');
      }
    }

    // Country UI
    if(filteringValue.country[0] === '전체 국가' || filteringValue.country.length === 0){
      filteringValue.country = ['전체 국가'];
      let headerContainerLi = document.querySelector('.li-2');
      if(headerContainerLi instanceof HTMLLIElement){
        headerContainerLi.setAttribute('id', '');
      }
      setArticleArray(articleState);
      setScrollEvent(true);
    } else {
      filteringValue.country = filteringValue.country.length === 1
      ? filteringValue.country
      : [`${filteringValue.country[0]} 외 ${filteringValue.country.length - 1}개`];
      let headerContainerLi = document.querySelector('.li-2');
      if(headerContainerLi instanceof HTMLLIElement){
      headerContainerLi.setAttribute('id', 'filtering-css');
      }
    }

    // Headline UI
    if(filteringValue.headline === '전체 헤드라인' || filteringValue.headline.length === 0){
      filteringValue.headline = '전체 헤드라인';
      let headerContainerLi = document.querySelector('.li-0');
      if(headerContainerLi instanceof HTMLLIElement){
        headerContainerLi.setAttribute('id', '');
      }
      setArticleArray(articleState);
      setScrollEvent(true);
    } else {
      filteringValue.headline = filteringValue.headline.length > 6 ? filteringValue.headline.slice(0, 6) + '...' : filteringValue.headline;
      let headerContainerLi = document.querySelector('.li-0');
      if(headerContainerLi instanceof HTMLLIElement){
        headerContainerLi.setAttribute('id', 'filtering-css');
      }
    }
    
    setHeaderList([filteringValue.headline, filteringValue.date, ...filteringValue.country]);
  }, [filteringValue]);

  // Filtering Function
  useEffect(() => {
    // Headline
    if(filteringValue.headline !== '전체 헤드라인' && filteringValue.headline.length !== 0){

      if(filteringValue.date !== '전체 날짜' && filteringValue.date.length !== 0){

        if(filteringValue.country[0] !== '전체 국가' && filteringValue.country.length !== 0){
          // Headline + Date + Country
          headlinePlusDatePlusCountry(filteringValue, krToEn, setArticleArray, setScrollEvent, dispatch);
        } else {
          // Headline + Date
          headlinePlusDate(filteringValue, setArticleArray, setScrollEvent, dispatch);
        }

      } else if(filteringValue.country[0] !== '전체 국가' && filteringValue.country.length !== 0){
        // Headline + Country
        headlinePlusCountry(filteringValue, krToEn, articleState, setArticleArray, setScrollEvent, dispatch);
      } else {
        // Headline
        headlineFilter(filteringValue, articleState, setArticleArray, setScrollEvent, dispatch);
      }

    } else if (filteringValue.date !== '전체 날짜' && filteringValue.date.length !== 0){

      if(filteringValue.country[0] !== '전체 국가' && filteringValue.country.length !== 0){
        // Date + Country
        datePlusCountry(filteringValue, krToEn, setArticleArray, setScrollEvent, dispatch);
      } else {
        // Date
        dateFilter(filteringValue, setArticleArray, setScrollEvent, dispatch);
      }

    } else if(filteringValue.country[0] !== '전체 국가' && filteringValue.country.length !== 0){
      // Country
      countryFilter(filteringValue, krToEn, articleState, setArticleArray, setScrollEvent, dispatch);
    }

  }, [filteringValue]);

  // Scroll Event
  useEffect(() => {
    const timer = setInterval(() => {
      if(scrollEvent){
        window.addEventListener('scroll', scrollHandle);
      } else {
        return
      }
    }, 100);

    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', scrollHandle);
    }
  });

  // Footer UI
  useEffect(() => { 
    if(location.pathname === '/user'){
      let mainFooter = document.querySelector('.main-footer');
      let userFooter = document.querySelector('.user-footer');
      if(mainFooter instanceof HTMLElement){
        mainFooter.style.visibility = 'hidden';
      }
      if(userFooter instanceof HTMLElement){
        userFooter.style.zIndex = '100';
      }

      let footerHome = document.querySelector('.user-footer-home');
      let footerScrap = document.querySelector('.user-footer-scrap');
      if(footerHome instanceof HTMLLIElement && footerScrap instanceof HTMLLIElement){
        footerScrap.style.opacity = '0.5';
        footerHome.style.opacity = '1';
      }
    } else {
      let footerHome = document.querySelector('.user-footer-home');
      let footerScrap = document.querySelector('.user-footer-scrap');
      if(footerScrap instanceof HTMLLIElement && footerHome instanceof HTMLLIElement){
        footerHome.style.opacity = '0.5';
        footerScrap.style.opacity = '1';
      }
    }
  }, [location.pathname]);

  // Modal On
  useEffect(() => {
    if(modalOn){
      let modalContainer = document.querySelector('.modal-container');
      if(modalContainer instanceof HTMLElement){
        modalContainer.style.zIndex = '100';
        modalContainer.style.opacity = '1';
      }
    }
  }, [modalOn]);


  return (
    <>
    <header>
      <ul className='header-container'>
        {
          headerList.map((value, i) => {
            return(
              <li className={`header-li li-${i}`} key={i} onClick={() => {
                setModalOn(true);
              }}>{headerListIcon[i]}{value}</li>
            )
          })
        }
      </ul>
    </header>

    <main>
      <div className="main-container">
        {
          articleArray.map((value, i) => {
            return(
              <a className="link-article" href={`${value.url}`} key={i}>
                <article>
                  <div className="article-top">
                    <h1>{value.headline}</h1>
                    <button id={value.article_id} aria-label="scrapButton" className="scrap-button" onClick={(e) => {
                      const findArticle = scrapped.find(v => v.article_id === value.article_id);
                      let buttonEl = document.getElementById(`${value.article_id}`);
                      if(findArticle === undefined){
                        axios.post('/add', {
                          article_id : value.article_id,
                          headline : value.headline,
                          byline : value.byline,
                          date : value.date,
                          source : value.source,
                          keyword : value.keyword,
                          url : value.url
                        });
                        if(buttonEl instanceof HTMLButtonElement){
                          buttonEl.style.color = 'rgb(255, 180, 35)';
                        }
                        window.alert('스크랩 되었습니다.');
                      } else {
                        axios.post('/delete', {article_id : value.article_id});
                        if(buttonEl instanceof HTMLButtonElement){
                          buttonEl.style.color = 'var(--main-bg)';
                        }
                        window.alert('스크랩 해제 되었습니다.');
                      }
                      setReRendering(!reRendering);
                      e.preventDefault();
                    }}><FontAwesomeIcon icon={faStar} /></button>
                  </div>

                  <ul className="article-bottom">
                    <li className="article-origin">
                      <div>{
                        typeof value.source === 'string' && value.source.length > 15
                        ? value.source.slice(0, 15) + '...'
                        : value.source  
                      }</div>
                      <div>{
                        typeof value.byline === 'string' && value.byline.length > 15
                        ? value.byline.slice(0, 15) + '...'
                        : value.byline
                      }</div>
                    </li>
                    <li className="article-date">{value.date}</li>
                  </ul>
                </article>
              </a>
            )
          })
        }
      </div>
    </main>
    <footer className="user-footer">
      <ul className="user-footer-container">
        <li className="user-footer-home" onClick={() => {
          navigate('/user');
        }}>
          <FontAwesomeIcon className="user-footer-icon" icon={faHouse} />홈
        </li>
        <li className="user-footer-scrap" onClick={() => {
          navigate('/scrap');
        }}>
          <FontAwesomeIcon className="user-footer-icon" icon={faFileLines} />스크랩
        </li>
      </ul>
    </footer>
    </>
  );
}

export default User;
