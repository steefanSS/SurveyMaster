import React ,{Component} from 'react';
import StripeCheckOut from 'react-stripe-checkout';
import {connect} from 'react-redux';
import * as actions from '../actions';

class Payments_Stripe extends Component{
    render(){

        return(
            <StripeCheckOut
                name="Survely"
                description="5$ USD for email credits"
                amount={500}
                token={token => this.props.handleToken(token)}
                stripeKey={process.env.REACT_APP_STRIPE_KEY}
            >
                <button className="btn">
                    Add Credits
                </button>
            </StripeCheckOut>
        )
    }

}

export default connect(null, actions)(Payments_Stripe);