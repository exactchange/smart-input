// import { create } from 'apisauce';

import { Profile } from './Profile';

import {
  HEARTBEAT_INTERVAL,
  SESSION_SEPARATOR,
  TICK_INTERVAL,

  Storage
} from '../constants';

export class CustomerProfile extends Profile {
  // static apiClient = create({
  //   baseURL: '//www.example.com',
  //   headers: { Accept: 'application/json' },
  // });

  static log({
    buffer,
    connectionType,
    emails,
    funnelLength,
    history,
    isUniqueUser,
    keywords,
    referrer,
    browser,
    value
  }) {
    console.log(
      'STATS\n\n',
      `Current input value: ${value}\n`,
      `Input buffer: ${buffer}\n`,
      `Input history: ${history}\n`,
      `Keywords entered: ${keywords}\n`,
      referrer ? `Referred from ${referrer} after visiting ${Math.max(0, funnelLength - 2)} other pages\n` : '',
      `Browser: ${browser}\n`,
      `Connection Type: ${connectionType}\n`,
      `Emails entered: ${emails}\n`,
      `Unique user: ${isUniqueUser}\n`
    )
  }

  didTick() {
    const {
      browser,
      buffer,
      connectionType,
      debug,
      funnelLength,
      heartbeat,
      history,
      isTyping,
      isUniqueUser,
      referrer,
      reportPath,
      value
    } = this.state;

    const emails = `${history},`.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi) || [];
    const isHeartbeat = heartbeat > HEARTBEAT_INTERVAL;
    const keywords = Array.from(new Set(this.state.keywords.map(w => history.match(w) && history.match(w)[0])));
    const lastUpdated = new Date().toLocaleString();

    if (!isTyping && value.length > 1) {
      const snapshot = {
        buffer,
        connectionType,
        funnelLength,
        history: history.split(SESSION_SEPARATOR).filter(Boolean),
        emails,
        isUniqueUser,
        keywords: keywords.filter(Boolean),
        referrer,
        browser,
        value
      };

      const isUniqueSnapshot = JSON.stringify(snapshot) !== JSON.stringify(this.state.snapshot);

      if (debug) {
        CustomerProfile.log(Object.assign(snapshot, { history }));
      }

      if (reportPath && isHeartbeat && isUniqueSnapshot) {
        // CustomerProfile.apiClient.post(reportPath, snapshot);

        this.setState({ snapshot });
      }
    }

    this.setState({
      emails,
      lastUpdated
    });
  }

  getBrowserByUserAgent(userAgent) {
    let browser;

    if (userAgent.match(/Chrome\//gi)) {
      if (userAgent.match(/Chromium\//gi)) {
        browser = 'Chromium';
      }
      else {
        browser = 'Chrome';
      }
    }
    else {
      if (userAgent.match(/Safari\//gi)) {
        browser = 'Safari';
      }
    }

    if (userAgent.match(/Opera\//gi)) {
      browser = 'Opera';
    }

    if (userAgent.match(/MSIE|Trident\//gi)) {
      browser = 'Internet Explorer';
    }

    return browser;
  }

  getInitialState(state) {
    const {
      delegate: {
        getBrowserByUserAgent,
        getSetInputHistoryById
      },

      props: {
        id
      }
    } = this;

    const isUniqueUser = !Storage.getItem(`SmartInputCache_${id}`);

    const browser = getBrowserByUserAgent(window.navigator.userAgent);
    const history = getSetInputHistoryById.call(this);

    setInterval(CustomerProfile.tick.bind(this), TICK_INTERVAL);

    return {
      ...state,

      browser,
      buffer: SESSION_SEPARATOR,
      connectionType: navigator.connection.effectiveType,
      disableCache: false,
      debug: false,
      emails: [],
      funnelLength: window.history.length || 0,
      heartbeat: 0,
      history,
      isUniqueUser,
      keywords: state.keywords || [],
      lastUpdated: new Date().toLocaleString(),
      referrer: document.referrer,
      snapshot: {},
      value: ''
    };
  }
}
