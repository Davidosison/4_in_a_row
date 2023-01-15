import './App.css'
import React from "react";

export default class App extends React.Component {
    state = {
        rows: 6,
        columns: 7,
        moves: [],
        playerTurn: 'red',
    };

    resetBoard = () => {
        this.setState({moves: [], winner: null});
    }

    getPiece = (x, y) => {
        const list = this.state.moves.filter((item) => {
            return (item.x === x && item.y === y);
        });

        return list[0];
    }

    isWinningPiece = (x, y) => {
        const {winner, winningMoves} = this.state;
        if (!winner) return false;
        return winningMoves.some(item => (item.x === x && item.y === y));
    }


    getWinningMovesForVelocity = (xPosition, yPosition, xVelocity, yVelocity) => {
        const winningMoves = [{x: xPosition, y: yPosition}];
        const player = this.getPiece(xPosition, yPosition).player;

        for (let delta = 1; delta <= 3; delta += 1) {
            const checkX = xPosition + xVelocity * delta;
            const checkY = yPosition + yVelocity * delta;

            const checkPiece = (this.getPiece(checkX, checkY));
            if (checkPiece && checkPiece.player === player) {
                winningMoves.push({x: checkX, y: checkY});
            } else {
                break;
            }
        }

        for (let delta = -1; delta >= -3; delta -= 1) {
            const checkX = xPosition + xVelocity * delta;
            const checkY = yPosition + yVelocity * delta;

            const checkPiece = (this.getPiece(checkX, checkY));
            if (checkPiece && checkPiece.player === player) {
                winningMoves.push({x: checkX, y: checkY});
            } else {
                break;
            }
        }

        return winningMoves;
    }
    checkForWin = (x, y, player) => {
        const velocities = [{x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 1}, {x: 1, y: 1}];
        for (let dex = 0; dex < velocities.length; dex++) {
            const element = velocities[dex];
            const winningMoves = this.getWinningMovesForVelocity(x, y, element.x, element.y);
            if (winningMoves.length > 3) {
                this.setState({winner: this.getPiece(x, y).player, winningMoves});
            }
        }
    }

    addMove = (x, y) => {
        const {playerTurn} = this.state;
        const nextPlayerTurn = playerTurn === 'red' ? 'yellow' : 'red';
        let availableYPosition = null;
        for (let position = this.state.rows - 1; position >= 0; position--) {
            if (!this.getPiece(x, position)) {
                availableYPosition = position;
                break;
            }
        }
        if (availableYPosition !== null) {
            this.setState({
                moves: this.state.moves.concat({x, y: availableYPosition, player: playerTurn}),
                playerTurn: nextPlayerTurn
            }, () => this.checkForWin(x, availableYPosition, playerTurn));
        }
    }

    renderBoard() {
        const {rows, columns, winner} = this.state;
        const rowViews = [];

        for (let row = 0; row < this.state.rows; row += 1) {
            const columnsViews = [];
            for (let column = 0; column < this.state.columns; column += 1) {
                const piece = this.getPiece(column, row);
                const winningPiece = this.isWinningPiece(column, row);
                columnsViews.push(
                    <div onClick={() => {
                        this.addMove(column, row)
                    }} style={{
                        width: '5vw',
                        height: '5vw',
                        backgroundColor: '#00a8ff',
                        display: 'flex',
                        padding: 5,
                        cursor: 'pointer'
                    }}>
                        <div style={{
                            borderRadius: '50%', backgroundColor: 'white', flex: 1, display: 'flex',
                            boxShadow: winningPiece ? '0px 0px 10px #333' : undefined
                        }}>

                            {piece ? <div style={{
                                backgroundColor: piece.player,
                                flex: 1,
                                borderRadius: '50%',
                                borderColor: '1px solid black',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}/> : undefined}
                        </div>
                    </div>
                );
            }
            rowViews.push(
                <div style={{display: 'flex', flexDirection: 'row'}}>{columnsViews}</div>
            );
        }

        return (
            <div id={'board render'}
                 style={{backgroundColor: 'red', display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
                {winner && <div onClick={this.resetBoard} style={{
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,.3)',
                    left: 0, right: 0, bottom: 0, top: 0,
                    zIndex: 3,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}></div>}
                {rowViews}
            </div>
        );
    }

    render() {
        const {style} = this.props;
        const {playerTurn, winner} = this.state;
        return (
            <div style={{...styles.container, backgroundColor: playerTurn}}>
                <div>
                    <div style={{
                        margin: 'auto',
                        marginBottom: '50px',
                        alignItems: 'center',
                        alignContent: 'center',
                        fontSize: '30px',
                        display: 'flex',
                        textAlign: 'center',
                        position: 'relative',
                        justifyContent: 'center',
                    }}>
                        This is a connect 4 game created using React by David.
                    </div>

                    <button style={{
                        margin: 'auto',
                        marginBottom: '10px',
                        alignItems: 'center',
                        alignContent: 'center',
                        fontSize: '25px',
                        display: 'flex',
                        padding: 10,
                        textAlign: 'center',
                        position: 'relative',
                        justifyContent: 'center',
                    }}
                            onClick={this.resetBoard}>Clear Board
                    </button>

                    <div id={'announcement'} style={{
                        height: '10vw', padding: 10,
                        backgroundColor: 'rgba(0,0,0,.5)', color: '#fff',
                        fontWeight: '200',
                        fontSize: '5vw',
                        textAlign: 'center',
                        alignItems: 'center'
                    }}>
                        {winner && `${winner.toUpperCase()} WINS!!!`}
                    </div>
                    {this.renderBoard()}
                </div>
            </div>
        );
    }
}

const styles = {
    container: {
        height: '-webkit-fill-available',
        padding: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
};
