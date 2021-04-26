import React, { useState, useEffect } from 'react'
import Navbar from './navbar'
import { makeStyles } from '@material-ui/core'
import axios from 'axios'
import TextField from '@material-ui/core/TextField'
import ReviewCard from './reviewCard'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        '& > *': {
            margin: theme.spacing(5),
            width: theme.spacing(100),
            height: theme.spacing(25),
        },
    },
    cent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addrev: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    errorDiv: {
        display: 'flex',
        justifyContent: 'center',
        margin: theme.spacing(1),
        fontWeight: 'bold'
    }
}))

let cl='red';

const Reviews = () => {
    const classes = useStyles()
    const localStoragee = JSON.parse(localStorage.getItem('profile')).result;

    const [error, setError] = useState("");

    let reviews=localStoragee.reviews
    let complaints=localStoragee.complaints

    const [value, setValue] = React.useState({
        hostel: '',
        comment: '',
        date: '',
    })

    const handleChange = (event) => {
        const newValue = { ...value }
        newValue[event.target.id] = event.target.value
        newValue.date = new Date()
        setValue(newValue)
        console.log(value)
    }
    const handleClick = async (event) => {
        event.preventDefault()
        try {
            const response = await axios.patch(
                `/dashboard/reviews/${localStoragee._id}`,
                value,
            )
            const data=response.data;
            if (Object.keys(data).length == 1) 
                throw data.message;
            localStorage.setItem('profile', JSON.stringify({ ...data }));
            console.log("here");
            cl='green';
            setError("Review registered successfully!!");
            console.log("here2");
            
            setValue({
                hostel: '',
                comment: '',
                date: '',
            });
            console.log("here3");
        } catch (e) {
            console.log(` Axios request failed: ${e}`)
            cl='red';
            setError(`${e}`);
        }
    }
    const handleClick2 = async (event) => {
        event.preventDefault()
        try {
            const response = await axios.patch(
                `/dashboard/complaints/${localStoragee._id}`,
                value,
            )
            const data=response.data;
            if (Object.keys(data).length == 1) 
                throw data.message;
            localStorage.setItem('profile', JSON.stringify({ ...data }));
            cl='green';
            setError("Complaint registered successfully!!");

            setValue({
                hostel: '',
                comment: '',
                date: '',
            });
        } catch (e) {
            console.log(` Axios request failed: ${e}`)
            cl='red';
            setError(`${e}`);
        }
    }
    var i = 0

    return (
        <>
            <Navbar />
            <br />
            <br />
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                }}>
                <div>
                    <h1 className={classes.cent}>Your Reviews</h1>
                    <br />
                    <br />

                    {reviews!=null && reviews.map((rev) => (
                        <div className={classes.root} key={i++}>
                            <ReviewCard
                                title={rev.hostel}
                                value={rev.comment}
                                date={rev.date.toString().substring(0,10)}
                            />
                        </div>
                    ))}
                </div>
                <div>
                    <h1 className={classes.cent}>Your Complaints</h1>
                    <br />
                    <br />

                    {complaints!=null && complaints.map((complaint) => (
                        <div className={classes.root} key={i++}>
                            <ReviewCard
                                title={complaint.hostel}
                                value={complaint.comment}
                                date={complaint.date.toString()}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <br />
            <form className={classes.root} noValidate autoComplete='off'>
                <div>
                    <TextField
                        id='hostel'
                        label='Hostel'
                        placeholder='Hostel Name'
                        value={value.hostel}
                        multiline
                        variant='outlined'
                        onChange={handleChange}
                    />

                    <TextField
                        id='comment'
                        label='Review/Complaint'
                        style={{ marginTop: 10 }}
                        placeholder='Please write your review/complaint'
                        value={value.comment}
                        fullWidth
                        multiline
                        rows={3}
                        // InputLabelProps={{
                        //     shrink: true,
                        // }}
                        variant='outlined'
                        onChange={handleChange}
                    />
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                        }}>
                        <Button
                            type='submit'
                            onClick={handleClick}
                            style={{ marginTop: 10 }}
                            variant='contained'>
                            Submit Review
                        </Button>
                        <Button
                            type='submit'
                            onClick={handleClick2}
                            style={{ marginTop: 10 }}
                            variant='contained'>
                            Submit Complaint
                        </Button>
                    </div>
                </div>
            </form>
            <div className={classes.errorDiv} style={{color:`${cl}`}}>{error}</div>
        </>
    )
}
export default Reviews
