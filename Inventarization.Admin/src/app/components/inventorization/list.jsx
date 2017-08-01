import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, ListItem } from 'material-ui/List';
import { browserHistory } from 'react-router'
class Inventorizations extends Component {
    render() {
        let { inventorizations } = this.props;
        let goToInventorization = function(id){
            return function(){
                browserHistory.push('/editInventorization?id=' + id);
            }
        }
        return (<List>
                    {inventorizations.map(item => 
                        <ListItem key={item.Id} primaryText={item.Name} onTouchTap={goToInventorization(item.Id)}></ListItem>
                    )}
                </List>);
    }
}

export default Inventorizations