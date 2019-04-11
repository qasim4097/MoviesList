import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Sortable from 'react-bootstrap-table-next';
import { FaEdit, FaTrash } from 'react-icons/fa';
import io from 'socket.io-client';
let SocketUrl = 'http://localhost:5000';

const Movie = props => (
    <div>
        <Link to={'/edit/'+props.id} title='Edit Movie'><FaEdit /></Link>
        <Link to='/movies' onClick={props.onClick} title='Delete Movie'><FaTrash/></Link>
    </div>
)

const MovieRating = props => (
    <div>
        {props.movie.movie_rating}/5
        {props.canRate() ? <Link to={'/rate/'+props.id} title='Rate Movie'><FaTrash/></Link>: ''}
    </div>
)

export default class MoviesList extends Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.onDelete = this.onDelete.bind(this);
        this.state = {
            socket: null,
            movies: [],
            movie_ratings: [],
            columns: [{
                dataField: 'movie_name',
                text: 'Name',
                sort: true,
                onSort: (field, order) => {
                    localStorage.setItem('field', field);
                    localStorage.setItem('order', order);
                }
            },
            {
                dataField: 'movie_duration',
                text: 'Duration',
                sort: true,
                onSort: (field, order) => {
                    localStorage.setItem('field', field);
                    localStorage.setItem('order', order);
                }

            }, {
                dataField: 'movie_description',
                text: 'Description',
                sort: true,
                onSort: (field, order) => {
                    localStorage.setItem('field', field);
                    localStorage.setItem('order', order);
                }
            },{
                dataField: 'movie_rating',
                text: 'Rating',
                isDummyField: true,
                csvExport: false,
                formatter: this.ratingsFormatter,
                sort: true,
                onSort: (field, order) => {
                    localStorage.setItem('field', field);
                    localStorage.setItem('order', order);
                }
            },{
                dataField: 'actions',
                text: 'Actions',
                isDummyField: true,
                csvExport: false,
                formatter: this.actionsFormatter,
                },]
        }
    }
    actionsFormatter = (cell, row) => <Movie id={row._id} onClick={() => this.onDelete(row._id)} />;
    ratingsFormatter = (cell, row) => <MovieRating param_id= {this.props.match.params.id} id={row._id} onClick={() => this.Rate(row._id)} movie={row}  canRate={() => this.canRate(row._id)}/>;

    componentDidMount(){
        this._isMounted = true;
        this.initSocket();
        this.loadData();
        const socket = io(SocketUrl)
        socket.on('movie_deleted', (data) => {
            let arr = this.state.movies.filter( function(movie){
                return movie._id !== data
            })
            if (this._isMounted) {
                this.setState({ movies: arr })
            }
        })
        socket.on('movie_added', (data) => {
            let arr = this.state.movies
            if (this._isMounted) {
                this.setState({ movies: arr })
            }
        })
        socket.on('movie_edited', (data, id) => {
            let arr = this.state.movies
            for( var i = 0 ; i<arr.length; i++)
            {
                if (arr[i]._id === id){
                    arr[i] = data
                    arr[i]._id = id
                    arr[i].movie_rating = this.state.movies[i].movie_rating
                }
            }
            if (this._isMounted) {
                this.setState({ movies: arr })
            }
        })
        socket.on('movie_rated', (data, id) => {
            let arr = this.state.movies
            for( var i = 0 ; i<arr.length; i++)
            {
                if (arr[i]._id === id){
                    arr[i].movie_rating = data.rating
                }
            }
            if (this._isMounted) {
                this.setState({ movies: arr })
            }
        })

    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    initSocket(){
        const socket = io(SocketUrl)
        socket.on('connect', ()=> {
            console.log('Connected on Client')
        })
        this.setState({socket})
    }
    loadData(){
        axios.get('http://localhost:4000/')
            .then(res => {
                let sorted_movies = res.data.movies
                if(localStorage.field && localStorage.order){
                    sorted_movies = this.sortField(res.data.movies)
                }
                this.setState({ movies: sorted_movies, movie_ratings: res.data.movie_ratings })
            })
            .catch(function(err){
                console.log(err)
            })
    }

    sortField(movies){
        var textA = ''
        var textB = ''
        movies.sort(function(a, b) {
            if( localStorage.field === 'movie_rating'){
                textA = a[localStorage.field]
                textB = b[localStorage.field]
            }
            else if( localStorage.field === 'movie_duration'){
                textA = a[localStorage.field]
                textB = b[localStorage.field]
            }
            else{
                textA = a[localStorage.field].toUpperCase();
                textB = b[localStorage.field].toUpperCase();
            }
            if (localStorage.order === 'asc'){
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            }
            else{
                return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
            }
        });
        return movies
    }

    componentDidUpdate(prevProps, prevState){
        axios.get('http://localhost:4000/')
            .then(res => {
                if(this.state.movies.length !== res.data.movies.length || this.state.movie_ratings.length !==  res.data.movie_ratings.length)
                {    
                    this.setState({ movies: res.data.movies, movie_ratings: res.data.movie_ratings })
                }
            })
            .catch(function(err){
                console.log(err)
            })
    }
    onDelete(id){
        const { socket } = this.state
        const { movies } = this.state

        axios.get('http://localhost:4000/delete/' + id)
            .then(res => {
                let arr = movies.filter((x) => { 
                    if (x._id !== id){
                        return x;
                    }
                    return '';
                 })
                socket.emit('DELETED', id)
                this.setState({ movies: arr})

                this.props.history.push('/movies')
            })
            .catch(function(err){
                console.log(err)
            })
    }

    canRate(id){
        const params = new URLSearchParams(this.props.location.search);
        if( params.get('rated') === localStorage.jwtToken){
            return false;
        }
        for( var i = 0 ; i<this.state.movie_ratings.length; i++)
        {
            if (this.state.movie_ratings[i].movie === id){
                if(this.state.movie_ratings[i]._creator === localStorage.jwtToken)
                {
                    return false;
                }
            }
        }
        return true;
    }

    movieList(){
        return this.state.movies.map(function(currentMovie, index,){
            return <Movie movie={currentMovie} key={index}/>;
        })
    }
    render(){
        return (
            <div className='container'>
                <Sortable 
                    striped
                    hover
                    keyField='_id'
                    key={1}
                    data={ this.state.movies } 
                    columns={ this.state.columns } />
            </div>
        )

    }
};