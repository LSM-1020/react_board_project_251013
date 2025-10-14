import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import "./BoardDetail.css";

function BoardDetail({user}) {
  const navigate = useNavigate();
  const [post, setPost] = useState(null); //해당 글 id로 요청한 글 객체
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {id} = useParams(); //app.js의 board/:id id파라미터 받아오기
 
  const loadPost = async()=>{ //특정 글 id로 글 1개 요청하기
    try {
      setLoading(true);
      const res = await api.get(`/api/board/${id}`);
      setPost(res.data); //특정글 id객체를 등록
    } catch(err) {
      console.error(err);
      setError("존재하지 않는 글입니다")
      // alert("존재하지 않는 글입니다");
    } finally {
      setLoading(false);
    }
  };
 //글 삭제
const handleDelete = async() => {
  if(!window.confirm("정말 삭제하시겠습니까?")) { //확인누르면 true, 취소누르면 false
    return;
  }
    try{
      const res = await api.delete(`/api/board/${id}`); 
      alert("글 삭제 성공")
      navigate("/board")
    } catch(err){
       console.error(err);
       if(err.response.status == 403) {
          alert("삭제 권한이 없습니다")
       } else {
        alert("삭제 실패")
       }
       
    } 
  }

  useEffect(()=>{
    loadPost();
  },[id]);

  

  
  if(loading) return <p>게시글 로딩중...</p>;
  if(error) return <p style={{color:"red"}}>{error}</p>
  if(!post) return <p style={{color:"red"}}>해당게시글이 존재하지 않습니다</p>
  //로그인 상태이면서 로그인한 유저와 글을쓴 유저가 같을때 참
  const isAuthor = user && user === post.author.username; 

  return (
    <div className="detail-container">
      <h2>{post.title}</h2>
      <p className="author">작성자 : {post.author.username}</p>
      <div className="content">{post.content}</div>

      <div className="button-group">
          <button onClick={()=>navigate("/board")}>글목록</button>
          {/* 로그인한 유저 본인이 쓴 글만 삭제 수정 가능 */}
          {isAuthor && (
            <>  
              <button className="edit-button">수정</button>
              <button className="delete-button" onClick={handleDelete}>삭제</button>
            </>
            )}

      </div>
    </div>
  );
}

export default BoardDetail;
