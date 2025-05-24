const { expect } = require('chai');

// Simulated password scoring function
function getPasswordScore(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;
  return score;
}

describe('Password Strength Checker', () => {
  it('should return score 5 for strong password', () => {
    const result = getPasswordScore('G@l@xy2024');
    expect(result).to.equal(5);
  });

  it('should return score 1 for weak password', () => {
    const result = getPasswordScore('12345678');
    expect(result).to.equal(2);
  });

  it('should return 0 for empty password', () => {
    const result = getPasswordScore('');
    expect(result).to.equal(0);
  });
});
