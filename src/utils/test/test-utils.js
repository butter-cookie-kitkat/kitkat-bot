import parser from 'yargs-parser';
import chai from 'chai';
import Chance from 'chance';
import Sinon from 'sinon';
import { concat } from '../concat';

export function testable(command) {
  return async (infoOverrides, args) => {
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

    await command.exec(info, parser(concat(command.name, args)));

    return info;
  };
}

export const chance = new Chance();
export const expect = chai.expect;
export const sinon = Sinon;
