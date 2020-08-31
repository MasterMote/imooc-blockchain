import React, { Component } from 'react';
import {Button,Layout} from 'antd';
import {BrowserRouter,Route,Link} from 'react-router-dom'
import Header from './components/Header'
import Create from './pages/Create'
import Course from './pages/Course'
import Detail from './pages/Detail'
import Qa from './pages/Qa'

const {Footer,Content} = Layout

class App extends Component {
  render(){
    return(

      <BrowserRouter className="App">
   
          <Layout>
            <Header></Header>
            <Content>
              <Route path="/" exact component={Course}></Route>
              <Route path="/qa" component={Qa}></Route>
              <Route path="/create" component={Create}></Route>
              <Route path="/detail/:address" component={Detail}></Route>
            </Content>
            <Footer style={{ textAlign: 'center' }}>©️2020 IMOOC ON BlOCKCHAIN</Footer>
          </Layout>

      </BrowserRouter>

    );
  }
}

export default App;
