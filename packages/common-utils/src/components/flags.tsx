export const isFlagSet = (value: number, flag: number) =>
{
  // Returns true if the flag is set
  if(value & flag){
    return true
  }
  return false
};

export default isFlagSet;
