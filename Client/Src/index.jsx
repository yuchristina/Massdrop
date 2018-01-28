import React from 'react';
import {render} from 'react-dom';
import $ from 'jquery';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

const fStyle = {
  textAlign: "center"
};

const tStyle = {
  width: 400
};

const pStyle = {
  margin: "auto",
  padding: 20,
  width: 1000,
  display: "block",
  overflowWrap: "break-word",
  background: "gainsboro"
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      jobid: '',
      results: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUrlSubmit = this.handleUrlSubmit.bind(this);
    this.handleIdSubmit = this.handleIdSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }

  handleUrlSubmit(event) {
    $.get("http://localhost:3000/getId", {url: this.state.url}, (data) => {
      var id = data.substring(1, data.length-1);
      this.setState({results: `Your JobId is: ${id}`});
    });
    event.preventDefault();
  }

  handleIdSubmit(event) {
    $.get("http://localhost:3000/getHtml", {id: this.state.jobid}, (data) => {
      this.setState({results: data});
    });
    event.preventDefault();
  }

  render () {

    return (
      <div>
      <form style={fStyle} onSubmit={this.handleUrlSubmit}>
        <TextField
          style={tStyle}
          id="url"
          label="Submit URL here:"
          value={this.state.url}
          onChange={this.handleChange}
          margin="normal"
        />
        <br/>
        <Button raised color="primary" className="submit" type="submit" value="Submit">
          Submit
        </Button>
      </form>

      <form style={fStyle} onSubmit={this.handleIdSubmit}>
        <TextField
          style={tStyle}
          id="jobid"
          label="Submit JobID here:"
          value={this.state.jobid}
          onChange={this.handleChange}
          margin="normal"
        />
        <br/>
        <Button raised color="primary" className="submit" type="submit" value="Submit">
          Submit
        </Button>
      </form>
      <br/>

      <Paper style={pStyle} elevation={4}>
        <Typography type="title">
        Results: 
        </Typography>
        <br/>
        <Typography type="body2">
        {this.state.results}
        </Typography>
      </Paper>
      </div>
    );
  }
}

render(<App />, document.querySelector('#app'));