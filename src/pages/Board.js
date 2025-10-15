import { useEffect, useState } from "react";
import "./Board.css"
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function Board({user}) {

  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError]=useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);


  //게시판 페이징된 글 리스트 요청
  const loadPost = async(page=0)=>{
    try{
      setLoading(true);
      const res = await api.get(`/api/board?page=${page}&size=10`); //모든글 가져오기 요청
      setPosts(res.data.posts); //posts->전체 게시글
      setCurrentPage(res.data.currentPage);//현제 페이지 번호
      setTotalPages(res.data.totalPages);//전체 페이지수
      setTotalItems(res.data.totalItems);//전체 게시글 갯수

    } catch(err){
        console.error(err);
        setError("게시글 조회 실패")
        setPosts([]);//게시글 배열을 다시 초기화
    } finally {
      setLoading(false)
    }
  };

  const handleWrite =()=>{
    //로그인한 유저만 글쓰기 허용
    if(!user) {//참이면 로그인하지 않은경우
      alert("로그인 후 사용가능합니다")
      return;
    }
    navigate("/board/write")
  }

  useEffect(()=>{
   loadPost(currentPage);
  },[currentPage])

  //페이지번호 그룹 배열 반환 함수(10개까지만 표시)
  const getPageNumbers=()=>{
    const startPage = (Math.floor(currentPage/10))*10; 
    const endPage = (startPage+10) > totalPages ? totalPages : (startPage+10) ; //참이면 totalpage,거짓이면startpage+10
    const pages = [];
    for (let i = startPage; i < endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  //날짜 포멧 함수
  const formatDate =(dateString)=>{ //formatDate를 만들어서 dateString이라는 값을 넣어줌
    const date = new Date(dateString); //dateString은 Date타입으로 만들어주고 date라는 이름으로 선언
    return date.toLocaleDateString(); //리턴값은 date.Date타입이라 쓸수있는 toLocaldatestring으로
    //return datdString.substring(0,10);
  }

  return (
    <div className="container">
      <h2>게시판 페이지</h2>
      {loading && <p>게시판 글 리스트 로딩중...</p>}
      {error && <p style={{color:"red"}}>{error}</p>}
      <table className="board-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>글쓴이</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {/* {posts.map((item)=>( //반복해서 데이터를 뽑기위해 map사용, map에 item을 넣는데 그 item은 title,id,conent등이 있다
            item.title
          ))} */}

          {posts.length > 0 ? ( //참일때:거짓일때
          posts
            .slice()
            .reverse() //최신글이 위로오게
            .map((p, index)=> (
              <tr key={p.id}>
                <td>{posts.length - index}</td>
                <td className="click-title" onClick={()=>navigate(`/board/${p.id}`)}>
                  {p.title}
                </td>
                <td>{p.author.username}</td>
                <td>{formatDate(p.createDate)}</td>
              </tr>
              ))
          ):(
            <tr>
              <td colSpan="4">
              게시물이 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* 페이지 번호와 이동화살표 출력 */}
      <div className="pagenation">
        {/* 첫번째 페이지로 이동 */}
        <button onClick={()=>setCurrentPage(0)}
          disabled={currentPage===0}>
          ◀◀
          </button>
        <button onClick={()=>setCurrentPage(currentPage-1)}
          disabled={currentPage===0}>
          ◀
          </button>
          {/* 페이지 번호 그룹 10개씩 출력 */}
          {getPageNumbers().map((num)=>(
            <button className={num === currentPage ? "active":""} onClick={()=>setCurrentPage(num)}>{num+1}</button>
          ))}
          
        <button onClick={()=>setCurrentPage(currentPage+1)}
          disabled={currentPage===(totalPages-1) || totalPages === 0}>
          ▶
        </button>
        {/* 마지막 페이지로 이동 */}
        <button onClick={()=>setCurrentPage(totalPages-1)}
          disabled={currentPage===(totalPages-1) || totalPages === 0}>
          ▶▶
        </button>
      </div>
      <div className="write-button-container">
        <button onClick={handleWrite} className="write-button">글쓰기</button>
      </div>
    </div>
  );
}

export default Board;
