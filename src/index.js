import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

  function Square(props) {
    const squareStyle = {fontWeight: props.isLastMove ? 'bold' : 'normal', backgroundColor: props.isWinningCombo ? '#62ce62' : 'white'};
      return (
        <button 
          className="square" 
          onClick = {props.onClick}
          style = {squareStyle}
        >
          {props.value}
        </button>
      );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      const lastMove = this.props.lastMove;
      const isLastMove = lastMove === i;

      const winningCombo = this.props.winningCombo;
      //how to rewrite using the map()?
      //if(winningCombo) {isWinningCombo.map((combo) => i === combo).includes(true)};
      let isWinningCombo;
      if(winningCombo) {
      for(let j = 0; j < winningCombo.length; j++)
        if (i === winningCombo[j])
          isWinningCombo = true;
      }

      return (<Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isLastMove={isLastMove}
        isWinningCombo={isWinningCombo}
        />);
    }
  
    render() {
      /*return (
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
      );*/

      // !!! the for loop doesn't work like this here
      return (
        <div>
          {[0,1,2].map((row) => (
            <div className='board-row'>
              {[0,1,2].map((column) => (
                this.renderSquare(row*3 + column)
              ))}
            </div>
          ))}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares:Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
            coords: Array(9).fill(null),
            lastMove: '',
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
          return;
        } 

        const coordinates = this.state.coords.slice();
        coordinates[this.state.stepNumber] = this.calculateCoordinates(i);

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
          history: history.concat([{
            squares: squares,
          }]),
          stepNumber:history.length,
          xIsNext: !this.state.xIsNext, 
          coords: coordinates,
          lastMove: i,
        });
      }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step%2 === 0),
        });
    }

    calculateCoordinates(i) {
        const row = Math.floor(i / 3) + 1;
        const col = (i % 3) + 1;
        return [row, col];
      }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];

      const winnerInfo = calculateWinner(current.squares);
      let winner = undefined;
      let winningCombo = undefined;
      if(winnerInfo){
        winner = winnerInfo[0];
        winningCombo = winnerInfo.slice(1);
      }
        
      const lastMove = this.state.lastMove;
      const coordinates = this.state.coords;

      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move + " coordinates: " + coordinates[move-1]:
          'Go to the beginning of the game';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });

      const stepNumber = this.state.stepNumber;
      let status;
      if(winner) {
        status = 'Winner: ' + winner;
      } else if(stepNumber==9){
        status = 'Draw!';
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
                lastMove={lastMove}
                winningCombo={winningCombo}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  function calculateWinner(squares) {
    const lines = [
        [0,1,2], //all "win" combinations
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];

    for(let i = 0; i < lines.length; i++){
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) { 
          return [squares[a],a,b,c];
        }
    }
  }
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  