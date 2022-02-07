import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const highlight = { //highlight color for squares when winner is announced
  backgroundColor: "#FDFF47"
}
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

// render() {
//     let inputStyle = {
//       border: '1px solid black'
//     };
//     {if(this.state.input.length > 15) {
//       inputStyle.border = '3px solid red'
//       }
//     }
//     return (

  render() {
      // let renderSquare = "";
      // for (let i = 0; i < 9; i++) {
      //   renderSquare += `${this.renderSquare(i)}`;       
      // }
      // let htmlElements = "";       
      // let n = 0;
      // for (let i = 0; i < 3; i++) {
      //   htmlElements += `<div className="board-row">}` + renderSquare.slice(n, n + 45)} + `</div>}`;
      //   n += 45;     
      
        /// let container = document.getElementById("board-row");
        // container.innerHTML = htmlElements;
    return (
    // <div dangerouslySetInnerHTML={{__html: htmlElements}} />

      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        column: null,
        row: null
      }],
      xIsNext: true,
      stepNumber: 0,
      order: 'Ascending',
    };
  
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        column: findColumn(i),
        row: findRow(i)
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      currentSelection : false,
    });
  }
  jumpTo(step) { 
      this.setState({
        stepNumber : step,
        xIsNext : (step % 2) === 0
      });
  }
  ascending() {
    this.setState({
      order: 'Ascending'
     });
    //moves go from first to last 
  }
  descending() {
    this.setState({
      order: 'Descending'
    });
    //moves go from last to first
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const ascendingButton = <button onClick = {() => this.ascending()}>Sort By Ascending Order</button>;
    const descendingButton = <button onClick = {() => this.descending()}>Sort By Descending Order</button>

    const moves = history.map((step,move) => {
      const desc = move ? 
      'Go to move #' + move :
      'Go to game start';
      if (move === 0) {
        return (
        <li key = {move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
          )};
      if (move !== 0 && !this.state.history[move + 1] && this.state.stepNumber === move) {
        return (
          <li key = {move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button> 
            <b>(col: {this.state.history[move].column}, 
            row: {this.state.history[move].row})</b>
          </li>
          );
      } else if (move !== 0 && this.state.stepNumber === move) {
        return (
        <li key = {move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          <b>(col: {this.state.history[move].column}, 
            row: {this.state.history[move].row})</b>
        </li>
        );
      } else {
        return (
        <li key = {move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          (col: {this.state.history[move].column}, 
            row: {this.state.history[move].row}) 
        </li>
        );
      } 
    });
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
            {
              this.state.order === 'Ascending' ? descendingButton : ascendingButton
            } 
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      
      return squares[a];
    }
  }
  return null;
}

function findColumn(i) {
  if (i === 0 || i === 3 || i === 6) return 1;
  if (i === 1 || i === 4 || i === 7) return 2;
  if (i === 2 || i === 5 || i === 8) return 3;
}
function findRow(i) {
  if (i === 0 || i === 1 || i === 2) return 1;
  if (i === 3 || i === 4 || i === 5) return 2;
  if (i === 6 || i === 7 || i === 8) return 3;
}