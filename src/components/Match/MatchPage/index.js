import React, { Fragment } from "react";
import {
  Icon,
  Container,
  Grid,
  Label,
  Table,
  Message
} from "semantic-ui-react";

import DoubleElimination from './types/DoubleElimination';
import FreeForAll from './types/FreeForAll';

export default class MatchPage extends React.PureComponent {
  
  renderTournamentLabel() {
    let state = "Waiting...";
    let color = null;
    if (this.props.tournament.finished) {
      state = "Completed";
      color = "green";
    } else if (this.props.tournament.started) {
      state = "In Progress";
      color = "orange";
    }
    return <Label color={color} content={state} />;
  }

  renderRanking() {
    return (
      <Fragment>
        <h2>Ranking</h2>
        <Table compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>#</Table.HeaderCell>
              <Table.HeaderCell>Player</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.tournament.ranking.map((player, $index) => (
              <Table.Row>
                <Table.Cell>{$index + 1}</Table.Cell>
                <Table.Cell>{player}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Fragment>
    );
  }

  renderTournament() {
    let TournamentRenderer;
    console.log('tournament', this.props.tournament);
    switch (this.props.tournament.options.type) {
      case 'FreeForAll':
        TournamentRenderer = FreeForAll;
        break;
      case 'DoubleElimination':
        TournamentRenderer = DoubleElimination;
        break;
      default:
        return (
          <Message warning>
            Invalid Tournament Type "{this.props.tournament.options.type}"
          </Message>
        );

    }
    return (
      <TournamentRenderer
        tournament={ this.props.tournament }
      />
    );
  }

  render() {
    return (
      <Container>
        <Grid columns={2}>
          <Grid.Column>
            <h1>
              <Icon name="game" /> Tournament
            </h1>
          </Grid.Column>
          <Grid.Column textAlign="right">
            {this.renderTournamentLabel()}
          </Grid.Column>
        </Grid>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column width={4}>{this.renderRanking()}</Grid.Column>
            <Grid.Column width={12}>{this.renderTournament()}</Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
