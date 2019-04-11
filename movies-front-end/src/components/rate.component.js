import React, {Component} from 'react';
import axios from 'axios';
import io from 'socket.io-client';
let SocketUrl = 'http://localhost:5000';

export default class Rate extends Component {
    constructor(props){
        super(props);

        this.onChangeRatingComment = this.onChangeRatingComment.bind(this);
        this.onChangeRating = this.onChangeRating.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            rating: 0,
            comment: '',
            socket: null
        }

    }
    onChangeRating(e){
        this.setState({
            rating: e.target.value
        })
    }

    onChangeRatingComment(e){
        this.setState({
            comment: e.target.value
        })
    }
    initSocket(){
        const socket = io(SocketUrl)
        socket.on('connect', ()=> {
            console.log('Connected on Client')
        })
        this.setState({socket})
    }
    componentWillMount(){
        this.initSocket();
    }
    onSubmit(e){
        const {socket} = this.state
        e.preventDefault();

        const rating = {
            rating: this.state.rating,
            comment: this.state.comment,
            _creator: localStorage.jwtToken,
            movie: this.props.match.params.id
        }

        axios.post('http://localhost:4000/rate/' + this.props.match.params.id, rating)
            .then(res => {
                this.setState({
                    rating: this.state.rating
                })
                socket.emit('RATED', rating, this.props.match.params.id )
                this.props.history.push('/movies')
            })
            .catch(err=> {
                console.log(err)
            })
    }
    render(){
        return (
            <div style={{marginTop: 20}}>
                <h3>Rate Movie</h3>
                <form onSubmit={this.onSubmit}>
                    <div className='form-group'>
                        <label> Comment:</label>
                        <input type='text'
                                className='form-control'
                                value={this.state.comment || ''}
                                onChange={this.onChangeRatingComment}></input>
                    </div>
                    <div className='form-group'>
                        <label> Rating: </label>
                        <input type='number'
                                min="0" max="5" 
                                className='form-control'
                                value={this.state.rating || ''}
                                onChange={this.onChangeRating}></input>
                    </div>
                    <div className='form-group'>
                        <input type='submit' value = 'Create Movie' className= 'btn btn-primary'></input>
                    </div>
                </form>
            </div>
        )
    }
};