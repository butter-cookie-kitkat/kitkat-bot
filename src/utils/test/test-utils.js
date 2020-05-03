import chai from 'chai';
import Chance from 'chance';
import Sinon from 'sinon';

export function testable(command) {
  return async (infoOverrides, ...args) => {
    const info = {
      client: {
        music: {
          songs: [],
        },
      },
      message: {
        channel: {
          send: Sinon.stub(),
        },
        reply: Sinon.stub(),
      },
      ...infoOverrides,
    };

    await command.command(info, ...args);

    return info;
  };
}

export const chance = new Chance();
export const expect = chai.expect;
export const sinon = Sinon;
