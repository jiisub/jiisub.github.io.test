import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines, faCalendarCheck, faMagnifyingGlass, faStar, faHouse } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { ArticleType } from "../store";
import Modal from "./Modal";
import { FilteringType, KrToEnType } from "../App";
import axios from 'axios';

/* Filtering Function List */
/** 1. Headline Filtering */
function headlineFilter(filteringValue :FilteringType, scrappedArticle :ArticleType[],
  setScrappedArticle :Dispatch<SetStateAction<ArticleType[]>>) {

  let copyArticleArray :ArticleType[] = [];
  scrappedArticle.map((value) => {
    if(typeof value.headline === 'string'){
      if(value.headline.toLowerCase().includes(filteringValue.headline.toLowerCase())){
        copyArticleArray.push(value);
      }
    }
  });
  setScrappedArticle(copyArticleArray);

}

/** 2. Date Filtering */
async function dateFilter(filteringValue :FilteringType, scrappedArticle :ArticleType[],
  setScrappedArticle :Dispatch<SetStateAction<ArticleType[]>>) {
  
    const dateValue = filteringValue.date.replaceAll('.', '-');
    let copyDateArr :ArticleType[] = []; 
    scrappedArticle.map((value) => {
      if(value.date === dateValue){
        copyDateArr.push(value);
      }
    });

    setScrappedArticle(copyDateArr);

}

/** 3. Country Filtering */
function countryFilter(filteringValue :FilteringType, krToEn :KrToEnType, scrappedArticle :ArticleType[],
  setScrappedArticle :Dispatch<SetStateAction<ArticleType[]>>) {
  let countryFilterArr :ArticleType[] = [];
  let copyArr = [...filteringValue.country];
  krToEn(copyArr);
  copyArr.map((nation) => {
    for(let i = 0; i < scrappedArticle.length; i++){
      if(scrappedArticle[i].keyword.includes(nation)){
        countryFilterArr.push(scrappedArticle[i]);
        return
      }
    }
  });

  setScrappedArticle(countryFilterArr);

}

/** 4. Headline + Date */
function headlinePlusDate(filteringValue :FilteringType, scrappedArticle :ArticleType[],
  setScrappedArticle :Dispatch<SetStateAction<ArticleType[]>>){
  
    const dateValue = filteringValue.date.replaceAll('.', '-');
    let copyDateArr :ArticleType[] = []; 
    scrappedArticle.map((value) => {
      if(value.date === dateValue){
        copyDateArr.push(value);
      }
    });

    let copyArticleArray :ArticleType[] = [];
    copyDateArr.map((value) => {
      if(typeof value.headline === 'string'){
        if(value.headline.toLowerCase().includes(filteringValue.headline.toLowerCase())){
          copyArticleArray.push(value);
        }
      }
    });

    setScrappedArticle(copyArticleArray);
  
}

