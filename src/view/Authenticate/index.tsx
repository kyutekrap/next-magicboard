"use client";

import React from 'react';
import Recover from '@/view/Authenticate/Recover';
import Login from '@/view/Authenticate/Login';

class Authenticate extends React.Component<{}, { view: number }> {
    
    constructor(props: {}) {
        super(props);
        this.state = {
            view: 0,
        };

        this.renderView = this.renderView.bind(this);
    }

    renderView(viewId: number) {
        this.setState({ view: viewId });
    }

    render() {
        const { view } = this.state;

        return (
            <div className='flex justify-center items-center w-full h-screen px-2'>
                { view === 0 ? (<Login key={0} navigate={this.renderView} />) : (<Recover key={1} navigate={this.renderView} />) }
            </div>
        );
    }
}

export default Authenticate;