import React, {Component} from 'react';
import axios from 'axios';
import io from 'socket.io-client';
let SocketUrl = 'http://localhost:5000';

export default class AddMovie extends Component {
    
    constructor(props){
        super(props);

        this.onChangeMovieDescription = this.onChangeMovieDescription.bind(this);
        this.onChangeMovieName = this.onChangeMovieName.bind(this);
        this.onChangeMovieDuration = this.onChangeMovieDuration.bind(this);
        this.onChangeMovieDate = this.onChangeMovieDate.bind(this);
        this.onChangeMovieActors = this.onChangeMovieActors.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            movie_duration: '',
            movie_name: '',
            movie_description: '',
            movie_actors: '',
            movie_release_date: '',
            socket: null
        }
    }
    componentWillMount(){
        this.initSocket();
    }
    onChangeMovieDescription(e){
        this.setState({
            movie_description: e.target.value
        })
    }

    onChangeMovieDuration(e){
        this.setState({
            movie_duration: e.target.value
        })
    }
    onChangeMovieName(e){
        this.setState({
            movie_name: e.target.value
        })
    }
    onChangeMovieDate(e){
        this.setState({
            movie_release_date: e.target.value
        })
    }
    onChangeMovieActors(e){
        this.setState({
            movie_actors: e.target.value
        })
    }
    initSocket(){
        const socket = io(SocketUrl)
        socket.on('connect', ()=> {
            console.log('Connected on Client')
        })
        this.setState({socket})
    }
    onSubmit(e){
        const { socket } = this.state

        e.preventDefault();
        const newMovie = {
            movie_description: this.state.movie_description,
            movie_duration: this.state.movie_duration,
            movie_name: this.state.movie_name
        }

        axios.post('http://localhost:4000/add', newMovie)
            .then(res => {
                socket.emit('ADDED', newMovie)
                this.props.history.push('/movies')
            })
        this.setState({
            movie_duration: '',
            movie_name: '',
            movie_description: '',
        })
    }
    render(){
        return (
            <div style={{marginTop: 20}}>
                <h3>Create New Movie</h3>
                <form onSubmit={this.onSubmit}>
                    <div className='form-group'>
                        <label> Name:</label>
                        <input type='text'
                                className='form-control'
                                value={this.state.movie_name}
                                onChange={this.onChangeMovieName}></input>
                    </div>
                    <div className='form-group'>
                        <label> Duration(hours):</label>
                        <input type='number'
                                className='form-control'
                                value={this.state.movie_duration}
                                onChange={this.onChangeMovieDuration}></input>
                    </div>
                    <div className='form-group'>
                        <label> Description:</label>
                        <input type='text'
                                className='form-control'
                                value={this.state.movie_description}
                                onChange={this.onChangeMovieDescription}></input>
                    </div>
                    <div className='form-group'>
                        <label> Release Date:</label>
                        <input type='date'
                                className='form-control'
                                value={this.state.movie_release_date}
                                onChange={this.onChangeMovieDate}></input>
                    </div>
                    <div className='form-group'>
                        <label> Actors:</label>
                        <input type='text'
                                className='form-control'
                                value={this.state.movie_actors}
                                onChange={this.onChangeMovieActors}></input>
                    </div>
                    <div className='form-group'>
                        <input type='submit' value = 'Create Movie' className= 'btn btn-primary'></input>
                    </div>
                </form>
            </div>
        )
    }
};