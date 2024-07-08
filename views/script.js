const handleProfile = ({show , hide})=>{
    const Show = document.getElementById(show)
    const Hide = document.getElementById(hide)
    Show.style.display='block'
    Hide.style.display='none'
}

handleUpvoteColor = (isUpvoted)=>{
    const upvoteBtn = document.getElementById('qp-upvote').firstElementChild
    upvoteBtn.style.color = isUpvoted?'green':'black'
}