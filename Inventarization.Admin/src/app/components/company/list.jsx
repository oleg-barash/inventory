import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, ListItem } from 'material-ui/List';
import { browserHistory } from 'react-router'
class Companies extends Component {
    render() {
        let { companies } = this.props;
        let goToCompany = function(id){
            return function(){
                browserHistory.push('/editCompany?id=' + id);
            }
        }
        return (<List>
            {companies.map(item =>
                <ListItem key={item.Id} primaryText={item.Name} onTouchTap={goToCompany(item.Id)}></ListItem>
            )}
        </List>);
    }
}

export default Companies