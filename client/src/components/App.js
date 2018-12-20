import React, {Component} from 'react';
import {BrowserRouter,Route} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../actions';
import Landing from './Landing';
import Dashboard from './Dashboard';
import SurveyNew from './surveys/SurveyNew';

import Header from './Header';

class App extends Component {
    //reasons for using componentDidMount for our ajax requests is because there is little difference in
    //speed request between componentWillMount and it, also componentWillMount may get behaviour change in future React releases
    componentDidMount(){
        this.props.fetchUser()
    }

    render(){
        return (
            <div>
                <BrowserRouter>
                    <div className="container">
                        <Header/>
                        <Route exact path="/" component={Landing}/>
                        <Route exact path="/surveys" component={Dashboard}/>
                        <Route path='/surveys/new' component={SurveyNew}/>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default connect(null,actions)(App);