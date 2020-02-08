// import { create } from 'apisauce';

import { Profile } from './Profile';

import {
  HEARTBEAT_INTERVAL,
  SESSION_SEPARATOR,
  TICK_INTERVAL
} from '../constants';

export class StandardProfile extends Profile {
  // static apiClient = create({
  //   baseURL: '//www.example.com',
  //   headers: { Accept: 'application/json' },
  // });

  static log({
    buffer,
    history,
    keywords,
    value
  }) {
    console.log(
      'STATS\n\n',
      `Current input value: ${value}\n`,
      `Input buffer: ${buffer}\n`,
      `Input history: ${history}\n`,
      `Keywords entered: ${keywords}\n`
    )
  }

  async didTick() {
    const {
      buffer,
      debug,
      heartbeat,
      history,
      isTyping,
      reportPath,
      value
    } = this.state;

    const keywords = Array.from(new Set(this.state.keywords.map(w => history.match(w) && history.match(w)[0])));
    const isHeartbeat = heartbeat > HEARTBEAT_INTERVAL;
    const lastUpdated = new Date().toLocaleString();

    if (!isTyping && value.length > 1) {
      const snapshot = {
        buffer,
        history: history.split(SESSION_SEPARATOR).filter(Boolean),
        keywords: keywords.filter(Boolean),
        value
      };

      const isUniqueSnapshot = JSON.stringify(snapshot) !== JSON.stringify(this.state.snapshot);

      if (debug) {
        StandardProfile.log(Object.assign(snapshot, { history }));
      }

      if (reportPath && isHeartbeat && isUniqueSnapshot) {
        // StandardProfile.apiClient.post(reportPath, snapshot);

        this.setState({ snapshot });
      }
    }

    this.setState({ lastUpdated });
  }

  getInitialState(state) {
    const { getSetInputHistoryById } = this.delegate;
    const history = getSetInputHistoryById.call(this);

    setInterval(StandardProfile.tick.bind(this), TICK_INTERVAL);

    return {
      ...state,

      buffer: SESSION_SEPARATOR,
      disableCache: false,
      debug: false,
      keywords: state.keywords || [],
      heartbeat: 0,
      history,
      lastUpdated: new Date().toLocaleString(),
      snapshot: {},
      value: ''
    };
  }
}
