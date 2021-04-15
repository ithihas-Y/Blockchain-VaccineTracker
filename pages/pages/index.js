import React, { Component } from 'react';
import {Table} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import DeInstance from '../Ethereum/DeInstance';
import Layout from '../components/layout';

class Index extends Component{

    static async getInitialProps(){
        const xx = await DeInstance.methods.
        getVaccines().call();

        let arr = [];
        let details = [];

        for (let i = 0; i < xx.length; i++) {
            let o = await DeInstance.methods.travelHistory(parseInt(xx[i])).call();
            arr.push(o);
        }

        for (let j = 0; j < xx.length; j++) {
            let d = await DeInstance.methods.details(parseInt(xx[j])).call();
            details.push(d);
        }
    
        return {details,xx,arr};

    }

    renderRow(){
        let pp = [];
    

        function getString(params) {
            if(params == true) return "true";
            else return "false";
        } 

        for (let i = 0; i < this.props.xx.length; i++) {
            pp.push(<Table.Row>
                <Table.Cell>{this.props.xx[i]}</Table.Cell>
                <Table.Cell>{this.props.details[i].Manufacturer}</Table.Cell>
                <Table.Cell>{this.props.details[i].CurrentDistributor}</Table.Cell>
                <Table.Cell>{this.props.arr[i].map(j =>{
                    return(<a>[{j[0]},{j[1]}]</a>);

                }
                )}</Table.Cell>
            </Table.Row>);
        }

        return pp;
    }

    render(){
        return(<Layout>
            <div>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Vaccine ID's</Table.HeaderCell>
                            <Table.HeaderCell>Manufacturer</Table.HeaderCell>
                            <Table.HeaderCell>Current Handler</Table.HeaderCell>
                            <Table.HeaderCell>Location</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.renderRow()}
                    </Table.Body>

                </Table>
            </div>
        </Layout>
        );
    }
}

export default Index;