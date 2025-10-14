import { useEffect, useState } from "react";
import "./Board.css"
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function Board({user}) {

  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  //게시판 모든글 요청
  const loadPost = async()=>{
    try{
      const res = await api.get("/api/board"); //모든글 가져오기 요청
      setPosts(res.data); //posts->전체 게시글
    } catch(err){
        console.error(err);
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
   loadPost();
  },[])

  //날짜 포멧 함수
  const formatDate =(dateString)=>{ //formatDate를 만들어서 dateString이라는 값을 넣어줌
    const date = new Date(dateString); //dateString은 Date타입으로 만들어주고 date라는 이름으로 선언
    return date.toLocaleDateString(); //리턴값은 date.Date타입이라 쓸수있는 toLocaldatestring으로
  }



  return (
    <div className="container">
      <h2>게시판 페이지</h2>
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
                <td>{p.title}</td>
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
      <div className="write-button-container">
        <button onClick={handleWrite} className="write-button">글쓰기</button>
      </div>
    </div>
  );
}

export default Board;
