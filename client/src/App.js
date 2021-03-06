import React from 'react';
import { fetchFood, fetchDrink, fetchMealId, fetchDrinkId } from './services/api-helper'
import './App.css';
import Header from './components/Header'
import Login from './components/Login'
import MakeCombo from './components/MakeCombo'
import ComboBoard from './components/ComboBoard'
import Nav from './components/Nav'
import RecipeInfo from './components/RecipeInfo'
import AllCombos from './components/AllCombos'
import { createCombo, deleteCombo, getALL, fetchUserCombos } from './services/combos'
import Faves from './components/Faves'

import Footer from './components/Footer'


import { Route, withRouter } from 'react-router-dom'
import {
  createUser,
  verifyToken,
  loginUser,

} from './services/auth';


import ComboDetails from './components/ComboDetails';
import axios from 'axios';
import { updateComment, deleteComment } from './services/comments';




class App extends React.Component {

  constructor() {
    super()
    this.state = {
      currentView: 'login',
      currentUser: null,
      currentCombo: null,
      combos: [],
      allcombos: [],
      favorites: [],
      meal: {
        food: 'Food',
        foodImage: 'https://i.imgur.com/A8GTchf.png',
        foodId: '',
        drink: 'Drink',
        drinkImage: 'https://i.imgur.com/A8GTchf.png',
        drinkId: '',
        isLiked: false
      },

      loginFormData: {
        name: '',
        password: '',
      },
      registerFormData: {
        name: '',
        password: '',
        email: ''
      },
      isToggleOn: true,
      bgColor: ''
    }
  }


  fetchMealDrink = async () => {
    const drinkResp = await fetchDrink();
    // console.log(drinkResp)
    const foodResp = await fetchFood();
    // console.log(foodResp);
    const meal = {
      food: foodResp.strMeal,
      foodImage: foodResp.strMealThumb,
      foodId: foodResp.idMeal,
      drink: drinkResp.strDrink,
      drinkImage: drinkResp.strDrinkThumb,
      drinkId: drinkResp.idDrink,
    }
    this.setState({

      meal: {
        food: foodResp.strMeal,
        foodImage: foodResp.strMealThumb,
        foodId: foodResp.idMeal,
        drink: drinkResp.strDrink,
        drinkImage: drinkResp.strDrinkThumb,
        drinkId: drinkResp.idDrink,
        isLiked: false
      }

    })
    const combo = await createCombo(meal);
    this.setState(prevState => ({
      combos: [combo, ...prevState.combos]
    }));
    console.log(this.state.combos)
  }


  getComboRecipes = async (comboId) => {
    const currentCombo = this.state.combos.find(combo => combo.id === comboId)
    const comboFoodItem = await fetchMealId(currentCombo.foodId)
    const comboDrinkItem = await fetchDrinkId(currentCombo.drinkId)
    this.setState({
      currentCombo: {
        id: comboId,
        meal: comboFoodItem,
        drink: comboDrinkItem,
        comments: currentCombo.comments
      }
    })
    this.props.history.push(`/recipe/${currentCombo.id}`)
  }

  componentDidMount = async () => {

    const user = await verifyToken();

    if (user) {


      this.setState({
        currentUser: user

      })
      this.props.history.push(`/home`)
    }
    console.log(this.state.currentUser)
  }


  handleLoginFormChange = (ev) => {
    const { name, value } = ev.target;
    this.setState(prevState => ({
      loginFormData: {
        ...prevState.loginFormData,
        [name]: value,
      },
    }));
  }

  handleLoginSubmit = async (ev) => {
    ev.preventDefault();
    const user = await loginUser(this.state.loginFormData);
    this.setState({
      loginFormData: {
        name: '',
        password: '',
      },
      currentUser: user,
      currentView: 'welcome'
    })
    this.props.history.push('/home');
    // console.log(user);
    console.log(user)
    const resp = await fetchUserCombos(this.state.currentUser.id);

    // console.log(combos)
    const combos = resp.combos
    this.setState({
      combos: combos.reverse()
    });

  }

  handleLogout = (e) => {
    e.preventDefault();
    localStorage.getItem('authToken')
    localStorage.removeItem('authToken')
    this.setState({
      isLoggedIn: false,
      currentView: 'login',

      loginFormData: {
        name: '',
        password: '',
      }

    })
    console.log(this.state.currentView)
    this.props.history.push('/');
  }


  handleRegisterFormChange = (ev) => {
    const { name, value } = ev.target;

    this.setState(prevState => ({
      registerFormData: {
        ...prevState.registerFormData,
        [name]: value
      }
    }));
  }

  handleRegisterSubmit = async (ev) => {
    ev.preventDefault();
    const user = await createUser(this.state.registerFormData);
    console.log(user);
    this.setState({
      registerForm: {
        name: '',
        password: '',
        email: ''
      },
      currentUser: user,
      currentView: 'welcome'
    });
    this.props.history.push('/home');
  }



