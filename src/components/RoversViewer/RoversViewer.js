// Здесь вам нужно реализовать вью

// Подключите его к редакс роутеру
// Вам потребуются селекторы для получения выбранного сола
// и списка фотографий

// Так же вы будете диспатчить экшены CHANGE_SOL и FETCH_PHOTOS_REQUEST
// Эти экшены находятся в модуле ROVER PHOTOS
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import RoverPhotos from '../RoverPhotos';
import SelectSol from '../SelectSol';
import { connect } from 'react-redux';
import { changeSol, fetchPhotosRequest } from '../../modules/RoverPhotos';
import {
  getSol,
  getPhotos,
  getIsLoadedCurry,
  getErrorCurry
} from '../../modules/RoverPhotos';
import { getKey } from '../../modules/Auth';

const styles = {};

class RoverViewer extends Component {
  state = { curSol: 1 };
  rovers = ['curiosity', 'opportunity', 'spirit'];

  componentDidMount() {
    const {
      auth,
      fetchPhotosRequest,
      sol: { current }
    } = this.props;
    this.rovers.forEach(function(elem) {
      fetchPhotosRequest({ key: auth.apiKey, name: elem, sol: current });
    });
  }

  render() {
    const {
      sol: { current, min, max },
      photos,
      changeSol,
      isLoaded,
      error
    } = this.props;

    return (
      <Grid container justify={'center'}>
        <Grid item>
          <SelectSol
            changeSol={changeSol}
            minSol={min}
            maxSol={max}
            selectedSol={current}
          />
        </Grid>
        <Grid item container direction="row" wrap="nowrap" spacing={8}>
          {this.rovers.map(elem => {
            if (
              isLoaded(elem)(current)(photos) &&
              !error(elem)(current)(photos)
            ) {
              return (
                <RoverPhotos
                  name={elem}
                  photos={photos[elem][current].photos}
                  current={current}
                  key={elem}
                />
              );
            } else if (isLoaded(elem)(current)(photos)) {
              return (
                <Grid key={elem} item xs={4}>
                  {'Ошибка загрузки'}
                </Grid>
              );
            }
          })}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  sol: getSol(state),
  photos: getPhotos(state),
  auth: getKey(state),
  isLoaded: getIsLoadedCurry(state),
  error: getErrorCurry(state)
});
const mapDispatchToProps = { changeSol, fetchPhotosRequest };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(RoverViewer));
