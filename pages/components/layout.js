import React from 'react';

export default props =>{
    return(<div style={{backgroundColor :'red'}} >
        <h1>Vaccine-Tracker</h1>
        {props.children}
        <h1>Footer</h1>
    </div>

    );
};