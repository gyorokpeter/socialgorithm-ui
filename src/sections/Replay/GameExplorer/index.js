import React from 'react';
import { Header, Grid, List, Label, Table, Divider } from 'semantic-ui-react';
import UTTT from 'ultimate-ttt';

import UTTTGame from '../../../components/UTTTGame';

class GameExplorer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      games: this.parseGameData(props.gameData),
      activeGame: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      games: this.parseGameData(nextProps.gameData),
    });
  }

  parseGameData = (gameData) => {
    const lines = gameData.split("\n")
      .filter((line) => line.length > 0)
      .map((line) => line.split('] ').pop()
      );
    const games = [];
    let curGame;
    lines.forEach((line) => {
      if (line === 'init') {
        curGame = games.push({
          uttt: new UTTT(),
          moves: [],
        }) - 1;
        return;
      }
      if (line.indexOf(';') < 0) {
        return;
      }
      const game = games[curGame];
      const parts = line.split(' ');
      let turn = parts[0].split(';');
      try {
        let opponent = false;
        if (parts.length > 1) {
          opponent = true;
          turn = parts[1].split(';');
        }
        const board = turn[0].split(',');
        const move = turn[1].split(',');
        game.moves.push({
          board,
          move,
          player: (opponent) ? 2 : 1,
        });
        if (opponent) {
          game.uttt.move(board, 2, move);
        } else {
          game.uttt.move(board, 1, move);
        }
      } catch(e) {
        console.error('Error', line, curGame, games);
        throw e;
      }
    });
    return games;
  };

  printWinner = (winner) => {
    let color = 'grey';
    let text = 'Tied';
    if (winner === 1) {
      color = 'green';
      text = 'won';
    } else if (winner === 2) {
      color = 'red';
      text = 'lost'
    }
    return (
      <Label color={ color }>
        { text }
      </Label>
    );
  };

  render() {
    return (
      <Grid>
        <Grid.Column width={ 4 }>
          <Header>Games</Header>
          <List selection divided relaxed>
            { this.state.games.map((game, $index) => (
              <List.Item key={ $index } active={ $index === this.state.activeGame } onClick={ () => { this.setState({ activeGame: $index }); } }>
                <List.Content>
                  { this.printWinner(game.uttt.winner) } { game.uttt.moves } moves
                </List.Content>
              </List.Item>
            )) }
          </List>
        </Grid.Column>
        <Grid.Column width={ 12 }>
          <Grid columns={ 2 } stackable>
            <Grid.Column>
              <Header>Game</Header>
              <UTTTGame style={ { fontSize: '0.7em' } } game={ this.state.games[this.state.activeGame].uttt } />
              <Divider />
              <p><Label empty circular color='blue' horizontal /> You</p>
              <p><Label empty circular color='red' horizontal /> Opponent</p>
            </Grid.Column>
            <Grid.Column>
              <Header>Moves</Header>
              <Table selectable inverted striped>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>#</Table.HeaderCell>
                    <Table.HeaderCell>Board</Table.HeaderCell>
                    <Table.HeaderCell>Move</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  { this.state.games[this.state.activeGame].moves.map((data, $index) => (
                    <Table.Row key={ $index }>
                      <Table.Cell>
                        <Label circular color={ (data.player === 1)? 'blue' : 'red' }>{ $index + 1 }</Label>
                      </Table.Cell>
                      <Table.Cell>{ data.board.join(', ') }</Table.Cell>
                      <Table.Cell>{ data.move.join(', ') }</Table.Cell>
                    </Table.Row>
                  )) }
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid>
    );
  }
}

GameExplorer.propTypes = {
  gameData: React.PropTypes.string.isRequired,
};

export default GameExplorer;
