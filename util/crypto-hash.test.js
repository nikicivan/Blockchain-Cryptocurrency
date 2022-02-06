const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {
  it('generates a SHA-256 hashed output', () => {
    expect(cryptoHash('sometext')).toEqual(
      '4dc3e73377cdd7e99575e2764681dc7846a10f792573231294cbe4c94761c172'
    );
  });

  it('produces the same hash with the same input arguments in any order', () => {
    expect(cryptoHash('one', 'two', 'three')).toEqual(
      cryptoHash('three', 'one', 'two')
    );
  });

  it('produces a unique hash when the properties have changed on an input', () => {
    const sometext = {};
    const originalHash = cryptoHash('sometext');
    sometext['a'] = 'a';

    expect(cryptoHash(sometext)).not.toEqual(originalHash);
  });
});
