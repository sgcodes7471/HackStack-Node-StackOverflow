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

const handleUpvoteQuestion = async (questionid)=>{
    try {
        const response = await fetch(`http://localhost:3000/api/question/${questionid}/upvote-question`,{
            method:'POST',
        })
        const data = await response.data;
        if(data.error){
            alert('Some Error Occured')
            return
        }
        alert(data.message) 
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
     if(data.error){
         alert('Some Error Occured')
         return
     }
     alert(data.message) 
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
        if(data.error){
            alert('Some Error Occured')
            return
        }
        alert(data.message) 
      } catch (error) {
       alert('Some Error Occured')
      }
}
const handleDelAnswer = async (answerid)=>{
    try {
        const response = await fetch(`http://localhost:3000/api/profile/${answerid}/del-answer`,{
            method:'DELETE',
        })
        const data = await response.data;
        if(data.error){
            alert('Some Error Occured')
            return
        }
        alert(data.message) 
      } catch (error) {
       alert('Some Error Occured')
      }
}