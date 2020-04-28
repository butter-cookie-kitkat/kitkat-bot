import chai from 'chai';
import Chance from 'chance';
import Sinon from 'sinon';

export async function executeCommand(command, ...args) {
  const message = {
    reply: Sinon.stub()
  };

  await command.command(message, ...args);

  return message;
}

export const chance = new Chance();
export const expect = chai.expect;
export const sinon = Sinon;
