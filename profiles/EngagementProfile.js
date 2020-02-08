// import { create } from 'apisauce';

import { Profile } from './Profile';

import {
  HEARTBEAT_INTERVAL,
  SESSION_SEPARATOR,
  TICK_INTERVAL,
  TIME_UNIT,
  TIME_UNIT_MULTIPLIER
} from '../constants';

export class EngagementProfile extends Profile {
  // static apiClient = create({
  //   baseURL: '//www.example.com',
  //   headers: { Accept: 'application/json' },
  // });

  static log({
    backspaces,
    buffer,
    history,
    keystrokes,
    keywords,
    timeOnPage,
    value,
    wpm
  }) {
    console.log(
      'STATS\n\n',
      `Current input value: ${value}\n`,
      `Input buffer: ${buffer}\n`,
      `Input history: ${history}\n`,
      `Keywords entered: ${keywords}\n`,
      `${timeOnPage} ${TIME_UNIT} on the page\n`,
      `${keystrokes} keystrokes since page load\n`,
      `${backspaces} backspaces since page load\n`,
      `Typing speed: ${wpm} wpm`
    )
  }

  didTick() {
    const {
      backspaces,
      buffer,
      debug,
      heartbeat,
      history,
      isTyping,
      keystrokes,
      reportPath,
      value,
      wpm
    } = this.state;

    const isHeartbeat = heartbeat > HEARTBEAT_INTERVAL;
    const keywords = Array.from(new Set(this.state.keywords.map(w => history.match(w) && history.match(w)[0])));
    const lastUpdated = new Date().toLocaleString();
    const timeOnPage = parseFloat(this.state.timeOnPage + TICK_INTERVAL);

    if (!isTyping && value.length > 1) {
      const snapshot = {
        backspaces,
        buffer,
        history: history.split(SESSION_SEPARATOR).filter(Boolean),
        keystrokes,
        keywords: keywords.filter(Boolean),
        timeOnPage: (timeOnPage / (TICK_INTERVAL * TIME_UNIT_MULTIPLIER)),
        value,
        wpm
      };

      const isUniqueSnapshot = JSON.stringify(snapshot) !== JSON.stringify(this.state.snapshot);

      if (debug) {
        EngagementProfile.log(Object.assign(snapshot, { history }));
      }

      if (reportPath && isHeartbeat && isUniqueSnapshot) {
        // EngagementProfile.apiClient.post(reportPath, snapshot);

        this.setState({ snapshot });
      }
    }

    this.setState({
      lastUpdated,
      timeOnPage
    });
  }

  getInitialState(state) {
    const { getSetInputHistoryById } = this.delegate;
    const history = getSetInputHistoryById.call(this);

    setInterval(EngagementProfile.tick.bind(this), TICK_INTERVAL);

    return {
      ...state,

      backspaces: 0,
      buffer: SESSION_SEPARATOR,
      disableCache: false,
      debug: false,
      heartbeat: 0,
      history,
      keystrokes: 0,
      keywords: state.keywords || [],
      lastUpdated: new Date().toLocaleString(),
      snapshot: {},
      timeOnPage: 0.1,
      value: '',
      wpm: 0
    };
  }
}