/** 5. Headline + Country */
function headlinePlusCountry(filteringValue :FilteringType, krToEn :KrToEnType, scrappedArticle :ArticleType[],
  setScrappedArticle :Dispatch<SetStateAction<ArticleType[]>>){

    let countryFilterArr :ArticleType[] = [];
    let copyArr = [...filteringValue.country];
    krToEn(copyArr);
    copyArr.map((nation) => {
      for(let i = 0; i < scrappedArticle.length; i++){
        if(scrappedArticle[i].keyword.includes(nation)){
          countryFilterArr.push(scrappedArticle[i]);
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

    setScrappedArticle(copyArticleArray);

} 

/** 6. Date + Country */
function datePlusCountry(filteringValue :FilteringType, krToEn :KrToEnType, scrappedArticle :ArticleType[],
  setScrappedArticle :Dispatch<SetStateAction<ArticleType[]>>) {

    const dateValue = filteringValue.date.replaceAll('.', '-');
    let copyDateArr :ArticleType[] = []; 
    scrappedArticle.map((value) => {
      if(value.date === dateValue){
        copyDateArr.push(value);
      }
    });

    let countryFilterArr :ArticleType[] = [];
    let copyArr = [...filteringValue.country];
    krToEn(copyArr);
    copyArr.map((nation) => {
      for(let i = 0; i < copyDateArr.length; i++){
        if(scrappedArticle[i].keyword.includes(nation)){
          countryFilterArr.push(scrappedArticle[i]);
          return
        }
      }
    });

    setScrappedArticle(countryFilterArr);

}

/** 7. Headline + Date + Country */
function headlinePlusDatePlusCountry(filteringValue :FilteringType, krToEn :KrToEnType, scrappedArticle :ArticleType[],
  setScrappedArticle :Dispatch<SetStateAction<ArticleType[]>>) {
  
  const dateValue = filteringValue.date.replaceAll('.', '-');
  let copyDateArr :ArticleType[] = []; 
    scrappedArticle.map((value) => {
      if(value.date === dateValue){
        copyDateArr.push(value);
      }
    });

    let countryFilterArr :ArticleType[] = [];
    let copyArr = [...filteringValue.country];
    krToEn(copyArr);
    copyArr.map((nation) => {
      for(let i = 0; i < copyDateArr.length; i++){
        if(scrappedArticle[i].keyword.includes(nation)){
          countryFilterArr.push(scrappedArticle[i]);
          return
        }
      }
    });

    let copyArticleArray :ArticleType[] = [];
    copyDateArr.map((value) => {
      if(typeof value.headline === 'string'){
        if(value.headline.toLowerCase().includes(filteringValue.headline.toLowerCase())){
          copyArticleArray.push(value);
        }
      }
    });

    setScrappedArticle(copyArticleArray);

}


function Scrap(){
  let [filteringValue, setFilteringValue] = useState<FilteringType>({
    headline : '전체 헤드라인',
    date : '전체 날짜',
    country : ['전체 국가']
  });
  const [headerList, setHeaderList] = useState(['전체 헤드라인', '전체 날짜', '전체 국가']);
  const [headerListIcon] = useState([<FontAwesomeIcon className="header-icon" icon={faMagnifyingGlass}/>, <FontAwesomeIcon className="header-icon" icon={faCalendarCheck}/>])
  let [modalOn, setModalOn] = useState(false);
  let [scrappedArticle, setScrappedArticle] = useState<ArticleType[]>([]);
  let [reRendering, setReRendering] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Initial Screen
  useEffect(() => {
    let InitialContainer = document.querySelector('.initial-container');
    let scrapHeader = document.querySelector('.scrap-header');
    async function initScrap(){
      const articleData = await axios.get('http://localhost:8080/article');
      if(articleData.data.result.length === 0){
        if(InitialContainer instanceof HTMLElement && scrapHeader instanceof HTMLElement){
          InitialContainer.style.visibility = 'visible';
          scrapHeader.style.visibility = 'hidden';
        }
      } else {
        if(InitialContainer instanceof HTMLElement && scrapHeader instanceof HTMLElement){
          InitialContainer.style.visibility = 'hidden';
          scrapHeader.style.visibility = 'visible';
        }
        const copyArr :ArticleType[] = [...articleData.data.result];
        setScrappedArticle(copyArr);
      }
    }
    initScrap();
  },[location, reRendering]);

  // Modal ON OFF
  useEffect(() => {
    if(modalOn){
      let modalContainer = document.querySelector('.modal-container');
      if(modalContainer instanceof HTMLElement){
        modalContainer.style.zIndex = '100';
        modalContainer.style.opacity = '1';
      }
    }
  }, [modalOn]);

  // Header UI
  useEffect(() => {
    // Date UI
    if(filteringValue.date === '전체 날짜' || filteringValue.date.length === 0){
      filteringValue.date = '전체 날짜';
      let headerContainerLi = document.querySelector('.li-1');
      if(headerContainerLi instanceof HTMLLIElement){
        headerContainerLi.setAttribute('id', '');
      }
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
    } else {
      filteringValue.headline = filteringValue.headline.length > 6 ? filteringValue.headline.slice(0, 6) + '...' : filteringValue.headline;
      let headerContainerLi = document.querySelector('.li-0');
      if(headerContainerLi instanceof HTMLLIElement){
        headerContainerLi.setAttribute('id', 'filtering-css');
      }
    }
    
    setHeaderList([filteringValue.headline, filteringValue.date, ...filteringValue.country])
  }, [filteringValue]);

  // Filtering Function
  useEffect(() => {
    // Headline
    if(filteringValue.headline !== '전체 헤드라인' && filteringValue.headline.length !== 0){

      if(filteringValue.date !== '전체 날짜' && filteringValue.date.length !== 0){

        if(filteringValue.country[0] !== '전체 국가' && filteringValue.country.length !== 0){
          // Headline + Date + Country
          headlinePlusDatePlusCountry(filteringValue, krToEn, scrappedArticle, setScrappedArticle);
        } else {
          // Headline + Date
          headlinePlusDate(filteringValue, scrappedArticle, setScrappedArticle);
        }

      } else if(filteringValue.country[0] !== '전체 국가' && filteringValue.country.length !== 0){
        // Headline + Country
        headlinePlusCountry(filteringValue, krToEn, scrappedArticle, setScrappedArticle);
      } else {
        // Headline
        headlineFilter(filteringValue, scrappedArticle, setScrappedArticle);
      }

    } else if (filteringValue.date !== '전체 날짜' && filteringValue.date.length !== 0){

      if(filteringValue.country[0] !== '전체 국가' && filteringValue.country.length !== 0){
        // Date + Country
        datePlusCountry(filteringValue, krToEn, scrappedArticle, setScrappedArticle);
      } else {
        // Date
        dateFilter(filteringValue, scrappedArticle, setScrappedArticle);
      }

    } else if(filteringValue.country[0] !== '전체 국가' && filteringValue.country.length !== 0){
      // Country
      countryFilter(filteringValue, krToEn, scrappedArticle, setScrappedArticle);
    } else {
      let getItem = localStorage.getItem('scrapList');
      const scrapList = JSON.parse(getItem || "");
      let copyArr = [...scrapList];
      setScrappedArticle(copyArr);
    }

  }, [filteringValue]);

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

  return(
    <div className="scrap-container">
      <div className="initial-container">
        <FontAwesomeIcon icon={faFileLines} className="initial-icon" />
        <p>저장된 스크랩이 없습니다.</p>
        <button onClick={() => {
          navigate('/user');
        }}>스크랩 하러 가기</button>
      </div>

      <header className="scrap-header">
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
            scrappedArticle.map((value, i) => {
              return(
                <a className="scrap-link-article" href={`${value.url}`} key={i}>
                  <article className="scrap-article">
                    <div className="scrap-article-top">
                      <h1>{value.headline}</h1>
                      <button type="submit" id={value.article_id} aria-label="scrapButton" className="scrap-button" onClick={(e) => {
                        const idx = scrappedArticle.findIndex(v => v.article_id === value.article_id);
                        let copyArr = [...scrappedArticle];
                        copyArr.splice(idx, 1);
                        setScrappedArticle(copyArr);
                        axios.post('/delete', {article_id : value.article_id});
                        window.alert('스크랩 해제 되었습니다.');
                        setReRendering(!reRendering);
                        e.preventDefault();
                      }}><FontAwesomeIcon icon={faStar} /></button>
                    </div>
                    <div className="scrap-article-bottom">
                      <div className="scrap-article-origin">
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
                      </div>
                      <div className="scrap-article-date">{value.date}</div>
                    </div>
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
      <Modal setFilteringValue={setFilteringValue} modalOn={modalOn} setModalOn={setModalOn}></Modal>
    </div>
  )
}

export default Scrap
