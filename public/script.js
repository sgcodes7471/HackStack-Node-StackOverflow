const handleProfile = ({show , hide})=>{
    const Show = document.getElementById(show)
    const Hide = document.getElementById(hide)
    Show.style.display='block'
    Hide.style.display='none'
}

const handleUpvoteColor = (isUpvoted)=>{
    const upvoteBtn = document.getElementById('qp-upvote').firstElementChild
    upvoteBtn.style.color = isUpvoted?'green':'black'
}

const handleGetQuestion = async(questionid)=>{
    try{
        await fetch(`http://localhost:3000/api/question/${questionid}`,{method:'GET'})
    }catch{
        alert('Network Error')
    }
}

const handleGetProfile = async ()=>{
    try{
        await fetch('http://localhost:3000/api/profile/' , {method:'GET'})
    }catch(error){
        alert('Network Error')
    }
}

const handleLogout = async ()=>{
try {
    const response = await fetch('http://localhost:3000/api/user/logout',{method:'POST'})
    if(response.status >399){
        alert('Logged Out Successfully')
        return
    }
    alert('Some Error Occured')
} catch (error) {
    alert('Network Error')
}}

const handleUpvoteQuestion = async (questionid)=>{
    try {
        const response = await fetch(`http://localhost:3000/api/question/${questionid}/upvote-question`,{
            method:'POST',
        })
        if(response.status >399){
            alert('Some Error Occured')
            return
        } 
    } catch (error) {
        alert('Some Error Occured')
    }
}
const handleUpvoteAnswer = async (answerid, questionid)=>{
   try {
     const response = await fetch(`http://localhost:3000/api/question/${questionid}/upvote-answer/${answerid}`,{
         method:'POST',
     })
     const data = await response.data;
     if(response.status >399){
         alert('Some Error Occured')
         return
     }
   } catch (error) {
    alert('Some Error Occured')
   }
}
const handleDelQuestion = async (questionid)=>{
    try {
        const response = await fetch(`http://localhost:3000/api/profile/${questionid}/del-question`,{
            method:'DELETE',
        })
        const data = await response.data;
        if(response.status >399){
            alert('Some Error Occured')
            return
        }
      } catch (error) {
       alert('Some Error Occured')
      }
}
const handleDelAnswer = async (answerid)=>{
    try {
        const response = await fetch(`http://localhost:3000/api/profile/${answerid}/del-answer`,{
            method:'DELETE',
        })
        if(response.status >399){
            alert('Some Error Occured')
            return
        }
      } catch (error) {
       alert('Some Error Occured')
      }
}