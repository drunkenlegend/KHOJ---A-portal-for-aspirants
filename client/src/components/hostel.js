import React, { useState, useEffect } from 'react'
import Navbar from './customer/navbar'
import { makeStyles, Grid, Button } from '@material-ui/core' 
import "react-datepicker/dist/react-datepicker.css";
import { Link, useParams } from 'react-router-dom';
// import NewBookingCard from './newBookingCard';
import axios from 'axios'
import DatePicker from "react-datepicker";  
import "react-datepicker/dist/react-datepicker.css";

const useStyles = makeStyles((theme) => ({
    cent: {
        display: 'flex', 
        justifyContent:'center',
        alignItems:'center'
    },
    paper: {
        marginLeft: theme.spacing(15),
        marginTop: theme.spacing(5),
        padding: theme.spacing(1),
        textAlign: 'right',
    },
    paper2: {
        marginTop: theme.spacing(6),
        textAlign: 'left',
        // borderRadius: 25,
    },
    paper3: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
        textAlign: 'center',
        borderRadius: 25,
    },
    paper4: {
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2),
        textAlign: 'center',
        borderRadius: 25,
    },
    cent2: {
        margin: '2rem',
    },
    errorDiv: {
        margin: theme.spacing(1),
        color: 'red',
        fontWeight: 'bold'
    },
    successDiv: {
        margin: theme.spacing(1),
        color: 'green',
        fontWeight: 'bold'
    },
}));

const Hostel = (props) => {
    const { id } = useParams()
    const classes = useStyles();
    const [hostel, setHostel] = useState([])
    const [flag, setFlag] = useState(false)
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const todayDate=new Date()
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const localStorageId = JSON.parse(localStorage.getItem('profile')).result._id;
    useEffect(() => {
        const fetchHostel = async () => {
            const res = await axios.get(
                `/hostel/hostel/${id}`,
            )

            setHostel(res.data)
        }

        fetchHostel()
    })

    const handleClick = (e) => {
        if(startDate==undefined && endDate==undefined)
            setError("Start and end dates are not given!!")
        else if(startDate==undefined)
            setError("Start date is not given!!")
        else if(endDate==undefined)
            setError("End date is not given!!")
        else if (
            startDate!=undefined && 
            endDate!=undefined &&
            startDate.getDate()>=endDate.getDate() && 
            startDate.getMonth()>=endDate.getMonth() &&
            startDate.getFullYear()>=endDate.getFullYear()
        )
            setError("End date should be after the start date!!")
        else
        {
            setError("");
            (async () => {
                const res = await axios.patch(
                    `/hostel/book/${id}`,{startDate,endDate,todayDate,localStorageId}
                );
                console.log(res.data)
                setSuccess(res.data);
            })();
        }
    }

    return (
        <>
        <Navbar />
        <br />
        <br />
        <h1 className={classes.cent}>{hostel.name}</h1>
        <br />
        <div className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                <img className={classes.paper} src={hostel.source} alt={hostel.name} width="200" height="200" />
                </Grid>
                <Grid item xs={4} className={classes.paper2}>
                    <h4>Location:</h4>
                    <p>{hostel.address}</p>
                    <br/>
                    <h4>Owner:</h4>
                    <p>{hostel.owner}</p>
                    <br/>
                    <h4>Monthly price:</h4>
                    <p>Rs. {hostel.price}</p>
                    <br/>
                    <h4>Reviews:</h4>
                    {/* <p>{hostel.address}</p> */}
                </Grid>
                <Grid item xs={4} className={classes.paper2}>
                    <div>
                        <h2>Book this hostel:</h2>
                        <br/>
                        <h4>
                            Start Date:
                            <DatePicker className={classes.paper3} selected={startDate} onChange={date => setStartDate(date)} minDate={new Date()} />
                        </h4>
                        <h4>
                            End Date:
                            <DatePicker className={classes.paper4} selected={endDate} onChange={date => setEndDate(date)} minDate={new Date()} />
                        </h4>
                        <Button variant='contained' className={classes.cent2} onClick={handleClick}>
                            Book
                        </Button>
                        <div className={classes.errorDiv}>{error}</div>
                        <div className={classes.successDiv}>{success}</div>
                    </div>
                </Grid>
            </Grid>
        </div>
        </>
    )
}
export default Hostel
