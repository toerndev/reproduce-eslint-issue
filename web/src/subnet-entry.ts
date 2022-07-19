function isNumberInRange(val: string, min: number, max: number): boolean {
  if (val.length === 0) {
    return false;
  }

  const castedVal = Number(val);
  if (isNaN(castedVal)) {
    return false;
  }
  return castedVal >= min && castedVal <= max;
}

export enum SUBNET_ERROR {
  GENERIC,
  SUBNET_TOO_SMALL,
  SUBNET_TOO_BIG,
  TOO_MANY_ASTERISKS,
}

interface IValidSubnetEntryProps {
  readonly isValid: boolean;
  readonly reason?: SUBNET_ERROR;
}

export function isValidSubnetEntry(input: string): IValidSubnetEntryProps {
  const addressBlocks = input.trim().split(".");

  if (addressBlocks.length !== 4) {
    return { isValid: false, reason: SUBNET_ERROR.GENERIC };
  }

  for (let i = 0; i < 4; i++) {
    if (i !== 3) {
      if (!isNumberInRange(addressBlocks[i], 0, 255)) {
        return { isValid: false, reason: SUBNET_ERROR.GENERIC };
      }
    } else {
      const numOfAsterisks = addressBlocks[i].split("*").length - 1;
      const CIDRAffixIndex = addressBlocks[i].indexOf("/");
      const colonIndex = addressBlocks[i].indexOf(":");

      if (numOfAsterisks > 1) {
        return { isValid: false, reason: SUBNET_ERROR.TOO_MANY_ASTERISKS };
      }

      if (numOfAsterisks === 1 && CIDRAffixIndex > 0) {
        return { isValid: false, reason: SUBNET_ERROR.GENERIC };
      }

      if (colonIndex === 0 || CIDRAffixIndex === 0) {
        return { isValid: false, reason: SUBNET_ERROR.GENERIC };
      }

      if (numOfAsterisks !== 0 || CIDRAffixIndex !== 0) {
        const numbersRegex = /\d{1,3}?(?=[/:])/;
        const matchArray = addressBlocks[i].match(numbersRegex);

        if (
          matchArray === null &&
          !isNaN(Number(addressBlocks[i])) &&
          !isNumberInRange(addressBlocks[i], 0, 255)
        ) {
          return { isValid: false, reason: SUBNET_ERROR.GENERIC };
        }

        if (matchArray !== null && !isNumberInRange(matchArray[0], 0, 255)) {
          return { isValid: false, reason: SUBNET_ERROR.GENERIC };
        }
      }

      if (numOfAsterisks === 1) {
        if (!addressBlocks[i][0].startsWith("*")) {
          return { isValid: false, reason: SUBNET_ERROR.GENERIC };
        }

        if (!addressBlocks[i].includes(":") && addressBlocks[i].length > 1) {
          return { isValid: false, reason: SUBNET_ERROR.GENERIC };
        }
      }

      if (
        (CIDRAffixIndex > 0 &&
          colonIndex > 0 &&
          !isNumberInRange(
            addressBlocks[i].slice(CIDRAffixIndex + 1, colonIndex),
            18,
            32
          )) ||
        (CIDRAffixIndex > 0 &&
          colonIndex < 0 &&
          !isNumberInRange(addressBlocks[i].slice(CIDRAffixIndex + 1), 18, 32))
      ) {
        // Is entered value a valid entry, but not supported?
        if (
          isNumberInRange(addressBlocks[i].slice(CIDRAffixIndex + 1), 0, 32)
        ) {
          return { isValid: false, reason: SUBNET_ERROR.SUBNET_TOO_SMALL };
        }

        if (
          isNumberInRange(
            addressBlocks[i].slice(CIDRAffixIndex + 1, colonIndex),
            0,
            32
          )
        ) {
          return { isValid: false, reason: SUBNET_ERROR.SUBNET_TOO_BIG };
        }

        return { isValid: false, reason: SUBNET_ERROR.GENERIC };
      }

      if (
        colonIndex > 0 &&
        !isNumberInRange(addressBlocks[i].slice(colonIndex + 1), 0, 65535)
      ) {
        return { isValid: false };
      }

      const DashIndex = addressBlocks[i].indexOf("-");

      if (DashIndex > 0) {
        const begin = addressBlocks[i].slice(0, DashIndex);
        const end =
          colonIndex < 0
            ? addressBlocks[i].slice(DashIndex + 1)
            : addressBlocks[i].slice(DashIndex + 1, colonIndex);

        if (!isNumberInRange(begin, 0, 255) || !isNumberInRange(end, 0, 255)) {
          return { isValid: false, reason: SUBNET_ERROR.GENERIC };
        }

        if (Number(begin) >= Number(end)) {
          return { isValid: false, reason: SUBNET_ERROR.GENERIC };
        }
      }
    }
  }

  return { isValid: true };
}
