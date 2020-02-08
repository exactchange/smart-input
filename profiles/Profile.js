import {
  HEARTBEAT_INTERVAL,
  IS_TYPING_LIMIT,
  SESSION_SEPARATOR,

  Storage
} from '../constants';

export class Profile {
  static async tick() {
    const {
      props: {
        id
      },

      state: {
        buffer,
        disableCache,
        heartbeat,
        isTyping,
        typingInterval
      }
    } = this;

    const historyArray = this.state.history ? this.state.history.split(SESSION_SEPARATOR) : [];
    const history = `${historyArray.slice(0, historyArray.length - 1).join(SESSION_SEPARATOR)}${buffer}`.replace(/null/gi, '');
    const isStillTyping = isTyping && typingInterval < IS_TYPING_LIMIT;
    const isHeartbeat = heartbeat > HEARTBEAT_INTERVAL;

    if (!disableCache) {
      Storage.setItem(`SmartInputCache_${id}`, history);
    }

    await this.setState({
      history,
      heartbeat: isHeartbeat ? 0 : heartbeat + 100,
      isTyping: isStillTyping,
      typingInterval: isStillTyping ? typingInterval + 1 : 0
    });

    this.delegate.didTick.call(this);
  }

  constructor() {
    if (!this.didTick) {
      throw new Error('A Profile instance must implement a `didTick` method.');
    }
  }

  getSetInputHistoryById() {
    const {
      disableCache,
      id
    } = this.props;

    let history = Storage.getItem(`SmartInputCache_${id}`);

    if (!history && !disableCache) {
      Storage.setItem(`SmartInputCache_${id}`, '');

      history = '';
    }

    return `${history}${SESSION_SEPARATOR}`;
  }
}
