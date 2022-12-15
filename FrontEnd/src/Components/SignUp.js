import React,{useState} from 'react'
import { Card,CardHeader,Box,Container,TextField,Button,Typography,Link } from '@mui/material';
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

function SignUp() {
    const [validPassword, setValidPassword] = useState()
    const [firstName,setFirstName] = useState('')
    const [lastName,setLastName] = useState('')
    const [email,setEmail] = useState()
    const [password,setPassword] = useState()
    const [signUpData,setSignUpData] = useState()
    const [errors, seterrors] = useState({ email: '', password: '',firstName:'',lastName:'' });
    let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    let navigate = useNavigate()
    const [open, setOpen] = useState(false);

    // const handleClick = () => {
    //   setOpen(true);
    // };
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };

    const checkPasswordValidity = (e) => {
        let password = e.target.value
        // console.log(password);
        if(password.length<6){
            setValidPassword(false)
            console.log("length not good");
        }
        else if(format.test(password)&&(/\d/.test(password))){
            setValidPassword(true)
            console.log("includes symbol&number");
        }
        // else if{(/\d/.test(password))
        //     setValidPassword(true)
        //     console.log("includes number");
        // }
    }

    const validate = () => {
      console.log(email);
      let flag = false;
      if(firstName===''){
        seterrors((prevState) => ({
          errors: { ...prevState.errors, firstName: "FirstName cannot be empty" },
        }));
        flag = true;
      }else{
          seterrors((prevState) => ({
            errors: { ...prevState.errors, firstName: "" },
          }));}
  if(lastName===''){
    seterrors((prevState) => ({
      errors: { ...prevState.errors, lastName: "LastName cannot be empty" },
    }));
    flag = true;
  }else{
      seterrors((prevState) => ({
        errors: { ...prevState.errors, lastName: "" },
      }));}
      if (password === "") {
        // seterrors({...errors,password:'Password cannot be empty'})
        seterrors((prevState) => ({
          errors: { ...prevState.errors, password: "Password cannot be empty" },
        }));
        flag = true;
      } else if (
        /^(?=.*\d)(?=.*[a-z]).{6,20}$/.test(password) === false
      ) {
        // seterrors({...errors,password:'Invalid Password'})
        seterrors((prevState) => ({
          errors: { ...prevState.errors, password: "Invalid Password" },
        }));
        flag = true;
      } else {
        seterrors((prevState) => ({
          errors: { ...prevState.errors, password: "" },
        }));
      }
      if (email === "") {
        // seterrors({...errors,email:'Email cannot be empty'})
        seterrors((prevState) => ({
          ...prevState.errors,
          email: "Email cannot be empty",
        }));
        flag = true;
      } else if (
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) ===
        false
      ) {
        // seterrors({...errors,email:'Invalid Email'})
        seterrors((prevState) => ({
          ...prevState.errors,
          email: "Invalid Email",
        }));
        flag = true;
      } else {
        seterrors((prevState) => ({ ...prevState.errors, email: "" }));
      }
      if (flag) {
        return false;
      } else {
        return true;
      }
    };
console.log(errors);
    const SignUpButton = async () => {
        let temp = {
            firstname : firstName,
            lastname : lastName,
            email : email,
            password : password,
            isAdmin : true
        }
        if(validate()){
        await axios.post('http://localhost:8080/api/auth/register', temp)
        setSignUpData(temp)
        console.log(temp);
        if(validPassword){
            // alert("Account created")
            setOpen(true)
            setTimeout(() => {
                navigate('/login')
              }, 1000);
        }
        else{
            alert("Password must include at least 6 characters,one symbol and number")
        }
        setOpen(true)
            setTimeout(() => {
                navigate('/login')
              }, 1000);
            }
    }

  return (
    <React.Fragment>
        <Container maxWidth="xl" sx={{ bgcolor: '#ccc', display: "flex", justifyContent: "center" }}
            >
                <Card sx={{ maxWidth: "50%", my: 10, textAlign: 'center', overflow: "auto" }}>
                    <Box
                    component="form"
                    sx={{'& > :not(style)': { mx: 4, my: 1 }
                    }}
                    >
                    <br />
                    <Typography sx={{ mt:2,fontSize: 29, textAlign: 'center' }} color="text.secondary" gutterBottom>
                      Sign-up
                    </Typography>
                    <br />
                    <TextField
                    id="name"
                    label="First Name"
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ width: 300, color: "primary" }}
                    onChange={(e)=>{setFirstName(e.target.value);validate()}}
                    error={errors.firstName?true:false}
                    helperText={errors.firstName}
                    required
                    />
                    <br />
                    <TextField
                    id="name"
                    label="Last Name"
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ width: 300, color: "primary" }}
                    onChange={(e)=>{setLastName(e.target.value);validate()}}
                    error={errors.lastName?true:false}
                    helperText={errors.lastName}
                    required
                    />
                    <br />
                    <TextField
                    id="email"
                    type="email"
                    label="Email"
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ width: 300, color: "primary" }}
                    onChange={(e)=>{setEmail(e.target.value);validate()}}
                    error={errors.email?true:false}
                    helperText={errors.email}
                    required
                    />
                    <br />
                    <TextField
                    id="password"
                    type="password"
                    label="Password"
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ width: 300, color: "primary" }}
                    onChange={(e)=>{checkPasswordValidity(e);setPassword(e.target.value);validate()}}
                    error={errors.password?true:false}
                    helperText={errors.password}
                    required
                    />
                    <br />
                    {/* {validPassword?
                    null
                    :
                    <>
                    <Typography
                    variant="subtitle2" 
                    >
                        Password must include at least one special character and one number
                    </Typography>
                    <br />
                    </>} */}
                    <Button 
                    // type="submit"
                    variant="contained"
                    color="primary"
                    onClick={()=>SignUpButton()}
                    >
                    SignUp
                    </Button>
                    <br />
                    <br />
                    <Typography>Already have an account? <Link href="#" onClick={()=>navigate('/login')}>Login!</Link></Typography>
                    </Box>
                  <Snackbar
                      anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                      }}
                      open={open}
                      autoHideDuration={4000}
                      onClose={handleClose}
                  >
                      <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                          Account Created!
                      </Alert>
                  </Snackbar>
                </Card>

        </Container>
    </React.Fragment>
  )
}

export default SignUp