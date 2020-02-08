// import { create } from 'apisauce';

import { Profile } from './Profile';

import {
  HEARTBEAT_INTERVAL,
  SESSION_SEPARATOR,
  TICK_INTERVAL
} from '../constants';

export class ReplayProfile extends Profile {
  // static apiClient = create({
  //   baseURL: '//www.example.com',
  //   headers: { Accept: 'application/json' },
  // });

  static log({
    buffer,
    frames,
    history,
    keywords,
    value
  }) {
    console.log(
      'STATS\n\n',
      `Current input value: ${value}\n`,
      `Input buffer: ${buffer}\n`,
      `Input history: ${history}\n`,
      `Keywords entered: ${keywords}\n`,
      `${frames.length} actions recorded`
    )
  }

  didTick() {
    const {
      buffer,
      debug,
      heartbeat,
      history,
      isTyping,
      reportPath,
      value
    } = this.state;

    const frames = Array.from(this.state.frames);
    const keywords = Array.from(new Set(this.state.keywords.map(w => history.match(w) && history.match(w)[0])));
    const isHeartbeat = heartbeat > HEARTBEAT_INTERVAL;
    const lastUpdated = new Date().toLocaleString();

    frames.push(value);

    this.setState({ frames });

    const framesCompressed = Array.from(new Set(frames.map(f => {
      const frequency = (frames.join(',').match(new RegExp(`\\b${f}\\b`, 'g')) || []).length;

      return f && `${f}_x_${frequency}`;
    }))) || [];

    if (!isTyping && value.length > 1) {
      const snapshot = {
        buffer,
        frames: framesCompressed,
        history: history.split(SESSION_SEPARATOR).filter(Boolean),
        keywords: keywords.filter(Boolean),
        value
      };

      const isUniqueSnapshot = JSON.stringify(snapshot) !== JSON.stringify(this.state.snapshot);

      if (debug) {
        ReplayProfile.log(Object.assign(snapshot, { history }));
      }

      if (reportPath && isHeartbeat && isUniqueSnapshot) {
        // ReplayProfile.apiClient.post(reportPath, snapshot);

        this.setState({ snapshot });
      }
    }

    this.setState({ lastUpdated });
  }

  getInitialState(state) {
    const { getSetInputHistoryById } = this.delegate;
    const history = getSetInputHistoryById.call(this);

    setInterval(ReplayProfile.tick.bind(this), TICK_INTERVAL);

    return {
      ...state,

      buffer: SESSION_SEPARATOR,
      disableCache: false,
      debug: false,
      frames: [],
      heartbeat: 0,
      history,
      interval: TICK_INTERVAL,
      keywords: state.keywords || [],
      lastUpdated: new Date().toLocaleString(),
      snapshot: {},
      value: ''
    };
  }
}