  handleComboUpdate = async (comboId) => {

    console.log("combo id: " + comboId)

    console.log(this.state.meal)

    const resp = await axios.put(`https://mealmatchpandas.herokuapp.com/combos/${comboId}`, this.state.meal);
    const favorite = resp.data;
    this.setState(prevState => ({
      favorites: [favorite, ...prevState.favorites]
    }));
    console.log(this.state.favorites)


  }

  handleViewCombos = async () => {

    const combos = await getALL();
    this.setState({
      allcombos: combos.combos
    })
    console.log(this.state.allcombos)
  }

  addNewComment = (comment) => {
    const singleCombo = this.state.combos.find(combo => combo.id === this.state.currentCombo.id)

    this.setState(prevState => ({
      currentCombo: {
        ...prevState.currentCombo,
        comments: [...prevState.currentCombo.comments, comment]
      },
      combos: [...prevState.combos.filter(combo => combo.id !== prevState.currentCombo.id), { ...singleCombo, comments: [...singleCombo.comments, comment] }]
    }))
  }

  putComment = async (id, commentInfo) => {
    const newComment = await updateComment(id, commentInfo)
    debugger;
    const singleCombo = this.state.combos.find(combo => combo.id === this.state.currentCombo.id)
    this.setState(prevState => ({
      currentCombo: {
        ...prevState.currentCombo,
        comments: prevState.currentCombo.comments.map(comment => comment.id === newComment.id ? newComment : comment)
      },
      combos: [...prevState.combos.filter(combo => combo.id !== prevState.currentCombo.id),
      { ...singleCombo, comments: singleCombo.comments.map(comment => comment.id === newComment.id ? newComment : comment) }]
    }))
  }
  destroyComment = async (id) => {
    await deleteComment(id);
    const singleCombo = this.state.combos.find(combo => combo.id === this.state.currentCombo.id)
    this.setState(prevState => ({
      currentCombo: {
        ...prevState.currentCombo,
        comments: prevState.currentCombo.comments.filter(comment => comment.id !== id)
      },
      combos: [...prevState.combos.filter(combo => combo.id !== prevState.currentCombo.id),
      { ...singleCombo, comments: singleCombo.comments.filter(comment => comment.id !== id) }]
    }))
  }

  handleComboDelete = async (e) => {
    e.preventDefault();
    const comboId = e.target.name
    console.log(comboId);
    await deleteCombo(comboId);

    this.setState(prevState => ({
      combos: prevState.combos.filter(combo =>
        combo.id !== parseInt(comboId))
    }))
  }


  toggleAuthView = () => {
    this.setState(prevState => ({
      currentView: prevState.currentView === 'register' ? 'login' : 'register'
    }));
  }

  render() {

    return (
      <div>

        <Header />
        <main>
          <>
            <Route path="/" exact render={() =>

              <Login
                currentView={this.state.currentView}
                registerFormData={this.state.registerFormData}
                handleRegisterSubmit={this.handleRegisterSubmit}
                handleRegisterFormChange={this.handleRegisterFormChange}
                toggleAuthView={this.toggleAuthView}
                loginFormData={this.state.loginFormData}
                handleLoginSubmit={this.handleLoginSubmit}
                handleLoginFormChange={this.handleLoginFormChange}
              />} />
          </>
        </main>
        <div>
          {this.state.currentUser && (
            <>
              <Route path="/home" exact render={() => (
                <>

                  <p>Hello {this.state.currentUser.name}!</p>
                  <MakeCombo
                    isLoggedIn={this.state.isLoggedIn}
                    currentView={this.state.currentView}
                    loginFormData={this.state.loginFormData}
                    handleLogout={this.handleLogout}
                    meal={this.state.meal}
                    fetchMealDrink={this.fetchMealDrink}
                    changeBoard={this.changeBoard}
                  />
                </>
              )} />

              <Route path="/combo" render={() => (
                <ComboBoard

                  getComboRecipes={this.getComboRecipes}
                  handleComboDelete={this.handleComboDelete}
                  isToggleOn={this.state.isToggleOn}

                  handleLogout={this.handleLogout}


                  combos={this.state.combos}
                  handleViewCombos={this.handleViewCombos}
                  handleComboDelete={this.handleComboDelete}
                  handleComboUpdate={this.handleComboUpdate}
                  bgColor={this.state.bgColor}
                />
              )} />

              <Route path="/allcombos" render={() => (
                <AllCombos
                  handleLogout={this.handleLogout}
                  allcombos={this.state.allcombos}
                />
              )} />
              <Route path="/combodetails" render={() => (
                <ComboDetails
                  combo={this.state.meal}
                  handleComboUpdate={this.handleComboUpdate}

                />
              )} />
              <Route path="/favorites" render={() => (
                <Faves
                  favorites={this.state.favorites}
                  handleLogout={this.handleLogout}

                />
              )} />

              <Route path="/recipe/:id" render={() => (
                <RecipeInfo

                  addNewComment={this.addNewComment}

                  putComment={this.putComment}

                  handleLogout={this.handleLogout}
                  destroyComment={this.destroyComment}
                  currentCombo={this.state.currentCombo}

                />
              )} />

            </>
          )}

        </div>
        <Footer />

      </div>
    )
  }
}


export default withRouter(App)