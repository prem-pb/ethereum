import React, {Component} from 'react';
import {Form, Input, Message, Button} from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import {Router} from '../routes';

class ContributionForm extends Component{
    state = {
        value:'',
        errorMessage: '',
        loading: false
    };


    onSubmit = async (event) => {
        event.preventDefault();
        const campaign = Campaign(this.props.address);

        this.setState({loading: true, errorMessage:''});

        try{
            const accounts = await web3.eth.getAccounts();

            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });
            Router.replaceRoute(`/campaigns/${this.props.address}`);
        }catch(err){
            this.setState({errorMessage: err.message});
        }
        this.setState({loading: false, value:''});
    };

    render(){
        return(
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Contribution Amount</label>
                    <Input
                        value={this.state.value}
                        onChange={(event) => this.setState({ value: event.target.value })}
                        label="ether"
                        labelPosition="right"
                    />
                </Form.Field>
                <Message
                    error
                    header='There was some errors with your submission'
                    content={this.state.errorMessage}
                />
                <Button primary loading={this.state.loading}>Submit</Button>
            </Form>
        );
    }
}

export default ContributionForm;