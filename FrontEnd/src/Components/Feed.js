import React,{useEffect, useState} from 'react'
import { Card,CardHeader,styled,CardMedia,IconButton,CardContent,CardActions,Collapse,Avatar,Box,Container,TextField,Button,Typography,Link } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { red } from '@mui/material/colors';
import axios from 'axios';
import Navbar from './Navbar';
import UploadFeed from './UploadFeed'
// import image1 from './398086.jpg'
// import image2 from './cr7.jpeg'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import InfiniteScroll from 'react-infinite-scroll-component';
import Stack from '@mui/material/Stack';
import { deepOrange, deepPurple } from '@mui/material/colors';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function Feed() {
  const [expanded, setExpanded] = useState(false);
  const [allPosts, setAllPosts] = useState([])
  const [userId, setUserId] = useState()
  const [postId, setPostId] = useState()
  const [likes, setLikes] = useState()
  const [comment,setComment] = useState('')
  const [newPostUploaded,setNewPostUploaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [totalPosts, setTotalPosts] = useState()
  const [next, setNext] = useState(2)
  const [hasMore,setHasMore]=useState(true)
  const [profilePicture, setProfilePicture] = useState()
  const [userName, setUserName] = useState()
  let token = localStorage.getItem("token");

  useEffect(() => {
   
  }, [])
  

  useEffect(() => {
    // setTimeout(() => {
    axios.get('http://localhost:8080/api/posts/pos/update?page=1&limit=2',{headers:{Authorization:JSON.parse(token)}})
    .then((response) => {
      console.log(response)
      setAllPosts(response.data.results);
      setNext(response.data.next.page)
      setTimeout(() =>{
        setLoading(false)
      },2000)
    })  
    axios.get('http://localhost:8080/api/posts/timeline/allPosts',{headers:{Authorization:JSON.parse(token)}})
    .then((response) => {
      console.log(response)
      setTotalPosts(response.data.length);
    })
  // }, 5000);
    let temp = JSON.parse(localStorage.getItem("userData"))
    console.log("temp");
    setUserId(temp._id)
    if(temp.profilePicture){
      setProfilePicture(temp.profilePicture)
  }
  else{
  let firstName = temp.firstname[0]
  let lastName = temp?temp.lastname[0]:""
  setUserName(firstName+lastName)
  }
  }, [newPostUploaded,likes,comment])
  
  const handleExpandClick = () => {
    setExpanded((expanded)=>!expanded);}

  const handleLikes = async (id) => {
    console.log(id);
    console.log(userId);
    let url = `http://localhost:8080/api/posts/${id}/like`
    await axios.put(url,{userId:userId})
    setLikes('')
  }
  const handleComment = async (id) => {
    let url = `http://localhost:8080/api/posts/${id}/comments`
    let commentData = {userId:userId,comment:comment}
    await axios.put(url,commentData)
    setComment('')
  }

  const fetchData =async () => {
   const result = await axios.get(`http://localhost:8080/api/posts/pos/update?page=${next}&limit=2`,{headers:{Authorization:JSON.parse(token)}})
    // .then((response) => {
      // console.log(response)
      // setAllPosts([...allPosts,response.data.results]);
      // setNext(response.data.next.page)
      // setTimeout(() =>{
      //   setLoading(false)
      // },2000)
    // } )  
    return result.data.results
  } 
  const fetchData1 = async() => {
   const data=await fetchData();
   console.log(data)
   setTimeout(()=>{
    setAllPosts([...allPosts,...data])

   },2000)
   if(data.length === 0 || data.length<2){
     setHasMore(false)
   }
   setNext(next+1)
    }
    console.log(next)
console.log(hasMore)

  console.log(allPosts);
  // console.log(loading);
  console.log(totalPosts);

  return (
    <React.Fragment>
      <Navbar />
      <UploadFeed post={{setNewPostUploaded}}/>
      <Container maxWidth="xl" sx={{ bgcolor: '#ccc', justifyContent: "center",display: "flex" , alignItems:'center',flexDirection:"column"}}
      >
      <InfiniteScroll
      dataLength={allPosts.length} //This is important field to render the next data
      next={fetchData1}
      hasMore={hasMore}
      loader={<Skeleton sx={{ height: 550}} animation="wave" variant="rectangular" />}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>You have seen all posts</b>
        </p>
      }
      >
      {allPosts ? allPosts.map((post,index)=>
      <Card sx={{mt:3,maxWidth: 745}} key={index}>
        {loading ? (
          <Skeleton sx={{ height: 550}} animation="wave" variant="rectangular" />
        ) : (
        <CardMedia
          component="img"
          height="550"
          image={post.img}
          alt="Paella dish"
        /> )}
        {console.log(post.img)}
        <CardContent>
        {loading ? (
          <Skeleton animation="wave" variant="body1" />
        ) : (
          <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{fontSize: 20}}
          >
            {post.desc}
            {/* {post._id} */}
          </Typography>
        )}
        </CardContent>
        
        <CardActions disableSpacing>
        {loading ? (
          <Skeleton animation="wave" variant="h3" sx={{width:750}}/>
        ) : (
          <>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon onClick={()=>{handleLikes(post._id);setLikes(post.likes.length)}} sx={post.likes.length>0?{color:"red"}:{color:"#ccc"}}/>
          </IconButton>
          {post.likes.length>0?<Typography sx={{mr:2}}>{post.likes.length}</Typography>:null}
          <TextField
          id="email"
          label="Write a comment"
          color="primary"
          variant="outlined"
          size="small"
          sx={{ mr:3,width: 500, color: "primary" }}
          onChange={(e)=>setComment(e.target.value)}
          // required
          >
          </TextField>
          <Button 
          variant="outlined" 
          color="primary" 
          component="span"
          onClick={()=>handleComment(post._id)}
          >
            Comment
          </Button>
          <ExpandMore
            expand={expanded}
            onClick={()=>handleExpandClick()}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </>)}
        </CardActions>

        <Collapse
        in={expanded} 
        timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>Comments:</Typography>
            <br />
            {/* {post.comments?
            <Stack direction="row" spacing={2}>
                {profilePicture?
                <Avatar 
                height="50"
                sx={{ml:158}}
                alt="Profile Picture" 
                src={profilePicture}
                // onClick={handleClick}
                />:
                <Avatar
                sx={{bgcolor:deepOrange[500],ml:158}}
                // aria-controls={show ? 'basic-menu' : undefined}
                aria-haspopup="true"
                // aria-expanded={show ? 'true' : undefined}
                // onClick={handleClick}
                >
                {userName}
                </Avatar>} */}
                <Typography>{post.comments.map((comment)=><><p>{comment.comment}</p><br /></>)}</Typography>
              {/* </Stack> */}
            {/* :null} */}
          </CardContent>
        </Collapse>
      </Card>):null}
      </InfiniteScroll>
      </Container>
    </React.Fragment>
  )
}

export default Feed

  