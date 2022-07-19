import { isValidSubnetEntry, SUBNET_ERROR } from './subnet-entry'

describe('isValidSubnetEntry', () => {
  it('Should return True', () => {
    expect(isValidSubnetEntry('172.22.7.*').isValid).toBeTruthy()
    expect(isValidSubnetEntry('172.22.7.22').isValid).toBeTruthy()
    expect(isValidSubnetEntry('172.22.7.*:8080').isValid).toBeTruthy()
    expect(isValidSubnetEntry('172.22.7.22/21:8080').isValid).toBeTruthy()
    expect(isValidSubnetEntry('172.22.7.22:65535').isValid).toBeTruthy()
    expect(isValidSubnetEntry('172.22.7.22:1').isValid).toBeTruthy()
    expect(isValidSubnetEntry('172.22.7.22/18').isValid).toBeTruthy()
    expect(isValidSubnetEntry('172.22.7.22/32').isValid).toBeTruthy()
    expect(isValidSubnetEntry('172.22.7.10-20').isValid).toBeTruthy()
    expect(isValidSubnetEntry('172.22.7.0-255').isValid).toBeTruthy()
    expect(isValidSubnetEntry('172.22.7.0-255:8080').isValid).toBeTruthy()
    expect(isValidSubnetEntry('0.0.0.0').isValid).toBeTruthy()
    expect(isValidSubnetEntry('255.255.255.255').isValid).toBeTruthy()
  })
  it('Should return False', () => {
    expect(isValidSubnetEntry('172.22.*').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.*/21').isValid).toBeFalsy()
    expect(isValidSubnetEntry('a.b.c.d').isValid).toBeFalsy()
    expect(isValidSubnetEntry('a.b.c.d:8080').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.22.*').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.22.35').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.56.**:8080').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.56.**:abc').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.56**:abc').isValid).toBeFalsy()
    expect(isValidSubnetEntry('1.2.3.**a').isValid).toBeFalsy()
    expect(isValidSubnetEntry('1.2.3.**8080').isValid).toBeFalsy()
    expect(isValidSubnetEntry('1.2.3.a**').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.22/17').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.22/33').isValid).toBeFalsy()
    expect(isValidSubnetEntry('256.256.256.256').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.256').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.2562').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.*256').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.256*:').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.**:').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.***:').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.*:*:').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.:*256').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.:*256:8080').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.:*256:8080/22').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.:*256:999999').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.:*256:999999/22').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7./').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.:/').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.:*/').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.*:/').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.:').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.*:').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.:**').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.8080*').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.8080/').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.8080:').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.8080/:').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.8080*/:').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.8080:*/').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.256/21').isValid).toBeFalsy()
    expect(isValidSubnetEntry('172.22.7.22/222').isValid).toBeFalsy()
    expect(isValidSubnetEntry('0.0.0.0:').isValid).toBeFalsy()
    expect(isValidSubnetEntry('0.0.0.0/').isValid).toBeFalsy()
    expect(isValidSubnetEntry('a').isValid).toBeFalsy()
    expect(isValidSubnetEntry('abcd').isValid).toBeFalsy()
    expect(isValidSubnetEntry('192.168.0.10-192.168.0.20').isValid).toBeFalsy()
    expect(isValidSubnetEntry('192.168.10-20.0').isValid).toBeFalsy()
    expect(isValidSubnetEntry('192.168.0.10-280').isValid).toBeFalsy()
    expect(isValidSubnetEntry('192.168.0.20-10').isValid).toBeFalsy()
    expect(isValidSubnetEntry('192.168.0.10-10').isValid).toBeFalsy()
    expect(isValidSubnetEntry('192.168.0.10-10:8080').isValid).toBeFalsy()
  })
  it('reason should be undefined', () => {
    expect(isValidSubnetEntry('172.22.7.22/18').reason).toBeUndefined()
    expect(isValidSubnetEntry('172.22.7.22/32').reason).toBeUndefined()
  })
  it('reason should contain errors', () => {
    expect(isValidSubnetEntry('172.22.7.22/0').reason).toBe(SUBNET_ERROR.SUBNET_TOO_SMALL)
    expect(isValidSubnetEntry('172.22.7.22/17').reason).toBe(SUBNET_ERROR.SUBNET_TOO_SMALL)
    expect(isValidSubnetEntry('172.22.7.22/33').reason).toBe(SUBNET_ERROR.SUBNET_TOO_BIG)
    expect(isValidSubnetEntry('172.22.7.**').reason).toBe(SUBNET_ERROR.TOO_MANY_ASTERISKS)
    expect(isValidSubnetEntry('172.22.*').reason).toBe(SUBNET_ERROR.GENERIC)
  })
})
