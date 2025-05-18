export type Agent = {
  name: string;
  username: string;
  repId: string;
  department: string;
  permissions: { open: boolean; pay: boolean };
  enabled: boolean;
};

export const agents: Agent[] = [
  { name: "Brown, James", username: "JB127", repId: "W7333", department: "Technical Support", permissions: { open: false, pay: false }, enabled: true },
  { name: "Mitchell, Kevin", username: "KM744", repId: "B1921", department: "Customer Support", permissions: { open: false, pay: false }, enabled: true },
  { name: "White, Timothy", username: "TW175", repId: "A4872", department: "Sales", permissions: { open: false, pay: false }, enabled: true },
  { name: "Moore, Linda", username: "LM777", repId: "S9194", department: "Customer Support", permissions: { open: true, pay: false }, enabled: false },
  { name: "Smith, John", username: "JS888", repId: "A1001", department: "Technical Support", permissions: { open: false, pay: false }, enabled: false },
  { name: "Taylor, Alice", username: "AT555", repId: "B2002", department: "Sales", permissions: { open: false, pay: false }, enabled: false },
  { name: "Clark, Emma", username: "EC333", repId: "C3003", department: "Customer Support", permissions: { open: false, pay: false }, enabled: false },
  { name: "Walker, David", username: "DW444", repId: "D4004", department: "Technical Support", permissions: { open: false, pay: false }, enabled: false },
  { name: "Hall, Olivia", username: "OH222", repId: "E5005", department: "Sales", permissions: { open: false, pay: false }, enabled: false },
  { name: "Allen, Michael", username: "MA111", repId: "F6006", department: "Customer Support", permissions: { open: false, pay: false }, enabled: false },
  { name: "Young, Sophia", username: "SY777", repId: "G7007", department: "Technical Support", permissions: { open: false, pay: false }, enabled: false },
  { name: "King, Daniel", username: "DK999", repId: "H8008", department: "Sales", permissions: { open: false, pay: false }, enabled: false },
  { name: "Wright, Mia", username: "MW666", repId: "I9009", department: "Customer Support", permissions: { open: false, pay: false }, enabled: false },
  { name: "Scott, Lucas", username: "LS333", repId: "J1010", department: "Technical Support", permissions: { open: false, pay: false }, enabled: false },
  { name: "Green, Lily", username: "LG888", repId: "K1111", department: "Sales", permissions: { open: false, pay: false }, enabled: false },
  { name: "Baker, Henry", username: "HB222", repId: "L1212", department: "Customer Support", permissions: { open: false, pay: false }, enabled: false },
  { name: "Adams, Grace", username: "GA444", repId: "M1313", department: "Technical Support", permissions: { open: false, pay: false }, enabled: false },
  { name: "Nelson, Jack", username: "JN555", repId: "N1414", department: "Sales", permissions: { open: false, pay: false }, enabled: false },
  { name: "Carter, Chloe", username: "CC666", repId: "O1515", department: "Customer Support", permissions: { open: false, pay: false }, enabled: false },
  { name: "Mitchell, Ella", username: "EM777", repId: "P1616", department: "Technical Support", permissions: { open: false, pay: false }, enabled: false },
  { name: "Perez, Leo", username: "LP888", repId: "Q1717", department: "Sales", permissions: { open: false, pay: false }, enabled: false },
  { name: "Roberts, Zoe", username: "ZR999", repId: "R1818", department: "Customer Support", permissions: { open: false, pay: false }, enabled: false },
  { name: "Turner, Max", username: "MT101", repId: "S1919", department: "Technical Support", permissions: { open: false, pay: false }, enabled: false },
  { name: "Phillips, Ava", username: "AP202", repId: "T2020", department: "Sales", permissions: { open: false, pay: false }, enabled: false },
  { name: "Campbell, Ryan", username: "RC303", repId: "U2121", department: "Customer Support", permissions: { open: false, pay: false }, enabled: false },
  { name: "Evans, Ruby", username: "RE404", repId: "V2222", department: "Technical Support", permissions: { open: false, pay: false }, enabled: false },
  { name: "Edwards, Oscar", username: "OE505", repId: "W2323", department: "Sales", permissions: { open: false, pay: false }, enabled: false },
]; 